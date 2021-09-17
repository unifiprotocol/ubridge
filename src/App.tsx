import { UnifiThemeProvider, Themes, Assets } from '@unifiprotocol/uikit'
import styled from 'styled-components'
const Main = styled.div`
  margin: 5rem auto;
  font-size: 2rem;
  text-align: center;
  img {
    margin-bottom: 1rem;
  }
`
function App() {
  return (
    <UnifiThemeProvider theme={Themes.Dark}>
      <Main>
        <img src={Assets.Logos.UnifiLogoTextLight} height={50} />
        <br />
        React App Boilerplate
      </Main>
    </UnifiThemeProvider>
  )
}

export default App
