import React from 'react'
import { Blockchain } from '../../../Blockchains'
import styled from 'styled-components'

const BlockchainSelectorWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: ${(p) => p.theme.bgInput};
  padding: 0.5rem;
  border-radius: ${(p) => p.theme.borderRadius};
`
const BlockchainLogo = styled.img`
  width: 1.5rem;
`
const BlockchainName = styled.div``

export const BlockchainSelector: React.FC<{ blockchain: Blockchain }> = ({ blockchain }) => {
  return (
    <BlockchainSelectorWrapper>
      <BlockchainLogo src={blockchain.logo} /> <BlockchainName>{blockchain.name}</BlockchainName>
    </BlockchainSelectorWrapper>
  )
}
