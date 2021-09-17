import { UnifiThemeProvider, Themes, ModalProvider } from '@unifiprotocol/uikit'
import { Body } from './Body'

function App() {
  return (
    <UnifiThemeProvider theme={Themes.Dark}>
      <ModalProvider>
        <Body></Body>
      </ModalProvider>
    </UnifiThemeProvider>
  )
}

export default App
