import React from 'react'
import { Topbar } from './Template/Topbar'

export const Body: React.FC = ({ children }) => {
  return (
    <>
      <Topbar />
      {children}
    </>
  )
}
