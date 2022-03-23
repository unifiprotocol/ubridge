import { Blockchains, IAdapter, IConnector } from '@unifiprotocol/core-sdk'
import UBridge from '../Contracts/ABI/UBridge.json'
import { TConfig } from '../Config'
import { BlockchainChainId, offlineConnectors } from '../Services/Connectors'
import { GetChainIds } from '../Contracts/UBridge/getChainIds'
import { GetChainIdFee } from '../Contracts/UBridge/chainIdFees'
import { Deposit } from '../Contracts/UBridge/deposit'
import { Approve, ApproveParams } from '../Contracts/ERC20/approve'
import { Allowance, AllowanceParams } from '../Contracts/ERC20/allowance'

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
    return this.getAdapter().then((adapter) => useCase.execute(adapter))
  }

  getChainIdFee(chainId: BridgeService['chainID']) {
    const useCase = new GetChainIdFee({
      contractAddress: this.blockchainConfig!.bridgeContract,
      chainId
    })
    return this.getAdapter().then((adapter) => useCase.execute(adapter))
  }

  async getTokenAllowance(
    tokenAddress: AllowanceParams['tokenAddress'],
    owner: AllowanceParams['owner']
  ) {
    const adapter = await this.getAdapter()
    adapter.initializeToken(tokenAddress)
    const useCase = new Allowance({
      tokenAddress,
      owner,
      spender: this.blockchainConfig!.bridgeContract
    })
    return useCase.execute(adapter)
  }

  approve(
    tokenAddress: ApproveParams['tokenAddress'],
    amount: ApproveParams['amount'],
    adapter: IAdapter
  ) {
    adapter.initializeToken(tokenAddress)
    const useCase = new Approve({
      tokenAddress,
      spender: this.blockchainConfig!.bridgeContract,
      amount
    })
    return useCase.execute(adapter)
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

  private async getAdapter() {
    if (!this.blockchain) {
      throw Error('No blockchain set')
    }
    if (!this.connector?.adapter) {
      await this.connector?.connect()
    }
    const adapter = this.connector!.adapter!.adapter
    adapter.initializeContract(this.blockchainConfig!.bridgeContract, UBridge.abi)
    return adapter
  }
}

export default new BridgeService()
