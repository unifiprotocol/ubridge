import React, { useMemo } from 'react'
import { CollapsibleCard, ShinyHeader } from '@unifiprotocol/uikit'
import { BridgePanel, Hero, LiquidityCardContent } from './Styles'
import { BN, VernacularBlockchains } from '@unifiprotocol/utils'
import { Blockchains } from '@unifiprotocol/core-sdk'
import { useConfig } from '../../Config'
import { useLiquidity } from '../../Liquidity'

export const Liquidity = () => {
  const { config } = useConfig()

  return (
    <>
      <Hero>
        <ShinyHeader>Liquidity</ShinyHeader>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </Hero>
      <BridgePanel>
        {Object.keys(config).map((b, idx) => {
          const blockchain = b as Blockchains
          return <LiquidityCard {...{ blockchain }} key={idx} />
        })}
      </BridgePanel>
    </>
  )
}

export const LiquidityCard: React.FC<{ blockchain: Blockchains }> = ({ blockchain }) => {
  const { liquidity } = useLiquidity()

  const blockchainLiquidity = useMemo(() => {
    return liquidity[blockchain]
  }, [blockchain, liquidity])

  return (
    <CollapsibleCard>
      <LiquidityCardContent>
        <h1>{VernacularBlockchains[blockchain]}</h1>
        <div className="title">Assets</div>
        {blockchainLiquidity.map((liq, idx) => (
          <div className="asset" key={idx}>
            <img src="https://assets.unifiprotocol.com/UNFI.png" alt="UNFI" />
            <span>{BN(liq.balance).toNumber().toLocaleString()}</span>
            <span>{liq.currency.symbol}</span>
          </div>
        ))}
      </LiquidityCardContent>
    </CollapsibleCard>
  )
}
