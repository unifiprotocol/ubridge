import { Blockchains, IAdapter, IConnector } from '@unifiprotocol/core-sdk'
import UBridge from '../Contracts/ABI/UBridge.json'
import { TConfig } from '../Config'
import { BlockchainChainId, offlineConnectors } from '../Services/Connectors'
import { GetChainIds } from '../Contracts/UBridge/getChainIds'
import { GetChainIdFee } from '../Contracts/UBridge/chainIdFees'
import { Deposit } from '../Contracts/UBridge/deposit'

class BridgeService {
  connector: IConnector | undefined
  config: TConfig = {}
  swapFee: { [B in Blockchains]?: string } = {}
  blockchain: Blockchains | undefined

  get chainID() {
    if (!this.blockchain) {
      throw Error('No blockchain set')
    }
    return this.blockchain ? BlockchainChainId[this.blockchain] : 0
  }

  get blockchainConfig() {
    if (!this.blockchain) {
      throw Error('No blockchain set')
    }
    return this.blockchain ? this.config[this.blockchain]! : undefined
  }

  setConfig(config: TConfig) {
    this.config = config
  }

  setBlockchain(blockchain: Blockchains) {
    this.blockchain = blockchain
    this.connector = offlineConnectors[blockchain]
  }

  getChainIds() {
    const useCase = new GetChainIds({ contractAddress: this.blockchainConfig!.bridgeContract })
    return useCase.execute(this.getAdapter())
  }

  getChainIdFee(chainId: BridgeService['chainID']) {
    const useCase = new GetChainIdFee({
      contractAddress: this.blockchainConfig!.bridgeContract,
      chainId
    })
    return useCase.execute(this.getAdapter())
  }

  deposit(
    withdrawalAddress: Deposit['params']['withdrawalAddress'],
    originTokenAddress: Deposit['params']['originTokenAddress'],
    amount: Deposit['params']['amount'],
    targetChainId: Deposit['params']['targetChainId'],
    fee: Deposit['params']['fee'],
    adapter: IAdapter
  ) {
    adapter.initializeContract(this.blockchainConfig!.bridgeContract, UBridge.abi)
    const useCase = new Deposit({
      contractAddress: this.blockchainConfig!.bridgeContract,
      withdrawalAddress,
      originTokenAddress,
      amount,
      targetChainId,
      fee
    })
    return useCase.execute(adapter)
  }

  private getAdapter() {
    if (!this.blockchain) {
      throw Error('No blockchain set')
    }
    const adapter = this.connector!.adapter!.adapter
    adapter.initializeContract(this.blockchainConfig!.bridgeContract, UBridge.abi)
    return adapter
  }
}

export default new BridgeService()
