import React from 'react'
import { BridgeForm } from '../Components/BridgeForm'
import {
  InfoPanel,
  BridgeWrapper,
  InfoLinks,
  InfoLink,
  BridgePanel,
  InfoBackground,
  InfoForeground
} from './Styles'
import LogoDark from '../../Assets/logo_dark.svg'

export const Bridge: React.FC = () => {
  return (
    <BridgeWrapper>
      <InfoPanel>
        <InfoBackground>
          <img src={LogoDark} />
        </InfoBackground>
        <InfoForeground>
          <h1>Unifi bridge</h1>
          <p>
            Swap your assets between chains in minutes and with low fees. uSwap in collaboration
            with ChainLink make the swaps easier to track.
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
        </InfoForeground>
      </InfoPanel>
      <BridgePanel>
        <BridgeForm />
      </BridgePanel>
    </BridgeWrapper>
  )
}
