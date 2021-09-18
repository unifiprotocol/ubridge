import React from 'react'
import styled from 'styled-components'

const TransactionDetailsWrapper = styled.ul`
  padding: 0;
  margin: 0;
`
const Line = styled.li`
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Title = styled.div`
  color: ${(p) => p.theme.txt200};
`
const Value = styled.div``
export const TransactionDetails: React.FC = () => {
  return (
    <TransactionDetailsWrapper>
      <Line>
        <Title>Swap fee</Title>
        <Value>0.1% - 0.00001 UNFI</Value>
      </Line>
      <Line>
        <Title>Transaction Fees</Title>
        <Value>~0.00001123</Value>
      </Line>
      <Line>
        <Title>Estimated time</Title>
        <Value>~2min</Value>
      </Line>
    </TransactionDetailsWrapper>
  )
}
