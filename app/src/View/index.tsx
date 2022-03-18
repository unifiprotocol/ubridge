import React, { useMemo, useState } from 'react'
import { BridgeWrapper, SwitchWrapper } from './Styles'
import { useTranslation } from 'react-i18next'
import { Switch } from '@unifiprotocol/uikit'
import { Swap } from './Components/Swap'
import { Liquidity } from './Components/Liquidity'

export const Bridge: React.FC = () => {
  const [section, setSection] = useState('swap')
  const { t } = useTranslation()

  const Section = useMemo(() => () => section === 'swap' ? <Swap /> : <Liquidity />, [section])

  return (
    <BridgeWrapper>
      <SwitchWrapper>
        <Switch
          choices={[
            { value: 'swap', label: t('bridge.swap.tab.swap') },
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
