// SPDX-License-Identifier: BSD-3-Clause

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

pragma solidity ^0.8.0;

contract UBridge is Ownable, Pausable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  uint256 public chainId;

  uint256 public count;
  address public verifyAddress;

  mapping(bytes32 => bool) public filledSwaps;
  mapping(uint256 => bool) public chainIdSupported;
  mapping(address => mapping(uint256 => bool)) public tokensSupported; // originERC20Addr[chainIdTarget] = bool

  event Deposit(
    address sender,
    address tokenAddress,
    uint256 amount,
    uint256 chainId,
    uint256 count
  );

  constructor(address _verifyAddress, uint256 _chainId) {
    verifyAddress = _verifyAddress;
    chainId = _chainId;
  }

  function changeVerifySigner(address newVerifier) public onlyOwner {
    require(newVerifier != address(0), 'New verifier is the zero address');
    verifyAddress = newVerifier;
  }

  function addToken(address tokenAddress, uint256[] memory chainIdsTarget) public onlyOwner {
    require(tokenAddress != address(0), 'New tokenAddress is the zero address');
    for (uint256 i = 0; i < chainIdsTarget.length; i++) {
      require(!tokensSupported[tokenAddress][chainIdsTarget[i]]);
      tokensSupported[tokenAddress][chainIdsTarget[i]] = true;
    }
  }

  function addChainId(uint256[] memory newChainId) public onlyOwner {
    for (uint256 i = 0; i < newChainId.length; i++) {
      chainIdSupported[newChainId[i]] = true;
    }
  }

  function removeToken(address tokenAddress, uint256[] memory chainIdsTarget) public onlyOwner {
    for (uint256 i = 0; i < chainIdsTarget.length; i++) {
      require(tokensSupported[tokenAddress][chainIdsTarget[i]]);
      tokensSupported[tokenAddress][chainIdsTarget[i]] = false;
    }
  }

  function removeChainId(uint256 _chainId) public onlyOwner {
    require(chainIdSupported[_chainId]);
    chainIdSupported[_chainId] = false;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function deposit(
    address tokenAddress,
    uint256 amount,
    uint256 targetChainId
  ) public nonReentrant whenNotPaused {
    require(tokensSupported[tokenAddress][targetChainId]);
    require(chainIdSupported[targetChainId]);
    count += 1;
    IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
    emit Deposit(msg.sender, tokenAddress, amount, targetChainId, count);
  }

  // Check signature === verifyAddress
  // Transfer tokens
  // Register the withdraw
  // Event
  function withdraw(
    address tokenAddress,
    uint256 amount,
    uint256 targetChainId,
    uint256 _count,
    bytes32 signature
  ) external nonReentrant whenNotPaused returns (bool) {
    require(targetChainId == chainId);
    require(!filledSwaps[signature]);
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
      abi.encode(sender, tokenAddress, amount, targetChainId, _count, signature)
    );
    return ECDSA.recover(message, signature) == verifyAddress;
  }
}
