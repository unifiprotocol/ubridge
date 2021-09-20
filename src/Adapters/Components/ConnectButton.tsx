import { PrimaryButton, SecondaryButton } from '@unifiprotocol/uikit'
import { shortAddress } from '@unifiprotocol/utils'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useAdapter } from '../useAdapter'
import { Avatar } from './Avatar'

const ConnectedButton = styled(SecondaryButton)`
  img {
    vertical-align: middle;
    margin-left: 0.5rem;
  }
`
export const ConnectWalletButton: React.FC = () => {
  const { connect, address } = useAdapter()
  const performConnection = useCallback(() => {
    setTimeout(() => {
      connect()
    }, 200)
  }, [connect])
  return (
    <>
      {!address && (
        <PrimaryButton onClick={performConnection} variant="outline">
          Connect wallet
        </PrimaryButton>
      )}

      {address && (
        <ConnectedButton variant="outline">
          {shortAddress(address)}
          <Avatar height={20} />
        </ConnectedButton>
      )}
    </>
  )
}
