import { Blockchains } from '@unifiprotocol/utils'
import { TConfig } from '../Config'

class SwapService {
  private config: TConfig = {}
  swapFee: { [B in Blockchains]: string }

  constructor() {
    this.swapFee = Object.keys(Blockchains).reduce((t, curr) => {
      const blockchain = curr as Blockchains
      t[blockchain] = '0'
      return t
    }, {} as SwapService['swapFee'])
  }

  async fetchSwapFee() {
    try {
      Object.keys(this.config).map((b) => {
        const blockchain = b as Blockchains
        return this.config[blockchain]
      })
    } catch (err) {
      console.error('🚀 ~ file: SwapService.ts ~ line 17 ~ SwapService ~ fetchSwapFee ~ err', err)
    }
  }

  setConfig(config: TConfig) {
    this.config = config
  }
}

export default new SwapService()
