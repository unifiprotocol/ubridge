import { IBlockchainConfig, ExecutionResponse } from '@unifiprotocol/core-sdk'
import { SwapTransaction } from '.'
import { Deposit } from '../Contracts/UBridge/deposit'

export const buildSwapTransaction = (
  blockchainCfg: IBlockchainConfig,
  response: ExecutionResponse,
  deposit: {
    withdrawalAddress: Deposit['params']['withdrawalAddress']
    originTokenAddress: Deposit['params']['originTokenAddress']
    amount: Deposit['params']['amount']
    targetChainId: Deposit['params']['targetChainId']
  }
): SwapTransaction => {
  const { targetChainId, amount, withdrawalAddress, originTokenAddress } = deposit
  return {
    time: new Date(),
    blockchain: blockchainCfg.blockchain,
    transactions: [
      {
        args: {
          count: '0',
          amount,
          originChainId: blockchainCfg.chainId!.toString(),
          targetChainId: targetChainId.toString(),
          withdrawalAddress,
          originTokenAddress,
          destinationTokenAddress: originTokenAddress
        },
        name: 'Deposit',
        time: new Date().toISOString(),
        topic: '',
        address: '',
        tx_hash: response.hash,
        signature: '',
        blockchain: blockchainCfg.blockchain
      }
    ],
    count: '0',
    origin_chain_id: blockchainCfg.chainId!.toString()
  }
}
