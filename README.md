# uBridge

A ERC20 bridge between blockchains with one point deposit verification.

## Contracts

## Deploy

```sh
npx hardhat run ./scripts/deploy.ts --network NETWORK
```

## Description

The objective of uBridge is to transfer pegged tokens from one blockchain to another. The first use case will enable users to transfer UNIFI tokens between our available networks, and liquidity will be supplied by UNIFI at first.

The implemented solution isn’t trustless since it requires the deposits to be verified by the signers. This verification process is off-chain but in the destination blockchain it is checked that these signatures are valid.

A high-level diagram:

![A high-level diagram](https://github.com/unifiprotocol/ubridge/blob/master/assets/uBridgeDepositFlowchart.png?raw=true)

The process can be divided into three phases:

1. Deposit Phase: In this first phase, the user will deposit the tokens that they wanted to transfer selecting the target blockchain. The smart contract will check that this transfer is available and if so will successfully deposit the tokens into the uBridge contract.

2. Verification Phase: In this second phase, our backend will catch the deposit event that has occurred and will ask the signers to sign the deposit. The signers will receive the transaction hash of the deposit and will check that the deposit is valid and only in this case will sign the deposit with their private key.

3. Withdrawal Phase: Once the deposit has been signed by all the signers, our backend will execute the withdrawal in the destination blockchain.

For further information:

- [Smart contract code](https://github.com/unifiprotocol/ubridge/blob/master/contracts/UBridge.sol)

- [Backend service](https://github.com/unifiprotocol/ubridge-service)

## Audit report

- [SlowMist Audit - 3/3/2022](https://github.com/unifiprotocol/ubridge/blob/master/SlowMist%20Audit%20Report%20-%20Bridge.pdf)
