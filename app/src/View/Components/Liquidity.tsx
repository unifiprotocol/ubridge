import React, { useMemo } from 'react'
import { CollapsibleCard, FiExternalLink, ShinyHeader } from '@unifiprotocol/uikit'
import { BlockchainTitleWrapper, BridgePanel, Hero, LiquidityCardContent } from './Styles'
import { VernacularBlockchains } from '@unifiprotocol/utils'
import { Blockchains, getBlockchainConfig } from '@unifiprotocol/core-sdk'
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
  const { config } = useConfig()

  const bConfig = useMemo(() => getBlockchainConfig(blockchain), [blockchain])
  const bridgeBlockchainConfig = useMemo(() => config[blockchain], [blockchain, config])

  const blockchainLiquidity = useMemo(() => {
    return liquidity[blockchain]
  }, [blockchain, liquidity])

  return (
    <CollapsibleCard>
      <LiquidityCardContent>
        <BlockchainTitleWrapper>
          <span>{VernacularBlockchains[blockchain]}</span>
          <FiExternalLink
            onClick={() =>
              window.open(bConfig.explorer.address(bridgeBlockchainConfig?.bridgeContract ?? '#'))
            }
          />
        </BlockchainTitleWrapper>
        <div className="title">Assets</div>
        {blockchainLiquidity.map((liq, idx) => (
          <div className="asset" key={idx}>
            <img src="https://assets.unifiprotocol.com/UNFI.png" alt="UNFI" />
            <span>{liq.currency.toFactorized(liq.balance, 4)}</span>
            <span>{liq.currency.symbol}</span>
          </div>
        ))}
      </LiquidityCardContent>
    </CollapsibleCard>
  )
}
