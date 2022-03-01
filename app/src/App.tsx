import { UnifiThemeProvider, Themes } from '@unifiprotocol/uikit'
import { Blockchains, TokenLogoResolvers } from '@unifiprotocol/utils'
import { ShellWrappedComp } from '@unifiprotocol/shell'
import { Body } from './Template/Body'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Bridge } from './Bridge/View'
import { I18nextProvider } from 'react-i18next'
import { useMemo } from 'react'
import { AdapterContext } from './Adapter'

const App: ShellWrappedComp = ({ i18n, connection, balances, eventBus }) => {
  const blockchain = useMemo(
    () => connection.adapter?.adapter.blockchainConfig.blockchain ?? Blockchains.Binance,
    [connection]
  )

  return (
    <AdapterContext.Provider value={{ connection, balances, eventBus }}>
      <I18nextProvider i18n={i18n}>
        <UnifiThemeProvider
          theme={Themes.Dark}
          options={{
            tokenLogoResolver: TokenLogoResolvers[blockchain]
          }}
        >
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
