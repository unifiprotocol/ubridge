import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BridgeWrapper, SwitchWrapper } from './Styles'
import { useTranslation } from 'react-i18next'
import { Switch } from '@unifiprotocol/uikit'
import { Swap } from './Components/Swap'
import { Liquidity } from './Components/Liquidity'
import { useAdapter } from '../Adapter'
import { Transactions } from './Components/Transactions'
import { TransactionBar } from '../Components/TransactionBar'

type BridgeSection = 'swap' | 'transactions' | 'liquidity'
interface BridgeProps {
  section: BridgeSection
}
export const Bridge: React.FC<BridgeProps> = ({ section }) => {
  const { adapter } = useAdapter()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const Section = useMemo(
    () => () => {
      switch (section) {
        case 'swap':
          return <Swap />
        case 'transactions':
          return <Transactions />
        case 'liquidity':
          return <Liquidity />
        default:
          return <Swap />
      }
    },
    [section]
  )

  return (
    <>
      <TransactionBar />
      <BridgeWrapper>
        <SwitchWrapper>
          <Switch
            choices={[
              { value: 'swap', label: t('bridge.swap.tab.swap') },
              ...(adapter?.isConnected()
                ? [{ value: 'transactions', label: t('bridge.swap.tab.transactions') }]
                : []),
              { value: 'liquidity', label: t('bridge.swap.tab.liquidity') }
            ]}
            onChange={(section) => navigate(`/bridge/${section}`)}
            selected={section}
          />
        </SwitchWrapper>
        <Section />
      </BridgeWrapper>
    </>
  )
}
