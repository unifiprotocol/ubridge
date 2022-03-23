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
import { getVernacularBlockchain } from '@unifiprotocol/utils'
import { useAdapter } from '../../Adapter'
import { useConfig } from '../../Config'
import { useSwap } from '../../Swap'
import { BlockchainSelectorModal, BlockchainSelectorProps } from '../BlockchainSelector'
import { ShowNotification } from '@unifiprotocol/shell'
import { useTranslation } from 'react-i18next'

export const BridgeForm: React.FC = () => {
  const { t } = useTranslation()
  const { blockchainConfig } = useConfig()
  const { adapter, balances, connection, eventBus, getBalanceByCurrency } = useAdapter()
  const {
    amount,
    token0,
    token1,
    targetChain,
    destinationAddress,
    swapStatus,
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
    if (swapStatus === 'OK') {
      return overviewTransaction()
    }
    eventBus?.emit(
      new ShowNotification({ content: t(`bridge.swap.${swapStatus}`), appearance: 'error' })
    )
  }, [eventBus, overviewTransaction, swapStatus, t])

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
    if (!blockchainConfig) return []
    return Object.values(blockchainConfig.tokens).map((currency) => {
      const { balance } = getBalanceByCurrency(currency)
      return { currency, balance: currency.toFactorized(balance) }
    })
  }, [blockchainConfig, getBalanceByCurrency])

  useEffect(() => {
    if (!token0 && tokenList.length > 0) {
      setToken0(tokenList[0].currency)
    } else if (token0 && !tokenList.some((t) => t.currency.equals(token0))) {
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
              <span>{t('bridge.common.from')}</span>
              <PrimaryButton variant="outline">{vernacularOrigin}</PrimaryButton>
            </BlockchainFlow>
            <TokenInputWithSelector
              label={t('bridge.swap.send')}
              balanceLabel={t('bridge.common.balance')}
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
            <CgArrowsExchangeV size={30} /> <span>{t('bridge.swap.you_will_receive')}</span>
          </BridgeDirection>
          <To>
            <BlockchainFlow>
              <span>{t('bridge.common.to')}</span>
              <PrimaryButton variant="outline" onClick={selectTargetBlockchain}>
                {vernacularTarget}
              </PrimaryButton>
            </BlockchainFlow>
            <TokenInput
              label={t('bridge.swap.receive')}
              balanceLabel={t('bridge.common.balance')}
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
                  prefixAddon={
                    <DestinationLabel>{t('bridge.swap.destination_address')}</DestinationLabel>
                  }
                />
              </DestinationAddressWrapper>
            )}
          </To>
          <TransactionDetailsWrapper>
            <TransactionDetails />
          </TransactionDetailsWrapper>
          <TransferOverviewButton block={true} size="xl" onClick={onSubmit}>
            <CgArrowsExchangeV size={30} /> {t('bridge.swap.transfer_overview')}
          </TransferOverviewButton>
        </CardBody>
      </Card>
    </>
  )
}
