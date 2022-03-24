import React, { useCallback, useMemo } from 'react'
import { Modal, ModalBody, ModalClose, ModalHeader, ModalProps } from '@unifiprotocol/uikit'
import { useLiquidity } from '../../Liquidity'
import { getVernacularBlockchain } from '@unifiprotocol/utils'
import { Blockchains, getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { BlockchainLogo, SelectionList, SelectionListItem } from './Styles'
import { useConfig } from '../../Config'
import { useAdapter } from '../../Adapter'
import { useTranslation } from 'react-i18next'

export interface BlockchainSelectorProps extends ModalProps {
  onBlockchainSelected: (blockchain: Blockchains) => void
}

export const BlockchainSelectorModal: React.FC<BlockchainSelectorProps> = ({
  close,
  onBlockchainSelected
}) => {
  const { liquidity } = useLiquidity()
  const { t } = useTranslation()
  const { blockchainConfig } = useAdapter()
  const { config, blockchainConfig: appConfig } = useConfig()

  const onBlockchainClick = useCallback(
    (blockchain: Blockchains) => {
      onBlockchainSelected(blockchain)
      close()
    },
    [close, onBlockchainSelected]
  )

  const blockchainsWithLiquidity = useMemo(() => {
    if (!appConfig) return []
    return Object.keys(liquidity).filter((b) => {
      const blockchain = b as Blockchains
      const chainConfig = config[blockchain]!
      return (
        liquidity[blockchain].length > 0 &&
        chainConfig.type === appConfig.type &&
        blockchain !== blockchainConfig?.blockchain
      )
    })
  }, [appConfig, blockchainConfig?.blockchain, config, liquidity])

  return (
    <Modal>
      <ModalHeader>
        <span>{t('bridge.swap.choose_blockchain')}</span>
        <ModalClose onClick={close} />
      </ModalHeader>
      <ModalBody>
        <SelectionList>
          {blockchainsWithLiquidity.map((b, idx) => {
            const blockchain = b as Blockchains
            const cfg = getBlockchainConfig(blockchain)
            return (
              <SelectionListItem key={idx} onClick={() => onBlockchainClick(blockchain)}>
                <BlockchainLogo src={cfg.logoURI} alt={getVernacularBlockchain(blockchain)} />
                {getVernacularBlockchain(blockchain)}
              </SelectionListItem>
            )
          })}
        </SelectionList>
      </ModalBody>
    </Modal>
  )
}
