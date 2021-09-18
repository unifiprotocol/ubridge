import React from 'react'
import { Blockchains } from '../../../Blockchains'
import { BlockchainSelector } from '../BlockchainSelector'
import styled from 'styled-components'
import { CgArrowRight } from 'react-icons/cg'

const TransferDirectionWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
`
const Direction = styled.div`
  color: ${(p) => p.theme.txt200};
  text-align: center;
`

export const TransferDirection: React.FC = () => {
  return (
    <TransferDirectionWrapper>
      <BlockchainSelector blockchain={Blockchains.Bsc} />
      <Direction>
        <CgArrowRight size={30} />
      </Direction>
      <BlockchainSelector blockchain={Blockchains.Eth} />
    </TransferDirectionWrapper>
  )
}
