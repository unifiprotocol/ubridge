import React from 'react'
import { BridgeForm } from '../Components/BridgeForm'
import { InfoPanel, BridgeWrapper, InfoLinks, InfoLink, BridgePanel } from './Styles'

export const Bridge: React.FC = () => {
  return (
    <BridgeWrapper>
      <InfoPanel>
        <h1>Unifi bridge</h1>
        <p>
          Swap your assets between chains in minutes and with low fees. uSwap in collaboration with
          ChainLink make the swaps easier to track.
        </p>
        <InfoLinks>
          <InfoLink>How it works?</InfoLink>
          <InfoLink>Documentation</InfoLink>
          <InfoLink
            onClick={() =>
              window.open(
                'https://binance.unifiprotocol.com/exchange/swap/BNB/0x728c5bac3c3e370e372fc4671f9ef6916b814d8b'
              )
            }
          >
            Buy UNFI on BSC
          </InfoLink>
        </InfoLinks>
      </InfoPanel>
      <BridgePanel>
        <BridgeForm />
      </BridgePanel>
    </BridgeWrapper>
  )
}
