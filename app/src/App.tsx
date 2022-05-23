import { UnifiThemeProvider, Themes } from '@unifiprotocol/uikit'
import { Blockchains, TokenLogoResolvers } from '@unifiprotocol/utils'
import { ShellWrappedComp } from '@unifiprotocol/shell'
import { Body } from './Template/Body'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Bridge } from './View'
import { I18nextProvider } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { AdapterContext } from './Adapter'
import { Config } from './Config/Component'
import { Liquidty } from './Liquidity/Component'
import { Swap } from './Swap/Component'
import Clocks from './Services/Clocks'
import { Transactions } from './Transactions/Component'
import { RecoilRoot } from 'recoil'

const App: ShellWrappedComp = ({ i18n, connection, balances, eventBus }) => {
  const blockchain = useMemo(
    () => connection.adapter?.adapter.blockchainConfig.blockchain ?? Blockchains.Binance,
    [connection]
  )

  useEffect(() => {
    Clocks.start()
  }, [])

  return (
    <RecoilRoot>
      <AdapterContext.Provider value={{ connection, balances, eventBus }}>
        <I18nextProvider i18n={i18n}>
          <UnifiThemeProvider
            theme={Themes.Dark}
            options={{
              tokenLogoResolver: TokenLogoResolvers[blockchain]
            }}
          >
            <Config />
            <Liquidty />
            <Swap />
            <Transactions />
            <Body>
              <Routes>
                <Route path="/bridge/swap" element={<Bridge section="swap" />} />
                <Route path="/bridge/liquidity" element={<Bridge section="liquidity" />} />
                <Route path="/bridge/transactions" element={<Bridge section="transactions" />} />
                <Route path="/" element={<Navigate to="/bridge/swap" />} />
              </Routes>
            </Body>
          </UnifiThemeProvider>
        </I18nextProvider>
      </AdapterContext.Provider>
    </RecoilRoot>
  )
}

export default App
