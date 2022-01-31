# uBridge

A ERC20 bridge between blockchains with one point deposit verification.

## Contracts

## Description

The objective of uBridge is to transfer pegged tokens from one blockchain to another. The first use case will enable users to transfer UNFI tokens between our available networks, and liquidity will be supplied by UNIFI at first.

The implemented solution isn’t trustless since it requires the VERIFIER_ADDRESS to confirm that a deposit has been done. Nevertheless, no transaction is needed to verify the deposit, for this purpose we use a service that will sign the deposit with the VERIFIER_PRIVATE_KEY. This signed deposit will be verified by the destination smart contract and will complete the funds transfer.

A high-level diagram:

![A high-level diagram](https://raw.githubusercontent.com/unifiprotocol/ubridge/master/assets/uBridgeDepositFlowchart.png?token=GHSAT0AAAAAABQBWOOYUQNN2B2WOZG7UBEKYQA5PYQ)

The process can be divided into three phases:

1. Deposit Phase: In this first phase, the user will deposit the tokens that they wanted to transfer selecting the target blockchain. The smart contract will check that this transfer is available and if so will successfully deposit the tokens into the uBridge contract.

2. Verification Phase: In this second phase, the user will send a request to the backend service with the transaction id (transaction hash) of the deposit function call. Using this transaction hash the backend will connect to the blockchain to verify that this transaction exists and corresponds to a deposit. If so, the deposit will be signed and sent to the user.

3. Withdrawal Phase: In this last phase, the user will execute a withdrawal transaction in the destination blockchain, in which the smart contract will check that the signed message corresponds to the VERIFIER_ADDRESS and if so the contract will transfer the tokens to its destinatary.

**Note: Withdrawal transaction could be executed by anyone but the funds will be transferred to the address that made the deposit. It’s yet to be determined if this withdrawal operation will be executed by our backend or by the user.**

One main problem of cross-chain bridges is that funds may be blocked if the destination blockchain isn’t available, for instance due to lack of liquidity in destination. To solve this problem, deposits expire in 24 hours. Once a deposit has expired, the backend service won’t sign any withdrawal for the destination transaction but for the original blockchain. The workflow is very similar to the former diagram but with some nuances worth mentioning.

The main changes belong to the second phase. In this phase, the backend will notice that the deposit has expired when the original blockchain sends the deposit data which expiration timestamp's is among its attributes. Before signing the expired deposit message, it’s necessary to check that the withdrawal hasn’t been executed at the destination so it cannot be double spent. Once this condition has been met, the backend service will sign the expired withdrawal. The withdrawal phase is identical to the normal withdrawal but executing the withdrawExpireDeposit function in the original blockchain.

![A high-level diagram](https://raw.githubusercontent.com/unifiprotocol/ubridge/master/assets/uBridgeExpiredDepositFlowchart.png?token=GHSAT0AAAAAABQBWOOZJDJXITZVXUAHPIL4YQA5REQ)

For further information:

- [Smart contract code](https://github.com/unifiprotocol/ubridge/blob/master/contracts/UBridge.sol)

- [Backend service](https://github.com/unifiprotocol/ubridge-service)
