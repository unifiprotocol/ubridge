import React, { useCallback, useMemo } from 'react'
import { Modal, ModalBody, ModalClose, ModalHeader, ModalProps } from '@unifiprotocol/uikit'
import { useLiquidity } from '../../Liquidity'
import { getVernacularBlockchain } from '@unifiprotocol/utils'
import { Blockchains } from '@unifiprotocol/core-sdk'
import { SelectionList, SelectionListItem } from './Styles'
import { useConfig } from '../../Config'

export interface BlockchainSelectorProps extends ModalProps {
  onBlockchainSelected: (blockchain: Blockchains) => void
}

export const BlockchainSelectorModal: React.FC<BlockchainSelectorProps> = ({
  close,
  onBlockchainSelected
}) => {
  const { liquidity } = useLiquidity()
  const { config, blockchainConfig } = useConfig()

  const onBlockchainClick = useCallback(
    (blockchain: Blockchains) => {
      onBlockchainSelected(blockchain)
      close()
    },
    [close, onBlockchainSelected]
  )

  const blockchainsWithLiquidity = useMemo(() => {
    if (!blockchainConfig) return []
    return Object.keys(liquidity).filter((b) => {
      const blockchain = b as Blockchains
      const chainConfig = config[blockchain]!
      return liquidity[blockchain].length > 0 && chainConfig.type === blockchainConfig.type
    })
  }, [blockchainConfig, config, liquidity])

  return (
    <Modal>
      <ModalHeader>
        <span>Choose the blockchain target</span>
        <ModalClose onClick={close} />
      </ModalHeader>
      <ModalBody>
        <SelectionList>
          {blockchainsWithLiquidity.map((b, idx) => {
            const blockchain = b as Blockchains
            return (
              <SelectionListItem key={idx} onClick={() => onBlockchainClick(blockchain)}>
                {getVernacularBlockchain(blockchain)}
              </SelectionListItem>
            )
          })}
        </SelectionList>
      </ModalBody>
    </Modal>
  )
}
