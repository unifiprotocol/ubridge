import {
  Card,
  CardBody,
  Input,
  PrimaryButton,
  TokenInput,
  TokenInputWithSelector,
  useModal
} from '@unifiprotocol/uikit'
import React, { useEffect, useMemo } from 'react'
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
import { Blockchains } from '@unifiprotocol/utils'
import { useAdapter } from '../../Adapter'
import { useSwap } from './useSwap'
import { useConfig } from '../../Config'

export const BridgeForm: React.FC = () => {
  const { blockchainConfig } = useConfig()
  const { adapter, balances, connection } = useAdapter()
  const {
    amount,
    token0,
    token1,
    destinationAddress,
    setDestinationAddress,
    setAmount,
    setToken0
  } = useSwap()

  const overviewTransactionProps = useMemo(() => ({}), [])
  const [overviewTransaction] = useModal<TransferOverviewModalProps>({
    component: TransferOverviewModal,
    props: overviewTransactionProps,
    options: { disableBackdropClick: true }
  })

  const tokenList = useMemo(() => {
    return blockchainConfig
      ? Object.values(blockchainConfig.tokens).map((currency) => ({ currency }))
      : []
  }, [blockchainConfig])

  useEffect(() => {
    if (!token0 && tokenList.length > 0) {
      setToken0(tokenList[0].currency)
    }
  }, [setToken0, token0, tokenList, tokenList.length])

  const token0Balance = useMemo(() => {
    if (!token0) return '0'
    const tokenBalances = balances.find((b) => b.currency.equals(token0))
    return token0.toFactorized(tokenBalances?.balance ?? '0')
  }, [token0, balances])

  return (
    <>
      <Card>
        <CardBody>
          <From>
            <BlockchainFlow>
              <span>From</span>
              <PrimaryButton variant="outline">{connection?.config.blockchain}</PrimaryButton>
            </BlockchainFlow>
            <TokenInputWithSelector
              label="Send"
              balanceLabel="Balance"
              amount={amount}
              token={token0}
              balance={token0Balance}
              onAmountChange={setAmount}
              onTokenChange={setToken0}
              tokenList={tokenList}
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
              token={token1}
              disableTokenChange={true}
              disableMaxAction={true}
              disableAmountChange={true}
              onAmountChange={() => {}}
            />

            {adapter && (
              <DestinationAddressWrapper>
                <Input
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.currentTarget.value)}
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
