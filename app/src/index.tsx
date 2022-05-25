import React from 'react'
import ReactDOM from 'react-dom'
import { Shell, ShellWrappedComp } from '@unifiprotocol/shell'
import UBridge from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { UBridgeSidebar } from './Components/Sidebar'

const App: ShellWrappedComp = (props) => {
  return (
    <Routes>
      <Route path="/bridge/*" element={<UBridge {...props} />} />
      <Route path="*" element={<Navigate to="/bridge" />} />
    </Routes>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Shell Wrapped={App} Sidebar={[UBridgeSidebar]} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
