import { useCallback } from 'react'
import { Blockchains } from '@unifiprotocol/core-sdk'
import { Currency } from '@unifiprotocol/utils'
import { atom, useRecoilState } from 'recoil'
import { useConfig } from '../Config'
import { offlineConnectors } from '../Services/OfflineConnectors'
import { BalanceOf } from '../Contracts/ERC20/balanceOf'

export type TLiquidity = {
  [B in Blockchains]: Array<{
    currency: Currency
    balance: string
  }>
}

const LiquidityState = atom<TLiquidity>({
  key: 'liquidityState',
  default: Object.values(Blockchains).reduce((t: TLiquidity, curr) => {
    const blockchains = curr as Blockchains
    t[blockchains] = []
    return t
  }, {} as TLiquidity)
})

export const useLiquidity = () => {
  const [liquidity, setLiquidity] = useRecoilState(LiquidityState)
  const { config } = useConfig()

  const updateLiquidity = useCallback(async () => {
    const newState = { ...liquidity }
    for (const b of Object.keys(config)) {
      const blockchain = b as Blockchains
      const cfg = config[blockchain]
      if (!cfg) break
      const tokens = Object.values(cfg.tokens)
      const { adapter } = offlineConnectors[blockchain]
      if (!adapter) break
      const balanceOfCalls = tokens.map(
        (t) => new BalanceOf({ owner: cfg.bridgeContract, tokenAddress: t.address })
      )
      await Promise.all(tokens.map((t) => adapter.adapter.initializeToken(t.address)))
      const results = await adapter.multicall.execute(balanceOfCalls)
      newState[blockchain] = results.map((r, idx) => ({
        currency: tokens[idx],
        balance: r.value ?? '0'
      }))
    }
    setLiquidity(newState)
  }, [config, liquidity, setLiquidity])

  return {
    liquidity,
    updateLiquidity
  }
}
