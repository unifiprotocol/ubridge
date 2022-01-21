// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

pragma solidity ^0.8.0;

contract UBridge is Ownable, Pausable, ReentrancyGuard, Initializable {
  using SafeERC20 for IERC20;

  uint256 public constant EXPIRATION_TIME = 1 days;

  uint256 public chainId;
  uint256 public count;
  address public verifyAddress;
  bool public pausedDeposits;

  uint256[] public chainIds = new uint256[](0);
  address[] public originAddresses = new address[](0);

  mapping(bytes => bool) public filledSwaps;
  mapping(bytes => bool) public expiredSwaps;
  mapping(uint256 => bool) public chainIdSupported;
  mapping(address => mapping(uint256 => address)) public tokensSupported; // originERC20Addr[chainIdTarget] = targetERC20Addr
  mapping(address => uint256) public chainsSupportedForTokenAddress;

  event Deposit(
    address sender,
    address originTokenAddress,
    address destinationTokenAddress,
    uint256 amount,
    uint256 originChainId,
    uint256 targetChainId,
    uint256 count,
    uint256 expirationDate
  );
  event Withdraw(
    address sender,
    address originTokenAddress,
    address destinationTokenAddress,
    uint256 amount,
    uint256 originChainId,
    uint256 targetChainId,
    uint256 count,
    uint256 expirationDate
  );
  event ExpiredWithdraw(
    address sender,
    address originTokenAddress,
    address destinationTokenAddress,
    uint256 amount,
    uint256 originChainId,
    uint256 targetChainId,
    uint256 count,
    uint256 expirationDate
  );

  modifier whenNotDepositsPaused() {
    require(!pausedDeposits, "Deposits have been suspended");
    _;
  }

  function init(address _verifyAddress, uint256 _chainId) public initializer {
    verifyAddress = _verifyAddress;
    chainId = _chainId;
  }

  function changeVerifySigner(address newVerifier) public onlyOwner {
    require(newVerifier != address(0), "ADDRESS_0");
    verifyAddress = newVerifier;
  }

  function addToken(
    address originTokenAddress,
    address[] memory destinationTokenAddresses,
    uint256[] memory chainIdsTarget
  ) public onlyOwner {
    require(originTokenAddress != address(0), "ADDRESS_0");
    require(destinationTokenAddresses.length == chainIdsTarget.length, "ARRAYS_LENGTH_DIFFER");
    if (chainsSupportedForTokenAddress[originTokenAddress] == 0) originAddresses.push(originTokenAddress);
    chainsSupportedForTokenAddress[originTokenAddress]++;
    for (uint256 i = 0; i < chainIdsTarget.length; i++) {
      require(chainIdSupported[chainIdsTarget[i]], "CHAIN_ID_NOT_SUPPORTED");
      tokensSupported[originTokenAddress][chainIdsTarget[i]] = destinationTokenAddresses[i];
    }
  }

  function addChainId(uint256[] memory newChainId) public onlyOwner {
    for (uint256 i = 0; i < newChainId.length; i++) {
      if (!chainIdSupported[newChainId[i]]) chainIds.push(newChainId[i]);
      chainIdSupported[newChainId[i]] = true;
    }
  }

  function removeToken(address tokenAddress, uint256[] memory chainIdsTarget) public onlyOwner {
    for (uint256 j = 0; j < chainIdsTarget.length; j++) {
      tokensSupported[tokenAddress][chainIdsTarget[j]] = address(0);
    }
    chainsSupportedForTokenAddress[tokenAddress]--;
    if (chainsSupportedForTokenAddress[tokenAddress] > 0) return;
    uint256 i;
    for (i = 0; i < originAddresses.length; i++) {
      if (originAddresses[i] == tokenAddress) break;
    }
    for (;i < originAddresses.length - 1; i++) {
      originAddresses[i] = originAddresses[i+1];
    }
    originAddresses.pop();
  }

  function removeChainId(uint256 _chainId) public onlyOwner {
    require(chainIdSupported[_chainId], "CHAIN_ID_NOT_SUPPORTED");
    uint256 i;
    for (i = 0; i < chainIds.length; i++) {
      if (chainIds[i] == _chainId) break;
    }
    for (;i < chainIds.length - 1; i++) {
      chainIds[i] = chainIds[i+1];
    }
    chainIds.pop();
    chainIdSupported[_chainId] = false;
  }

  // Array getters

  function getChainIds() public view returns(uint256[] memory) {
    return chainIds;
  }

  function getOriginAddresses() public view returns(address[] memory) {
    return originAddresses;
  }
  
  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function changeDepositsState(bool isPaused) public onlyOwner {
    pausedDeposits = isPaused;
  }

  function deposit(
    address originTokenAddress,
    uint256 amount,
    uint256 targetChainId
  ) public nonReentrant whenNotDepositsPaused whenNotPaused {
    require(chainIdSupported[targetChainId], "CHAIN_ID_NOT_SUPPORTED");
    address destinationTokenAddress = tokensSupported[originTokenAddress][targetChainId];
    require(destinationTokenAddress != address(0), "UNSUPPORTED_TOKEN_ON_CHAIN_ID");
    count += 1;
    IERC20(originTokenAddress).safeTransferFrom(msg.sender, address(this), amount);
    uint256 expirationDate = block.timestamp + EXPIRATION_TIME;

    emit Deposit(
      msg.sender,
      originTokenAddress,
      destinationTokenAddress,
      amount,
      chainId,
      targetChainId,
      count,
      expirationDate
    );
  }

  function withdraw(
    address sender,
    address originTokenAddress,
    address destinationTokenAddress,
    uint256 amount,
    uint256 originChainId,
    uint256 targetChainId,
    uint256 _count,
    uint256 expirationDate,
    bytes memory signature
  ) external nonReentrant whenNotPaused {
    require(block.timestamp > expirationDate, "EXPIRED_DEPOSIT");
    require(targetChainId == chainId, "WRONG_CHAIN_ID");
    require(!filledSwaps[signature], "ALREADY_FILLED");
    require(
      verify(1, sender, originTokenAddress, destinationTokenAddress, amount, originChainId, targetChainId, _count, expirationDate, signature),
      "WRONG_SIGNER"
    );
    filledSwaps[signature] = true;
    IERC20(destinationTokenAddress).safeTransfer(sender, amount);

    emit Withdraw(sender, originTokenAddress, destinationTokenAddress, amount, originChainId, targetChainId, _count, expirationDate);
  }

  function withdrawExpiredDeposit(
    address sender,
    address originTokenAddress,
    address destinationTokenAddress,
    uint256 amount,
    uint256 originChainId,
    uint256 targetChainId,
    uint256 _count,
    uint256 expirationDate,
    bytes memory signature
  ) external nonReentrant whenNotPaused {
    require(block.timestamp <= expirationDate, "DEPOSIT_NOT_EXPIRED");
    require(originChainId == chainId, "WRONG_CHAIN_ID");
    require(!expiredSwaps[signature], "ALREADY_FILLED");
    require(
      verify(0, sender, originTokenAddress, destinationTokenAddress, amount, originChainId, targetChainId, _count, expirationDate, signature),
      "WRONG_SIGNER"
    );
    expiredSwaps[signature] = true;
    IERC20(originTokenAddress).safeTransfer(sender, amount);

    emit ExpiredWithdraw(sender, originTokenAddress, destinationTokenAddress, amount, originChainId, targetChainId, _count, expirationDate);
  }

  function verify(
    uint256 isWithdraw, // 0 = Expired deposit, 1 = Withdraw
    address sender,
    address originTokenAddress,
    address destinationTokenAddress,
    uint256 amount,
    uint256 originChainId,
    uint256 targetChainId,
    uint256 _count,
    uint256 expirationDate,
    bytes memory signature
  ) private view returns (bool) {
    bytes32 message = ECDSA.toEthSignedMessageHash(
      keccak256(abi.encodePacked(isWithdraw, sender, originTokenAddress, destinationTokenAddress, amount, originChainId, targetChainId, _count, signature, expirationDate))
    );
    return ECDSA.recover(message, signature) == verifyAddress;
  }
}
