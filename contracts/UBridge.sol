// SPDX-License-Identifier: BSD-3-Clause

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

pragma solidity ^0.8.0;

contract UBridge is Ownable {
  using SafeERC20 for IERC20;

  uint256 public constant CHAIN_ID = 1;

  uint256 public count;
  address public verifyAddress;

  mapping(bytes32 => bool) public filledSwaps;
  mapping(uint256 => bool) public chainIdSupported;
  mapping(address => mapping(uint256 => bool)) public tokensSupported; // address[chainIdTarget] = bool

  constructor(address _verifyAddress) {
    verifyAddress = _verifyAddress;
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

  function addToken(address tokenAddress, uint256 chainIdTarget) public onlyOwner {
    require(tokenAddress != address(0), 'New tokenAddress is the zero address');
    tokensSupported[tokenAddress][chainIdTarget] = true;
  }

  function addChainId(uint256 newChainId) public onlyOwner {
    chainIdSupported[newChainId] = true;
  }

  // Transfer tokens to the SC
  // Events
  // Requires
  // Is the token allowed?
  function deposit(
    address tokenAddress,
    uint256 amount,
    uint256 targetChainId
  ) public {
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
  ) external returns (bool) {}
}
