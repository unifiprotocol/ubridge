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
  mapping(address => mapping(uint256 => bool)) public tokensSupported; // address[chainIdTarget] = bool

  constructor(address _verifyAddress, uint256 _chainId) {
    verifyAddress = _verifyAddress;
    chainId = _chainId;
  }

  // modifiers
  // events

  // admin - in charge of change fee, set/get verifyAddress

  // verifySigner - setters
  // tokensSupported - setters
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

  function removeChainId(uint256 chainId) public onlyOwner {
    require(chainIdSupported[chainId]);
    chainIdSupported[chainId] = false;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  // Transfer tokens to the SC
  // Events
  // Requires
  // Is the token allowed?
  function deposit(
    address tokenAddress,
    uint256 amount,
    uint256 targetChainId
  ) public nonReentrant whenNotPaused {
    count++;
    IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
  }

  // Check signature === verifyAddress
  // Transfer tokens
  // Register the withdraw
  // Event
  function withdraw(
    address tokenAddress,
    uint256 amount,
    uint256 count,
    uint256 chainId,
    bytes32 signature
  ) external nonReentrant whenNotPaused returns (bool) {}
}
