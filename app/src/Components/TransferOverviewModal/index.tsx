import {
  Checkbox,
  ModalBody,
  ModalClose,
  ModalHeader,
  ModalProps,
  PrimaryButton,
  TokenAmount
} from '@unifiprotocol/uikit'
import { BN, shortAddress } from '@unifiprotocol/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useAdapter } from '../../Adapter'
import { useSwap } from '../../Swap'
import { TransactionDetails } from '../BridgeForm/TransactionDetails'
import {
  TransferOverviewModalWrapper,
  Desc,
  Swap,
  Send,
  Address,
  Receive,
  Confirm,
  TransferActions
} from './Styles'

export interface TransferOverviewModalProps extends ModalProps {}

export const TransferOverviewModal: React.FC<TransferOverviewModalProps> = ({ close }) => {
  const { t } = useTranslation()
  const [confirmed, setConfirmed] = useState(false)
  const { targetChain, targetCurrency, destinationAddress, amount, allowances, approve, deposit } =
    useSwap()
  const { blockchainConfig, adapter } = useAdapter()

  const isApproved = useMemo(() => {
    if (!targetCurrency) return false
    const precisedAmount = targetCurrency.toPrecision(amount)
    return BN(allowances[targetCurrency.address]).gte(precisedAmount)
  }, [allowances, amount, targetCurrency])

  const onSubmit = useCallback(() => {
    deposit()?.then(() => {
      close()
    })
  }, [close, deposit])

  return (
    <TransferOverviewModalWrapper>
      <ModalHeader>
        <span>{t('bridge.swap.overview.title')}</span>
        <ModalClose onClick={close} />
      </ModalHeader>
      <ModalBody>
        <Desc>{t('bridge.swap.overview.confirmation_text')}</Desc>
        <Swap>
          <Send>
            <span>
              From <b>{blockchainConfig?.blockchain}</b>
            </span>
            <Address>{shortAddress(adapter?.getAddress() ?? '')}</Address>
            {targetCurrency && <TokenAmount token={targetCurrency} amount={amount} />}
          </Send>

          <Receive>
            <span>
              To <b>{targetChain}</b>
            </span>

            <Address>{shortAddress(destinationAddress)}</Address>
            {targetCurrency && <TokenAmount token={targetCurrency} amount={amount} />}
          </Receive>
        </Swap>
        <TransactionDetails />
        <Confirm>
          <Checkbox
            checked={confirmed}
            onChange={setConfirmed}
            label={
              <Trans key={'bridge.swap.overview.terms_conditions'}>
                I read and accept the <a href="#xd">terms and conditions</a>
              </Trans>
            }
          />
        </Confirm>
        <TransferActions>
          <PrimaryButton
            disabled={!confirmed || isApproved}
            block={true}
            size="xl"
            onClick={approve}
          >
            {t('bridge.swap.overview.approve')}
          </PrimaryButton>
          <PrimaryButton
            disabled={!confirmed || !isApproved}
            block={true}
            size="xl"
            onClick={onSubmit}
          >
            {t('bridge.swap.overview.perform_swap')}
          </PrimaryButton>
        </TransferActions>
      </ModalBody>
    </TransferOverviewModalWrapper>
  )
}
