// SPDX-License-Identifier: BSD-3-Clause

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

pragma solidity ^0.8.0;

contract UBridge is Ownable, Pausable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  uint256 public chainId;

  uint256 public count;
  address public verifyAddress;
  bool public pausedDeposits;

  mapping(bytes => bool) public filledSwaps;
  mapping(uint256 => bool) public chainIdSupported;
  mapping(address => mapping(uint256 => address)) public tokensSupported; // originERC20Addr[chainIdTarget] = bool

  event Deposit(
    address sender,
    address originTokenAddress,
    address destinationTokenAddress,
    uint256 amount,
    uint256 targetChainId,
    uint256 count
  );

  event Withdraw(address receiver, address tokenAddress, uint256 amount, uint256 count);

  modifier whenNotDepositsPaused() {
    require(!pausedDeposits);
    _;
  }

  constructor(address _verifyAddress, uint256 _chainId) {
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
    for (uint256 i = 0; i < chainIdsTarget.length; i++) {
      require(chainIdSupported[chainIdsTarget[i]], "CHAIN_ID_NOT_SUPPORTED");
      tokensSupported[originTokenAddress][chainIdsTarget[i]] = destinationTokenAddresses[i];
    }
  }

  function addChainId(uint256[] memory newChainId) public onlyOwner {
    for (uint256 i = 0; i < newChainId.length; i++) {
      chainIdSupported[newChainId[i]] = true;
    }
  }

  function removeToken(address tokenAddress, uint256[] memory chainIdsTarget) public onlyOwner {
    for (uint256 i = 0; i < chainIdsTarget.length; i++) {
      tokensSupported[tokenAddress][chainIdsTarget[i]] = address(0);
    }
  }

  function removeChainId(uint256 _chainId) public onlyOwner {
    require(chainIdSupported[_chainId], "CHAIN_ID_NOT_SUPPORTED");
    chainIdSupported[_chainId] = false;
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
    emit Deposit(
      msg.sender,
      originTokenAddress,
      destinationTokenAddress,
      amount,
      targetChainId,
      count
    );
  }

  function withdraw(
    address sender,
    address tokenAddress,
    uint256 amount,
    uint256 targetChainId,
    uint256 _count,
    bytes memory signature
  ) external nonReentrant whenNotPaused {
    require(targetChainId == chainId, "WRONG_CHAIN_ID");
    require(!filledSwaps[signature], "ALREADY_FILLED");
    require(verify(sender, tokenAddress, amount, targetChainId, _count, signature), "WRONG_SIGNER");
    filledSwaps[signature] = true;
    IERC20(tokenAddress).safeTransfer(sender, amount);
    emit Withdraw(msg.sender, tokenAddress, amount, _count);
  }

  function verify(
    address sender,
    address tokenAddress,
    uint256 amount,
    uint256 targetChainId,
    uint256 _count,
    bytes memory signature
  ) private view returns (bool) {
    bytes32 message = ECDSA.toEthSignedMessageHash(
      keccak256(abi.encodePacked(sender, tokenAddress, amount, targetChainId, _count))
    );
    return ECDSA.recover(message, signature) == verifyAddress;
  }
}
