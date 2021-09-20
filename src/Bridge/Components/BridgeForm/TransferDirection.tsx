import React from 'react'
import { Blockchains } from '../../../Blockchains'
import { BlockchainSelector } from '../BlockchainSelector'
import styled from 'styled-components'

const TransferDirectionWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  > div {
    width: 50%;
  }
`

export const TransferDirection: React.FC = () => {
  return (
    <TransferDirectionWrapper>
      <BlockchainSelector label="From" getAddressFromWallet={true} blockchain={Blockchains.Bsc} />
      <BlockchainSelector label="To" blockchain={Blockchains.Eth} />
    </TransferDirectionWrapper>
  )
}
