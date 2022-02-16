import { UnifiThemeProvider, Themes } from '@unifiprotocol/uikit'
import { TokenLogoResolvers } from '@unifiprotocol/utils'
import { Body } from './Template/Body'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Bridge } from './Bridge/View'
import { RecoilRoot } from 'recoil'

function App() {
  return (
    <UnifiThemeProvider
      theme={Themes.Dark}
      options={{ tokenLogoResolver: TokenLogoResolvers.Binance }}
    >
      <RecoilRoot>
        <Router>
          <Body>
            <Switch>
              <Route path="/">
                <Bridge />
              </Route>
            </Switch>
          </Body>
        </Router>
      </RecoilRoot>
    </UnifiThemeProvider>
  )
}

export default App
