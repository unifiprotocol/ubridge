// SPDX-License-Identifier: BSD-3-Clause

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

pragma solidity ^0.8.0;

contract UBridgeBroken is Ownable, Pausable, ReentrancyGuard, Initializable {
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

  function init(address _verifyAddress, uint256 _chainId) public initializer {
    verifyAddress = _verifyAddress;
    chainId = _chainId;
  }

  function changeVerifySigner(address newVerifier) public onlyOwner {
    verifyAddress = newVerifier;
  }
}
