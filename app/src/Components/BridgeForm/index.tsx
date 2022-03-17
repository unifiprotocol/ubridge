import {
  Card,
  CardBody,
  Input,
  PrimaryButton,
  TokenInput,
  TokenInputWithSelector,
  useModal
} from '@unifiprotocol/uikit'
import React, { useCallback, useEffect, useMemo } from 'react'
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
import { BN, getVernacularBlockchain } from '@unifiprotocol/utils'
import { useAdapter } from '../../Adapter'
import { useConfig } from '../../Config'
import { useSwap } from '../../Swap'
import { BlockchainSelectorModal, BlockchainSelectorProps } from '../BlockchainSelector'

export const BridgeForm: React.FC = () => {
  const { blockchainConfig } = useConfig()
  const { adapter, balances, connection } = useAdapter()
  const {
    amount,
    token0,
    token1,
    targetChain,
    destinationAddress,
    setDestinationAddress,
    setTargetChain,
    setAmount,
    setToken0
  } = useSwap()

  const overviewTransactionProps = useMemo(() => ({}), [])
  const [overviewTransaction] = useModal<TransferOverviewModalProps>({
    component: TransferOverviewModal,
    props: overviewTransactionProps,
    options: { disableBackdropClick: true }
  })

  const onSubmit = useCallback(() => {
    if (!BN(amount).isNaN() && BN(amount).gt(0)) overviewTransaction()
  }, [amount, overviewTransaction])

  const [selectTargetBlockchain] = useModal<BlockchainSelectorProps>({
    component: BlockchainSelectorModal,
    props: {
      onBlockchainSelected: setTargetChain
    },
    options: {
      disableBackdropClick: true
    }
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

  const vernacularOrigin = useMemo(() => {
    return connection?.config.blockchain
      ? getVernacularBlockchain(connection?.config.blockchain)
      : ''
  }, [connection?.config.blockchain])

  const vernacularTarget = useMemo(() => {
    return targetChain ? getVernacularBlockchain(targetChain) : ''
  }, [targetChain])

  return (
    <>
      <Card>
        <CardBody>
          <From>
            <BlockchainFlow>
              <span>From</span>
              <PrimaryButton variant="outline">{vernacularOrigin}</PrimaryButton>
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
              maxPercentage={'0.9999999999'}
            />
          </From>
          <BridgeDirection>
            <CgArrowsExchangeV size={30} /> <span>You will receive</span>
          </BridgeDirection>
          <To>
            <BlockchainFlow>
              <span>To</span>
              <PrimaryButton variant="outline" onClick={selectTargetBlockchain}>
                {vernacularTarget}
              </PrimaryButton>
            </BlockchainFlow>
            <TokenInput
              label="Receive"
              balanceLabel="Balance"
              amount={amount}
              token={token1}
              disableTokenChange={true}
              disableMaxAction={true}
              onAmountChange={setAmount}
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
          <TransferOverviewButton block={true} size="xl" onClick={onSubmit}>
            <CgArrowsExchangeV size={30} /> Transfer overview
          </TransferOverviewButton>
        </CardBody>
      </Card>
    </>
  )
}
