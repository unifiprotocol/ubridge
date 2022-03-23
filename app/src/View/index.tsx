import React, { useMemo, useState } from 'react'
import { BridgeWrapper, SwitchWrapper } from './Styles'
import { useTranslation } from 'react-i18next'
import { Switch } from '@unifiprotocol/uikit'
import { Swap } from './Components/Swap'
import { Liquidity } from './Components/Liquidity'
import { useAdapter } from '../Adapter'
import { Transactions } from './Components/Transactions'

export const Bridge: React.FC = () => {
  const [section, setSection] = useState('swap')
  const { adapter } = useAdapter()
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
          onChange={setSection}
          selected={section}
        />
      </SwitchWrapper>
      <Section />
    </BridgeWrapper>
  )
}
