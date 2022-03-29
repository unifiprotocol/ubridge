import React, { useMemo } from 'react'
import { CollapsibleCard, FiExternalLink, ShinyHeader, TokenLogo } from '@unifiprotocol/uikit'
import { BlockchainTitleWrapper, BridgePanel, Hero, LiquidityCardContent } from './Styles'
import { getVernacularBlockchain } from '@unifiprotocol/utils'
import { Blockchains, getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { useConfig } from '../../Config'
import { useLiquidity } from '../../Liquidity'
import { Trans, useTranslation } from 'react-i18next'

export const Liquidity = () => {
  const { t } = useTranslation()
  const { config } = useConfig()

  return (
    <>
      <Hero>
        <ShinyHeader>{t('bridge.swap.tab.liquidity')}</ShinyHeader>
        <p>
          <Trans key="bridge.liquidity.header">
            During a swap, the UNFI gets deposited as liquidity on the origin chain, and an equal
            amount of UNFI is withdrawn from the liquidy pool on the destination chain. There must
            be enough liquidity on the destination chain to complete the transaction. The
            circulating supply of UNFI remains the same. Liquidity for uBridge is currently being
            funded by Unifi Protocol.{' '}
            <a href="http://twitter.com/unifiprotocol" target="_blank" rel="noreferrer">
              Stay tuned for when uBridge LP rewards come online!
            </a>
          </Trans>
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
  const { t } = useTranslation()
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
          <img src={bConfig.logoURI} title={bConfig.blockchain} alt={bConfig.blockchain} />
          <span>{getVernacularBlockchain(blockchain)}</span>
          <FiExternalLink
            onClick={() =>
              window.open(bConfig.explorer.address(bridgeBlockchainConfig?.bridgeContract ?? '#'))
            }
          />
        </BlockchainTitleWrapper>
        <div className="title">{t('bridge.common.assets')}</div>
        {blockchainLiquidity.map((liq, idx) => (
          <div className="asset" key={idx}>
            <TokenLogo
              token={{ address: liq.currency.address, symbol: liq.currency.symbol }}
              blockchain={blockchain}
            />
            <span>{liq.currency.toFactorized(liq.balance, 4)}</span>
            <span>{liq.currency.symbol}</span>
          </div>
        ))}
      </LiquidityCardContent>
    </CollapsibleCard>
  )
}
