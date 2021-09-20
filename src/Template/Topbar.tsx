import { BrandedHeader, NavigationHeader, PrimaryButton } from '@unifiprotocol/uikit'
import React from 'react'
import styled from 'styled-components'

const RightPane = styled.div`
  margin-left: auto;
`

export const Topbar: React.FC = () => {
  return (
    <>
      <NavigationHeader />
      <BrandedHeader>
        <RightPane>
          <PrimaryButton variant="outline">Connect wallet</PrimaryButton>
        </RightPane>
      </BrandedHeader>
    </>
  )
}
