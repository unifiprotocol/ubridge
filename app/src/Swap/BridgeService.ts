import { Blockchains, IConnector } from '@unifiprotocol/core-sdk'
import { Currency } from '@unifiprotocol/utils'
import UBridge from '../Contracts/ABI/UBridge.json'
import { TConfig } from '../Config'
import { BlockchainChainId, offlineConnectors } from '../Services/Connectors'
import { GetChainIds } from '../Contracts/UBridge/getChainIds'
import { GetChainIdFee } from '../Contracts/UBridge/chainIdFees'

export class BridgeService {
  readonly connector: IConnector
  readonly chainID: number
  readonly config: {
    bridgeContract: string
    tokens: {
      [T: string]: Currency
    }
  }
  swapFee: { [B in Blockchains]?: string } = {}

  constructor(public blockchain: Blockchains, config: TConfig[Blockchains]) {
    this.connector = offlineConnectors[blockchain]
    this.chainID = BlockchainChainId[blockchain]
    this.config = config!
  }

  getChainIds() {
    const useCase = new GetChainIds({ contractAddress: this.config.bridgeContract })
    return useCase.execute(this.getAdapter())
  }

  getChainIdFee(chainId: BridgeService['chainID']) {
    const useCase = new GetChainIdFee({
      contractAddress: this.config.bridgeContract,
      chainId
    })
    return useCase.execute(this.getAdapter())
  }

  private getAdapter() {
    const adapter = this.connector.adapter!.adapter
    adapter.initializeContract(this.config.bridgeContract, UBridge)
    return adapter
  }
}
