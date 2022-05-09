import { useCallback } from 'react'
import { Blockchains } from '@unifiprotocol/core-sdk'
import { Currency } from '@unifiprotocol/utils'
import { atom, useRecoilState } from 'recoil'
import { useConfig } from '../Config'
import { offlineConnectors } from '../Services/Connectors'
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
    async function fetchBlockchainLiquidity(blockchain: Blockchains) {
      try {
        const cfg = config[blockchain]
        if (!cfg) return undefined
        const tokens = Object.values(cfg.tokens)
        const connector = offlineConnectors[blockchain]
        await connector.connect()
        const { adapter } = connector
        if (!adapter) return undefined
        const balanceOfCalls = tokens.map(
          (t) => new BalanceOf({ owner: cfg.bridgeContract, tokenAddress: t.address })
        )
        await Promise.all(tokens.map((t) => adapter.adapter.initializeToken(t.address)))
        const results = await adapter.multicall.execute(balanceOfCalls)
        return {
          blockchain,
          liquidity: results.map((r, idx) => ({
            currency: tokens[idx],
            balance: r.value ?? '0'
          }))
        }
      } catch (err) {
        console.error(`Something wrong happened fetching the liquidity:`, blockchain)
        console.error(err)
      }
    }

    const newState = { ...liquidity }
    await Promise.all(
      Object.keys(config).map((blockchain: any) => fetchBlockchainLiquidity(blockchain))
    ).then((liquidities) => {
      liquidities.forEach((l) => {
        if (l) {
          newState[l.blockchain] = l.liquidity
        }
      })
    })

    setLiquidity(newState)
  }, [config, liquidity, setLiquidity])

  return {
    liquidity,
    updateLiquidity
  }
}
