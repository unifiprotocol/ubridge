import { UnifiThemeProvider, Themes } from '@unifiprotocol/uikit'
import { Blockchains, TokenLogoResolvers } from '@unifiprotocol/utils'
import { ShellWrappedComp } from '@unifiprotocol/shell'
import { Body } from './Template/Body'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Bridge } from './View'
import { I18nextProvider } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { AdapterContext } from './Adapter'
import { Config } from './Config/Component'
import { Liquidty } from './Liquidity/Component'
import Clocks from './Services/Clocks'

const App: ShellWrappedComp = ({ i18n, connection, balances, eventBus }) => {
  const blockchain = useMemo(
    () => connection.adapter?.adapter.blockchainConfig.blockchain ?? Blockchains.Binance,
    [connection]
  )

  useEffect(() => {
    Clocks.start()
  }, [])

  return (
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
          <Router>
            <Body>
              <Switch>
                <Route path="/">
                  <Bridge />
                </Route>
              </Switch>
            </Body>
          </Router>
        </UnifiThemeProvider>
      </I18nextProvider>
    </AdapterContext.Provider>
  )
}

export default App
