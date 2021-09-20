import { BrandedHeader, NavigationHeader } from '@unifiprotocol/uikit'
import React from 'react'
import styled from 'styled-components'
import { ConnectWalletButton } from '../Adapters/Components/ConnectButton'

const RightPane = styled.div`
  margin-left: auto;
`

export const Topbar: React.FC = () => {
  return (
    <>
      <NavigationHeader />
      <BrandedHeader>
        <RightPane>
          <ConnectWalletButton />
        </RightPane>
      </BrandedHeader>
    </>
  )
}
