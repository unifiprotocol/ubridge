import React from 'react'
import { CollapsibleCard, ShinyHeader } from '@unifiprotocol/uikit'
import { BridgePanel, Hero, LiquidityCardContent } from './Styles'
import { VernacularBlockchains } from '@unifiprotocol/utils'

export const Liquidity = () => {
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
        {Object.values(VernacularBlockchains).map((blockchain, idx) => (
          <LiquidityCard {...{ blockchain }} key={idx} />
        ))}
      </BridgePanel>
    </>
  )
}

export const LiquidityCard: React.FC<{ blockchain: string }> = ({ blockchain }) => {
  return (
    <CollapsibleCard>
      <LiquidityCardContent>
        <h1>{blockchain}</h1>
        <div className="title">TVL</div>
        <div>${(5_000_000).toLocaleString()}</div>
        <div className="title">Assets</div>
        <div className="asset">
          <img src="https://assets.unifiprotocol.com/UNFI.png" alt="UNFI" />
          <span>{(14_000).toLocaleString()}</span>
          <span>UNFI</span>
        </div>
        <div className="asset">
          <img
            src="https://icon-service.unifi.report/icon_bsc?token=0xb4E8D978bFf48c2D8FA241C0F323F71C1457CA81&autoResolve=false"
            alt="UNFI"
          />
          <span>{(14_000).toLocaleString()}</span>
          <span>UP</span>
        </div>
      </LiquidityCardContent>
    </CollapsibleCard>
  )
}
