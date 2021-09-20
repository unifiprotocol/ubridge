import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Blockchain } from '../../../Blockchains'
import styled from 'styled-components'
import { Input, ShinyWrapper } from '@unifiprotocol/uikit'
import { useAdapter } from '../../../Adapters/useAdapter'

const BlockchainSelectorWrapper = styled.div`
  background: ${(p) => p.theme.bgInput};
  border-radius: ${(p) => p.theme.borderRadius};
  padding: 0.6rem;
  transition: 0.25s all;
`
const BlockchainLogo = styled.img`
  width: 1rem;
`
const BlockchainName = styled.div``

const Label = styled.div`
  margin-left: 0.5rem;
  color: ${(p) => p.theme.txt200};
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
`

const BlockchainSelected = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

interface BlockchainSelectorProps {
  blockchain: Blockchain
  getAddressFromWallet?: boolean
  label: string
}

export const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({
  blockchain,
  getAddressFromWallet = false,
  label
}) => {
  const { address: walletAddress } = useAdapter()
  const [address, setAddress] = useState(getAddressFromWallet ? walletAddress : '')

  const useSourceAddress = useCallback(() => {
    setAddress(walletAddress)
  }, [walletAddress])

  useEffect(() => {
    if (walletAddress && getAddressFromWallet) {
      setAddress(walletAddress)
    }
  }, [walletAddress, getAddressFromWallet])

  const actions = useMemo(() => {
    return !getAddressFromWallet && walletAddress && address !== walletAddress
      ? [
          {
            label: (<span style={{ whiteSpace: 'nowrap' }}>Use source</span>) as any,
            action: useSourceAddress
          }
        ]
      : []
  }, [getAddressFromWallet, useSourceAddress, address])

  const placeholder = getAddressFromWallet && !walletAddress ? 'Connect wallet' : 'Address'
  return (
    <ShinyWrapper mode="on-focus-within">
      <BlockchainSelectorWrapper>
        <Head>
          <Label>{label}</Label>
          <BlockchainSelected>
            <BlockchainLogo src={blockchain.logo} />{' '}
            <BlockchainName>{blockchain.name}</BlockchainName>
          </BlockchainSelected>
        </Head>

        <Input
          disableFocusEffect={true}
          disabled={getAddressFromWallet}
          actions={actions}
          placeholder={placeholder}
          value={address}
          onChange={(evt) => setAddress(evt.target.value)}
        />
      </BlockchainSelectorWrapper>
    </ShinyWrapper>
  )
}
