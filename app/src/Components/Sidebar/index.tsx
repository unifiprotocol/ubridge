import { useTranslation } from 'react-i18next'
import { AiOutlineSwap, GiTwoCoins, BiListCheck } from '@unifiprotocol/uikit'
import { ShellWrappedComp, SidebarItem } from '@unifiprotocol/shell'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const SidebarItemGroupHeader = styled.div<{ active: boolean }>`
  color: ${(p) => (p.active ? p.theme.primaryColor : p.theme.txt100)};
  opacity: 0.8;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
  padding-left: 0.5rem;
  padding-bottom: 0.1rem;
`

export const UBridgeSidebar: ShellWrappedComp = (props) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <SidebarItemGroupHeader active={new RegExp('^/bridge').test(location.pathname)}>
        UBridge
      </SidebarItemGroupHeader>
      <SidebarItem
        active={new RegExp('^/bridge/swap').test(location.pathname)}
        icon={AiOutlineSwap}
        onClick={() => navigate(`/bridge/swap`)}
      >
        Swap
      </SidebarItem>
      {props.adapter.isConnected() && (
        <SidebarItem
          active={new RegExp('^/bridge/transactions').test(location.pathname)}
          icon={BiListCheck}
          onClick={() => navigate(`/bridge/transactions`)}
        >
          {t('bridge.swap.tab.transactions')}
        </SidebarItem>
      )}
      <SidebarItem
        active={new RegExp('^/bridge/liquidity').test(location.pathname)}
        icon={GiTwoCoins}
        onClick={() => navigate(`/bridge/liquidity`)}
      >
        {t('bridge.swap.tab.liquidity')}
      </SidebarItem>
    </>
  )
}
