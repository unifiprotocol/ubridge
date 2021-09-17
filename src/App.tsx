import { UnifiThemeProvider, Themes, ModalProvider } from '@unifiprotocol/uikit'
import { Body } from './Body'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Bridge } from './Bridge/View'

function App() {
  return (
    <UnifiThemeProvider theme={Themes.Dark}>
      <ModalProvider>
        <Router>
          <Body>
            <Switch>
              <Route path="/">
                <Bridge />
              </Route>
            </Switch>
          </Body>
        </Router>
      </ModalProvider>
    </UnifiThemeProvider>
  )
}

export default App
