import React from 'react'
import { Blockchains } from '../../../Blockchains'
import { BlockchainAccountInput } from '../BlockchainSelector'
import styled from 'styled-components'

const TransferAccountsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  > div {
    width: 50%;
  }

  @media (max-width: 600px) {
    display: block;
    > div {
      width: 100% !important;
    }
  }
`

export const TransferAccounts: React.FC = () => {
  return (
    <TransferAccountsWrapper>
      <BlockchainAccountInput
        label="From"
        getAddressFromWallet={true}
        blockchain={Blockchains.Bsc}
      />
      <BlockchainAccountInput label="To" blockchain={Blockchains.Eth} />
    </TransferAccountsWrapper>
  )
}
