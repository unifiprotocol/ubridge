import { Card, CardBody, Input, PrimaryButton, TokenInput, useModal } from '@unifiprotocol/uikit'
import React, { useEffect, useMemo, useState } from 'react'
import {
  BlockchainFlow,
  BridgeDirection,
  DestinationAddressWrapper,
  DestinationLabel,
  From,
  To,
  TransactionDetailsWrapper,
  TransferOverviewButton
} from './Styles'
import { CgArrowsExchangeV } from 'react-icons/cg'
import { TransactionDetails } from './TransactionDetails'
import { TransferOverviewModal, TransferOverviewModalProps } from '../TransferOverviewModal'
import { Blockchains, Currency } from '@unifiprotocol/utils'
import { useAdapter } from '../../Adapter'

export const BridgeForm: React.FC = () => {
  const { adapter, balances, addToken } = useAdapter()

  const overviewTransactionProps = useMemo(() => ({}), [])
  const [overviewTransaction] = useModal<TransferOverviewModalProps>({
    component: TransferOverviewModal,
    props: overviewTransactionProps,
    options: { disableBackdropClick: true }
  })
  const [amount, setAmount] = useState('0')

  useEffect(() => {
    addToken(new Currency('0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B', 18, 'UNFI', 'UNFI'))
  }, [addToken])

  const unfiBalance = useMemo(() => {
    const unfi = balances.find(
      (c) =>
        c.currency.address.toLowerCase() ===
        '0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B'.toLowerCase()
    )
    return unfi ? unfi.currency.toFactorized(unfi?.balance) : '0'
  }, [balances])

  return (
    <>
      <Card>
        <CardBody>
          <From>
            <BlockchainFlow>
              <span>From</span>
              <PrimaryButton variant="outline">{Blockchains.Binance}</PrimaryButton>
            </BlockchainFlow>
            <TokenInput
              label="Send"
              balanceLabel="Balance"
              amount={amount}
              token={new Currency('0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B', 18, 'UNFI', 'UNFI')}
              disableTokenChange={true}
              balance={unfiBalance}
              onAmountChange={setAmount}
            />
          </From>
          <BridgeDirection>
            <CgArrowsExchangeV size={30} /> <span>You will receive</span>
          </BridgeDirection>
          <To>
            <BlockchainFlow>
              <span>To</span>
              <PrimaryButton variant="outline">{Blockchains.Ethereum}</PrimaryButton>
            </BlockchainFlow>
            <TokenInput
              label="Receive"
              balanceLabel="Balance"
              amount={amount}
              token={new Currency('0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B', 18, 'UNFI', 'UNFI')}
              disableTokenChange={true}
              disableMaxAction={true}
              disableAmountChange={true}
              onAmountChange={() => {}}
            />

            {adapter && (
              <DestinationAddressWrapper>
                <Input
                  value={adapter.getAddress()}
                  prefixAddon={<DestinationLabel>Destination Address</DestinationLabel>}
                />
              </DestinationAddressWrapper>
            )}
          </To>
          <TransactionDetailsWrapper>
            <TransactionDetails />
          </TransactionDetailsWrapper>
          <TransferOverviewButton block={true} size="xl" onClick={overviewTransaction}>
            <CgArrowsExchangeV size={30} /> Transfer overview
          </TransferOverviewButton>
        </CardBody>
      </Card>
    </>
  )
}
