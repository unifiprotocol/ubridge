import { BrandedHeader } from '@unifiprotocol/uikit'
import React from 'react'

export const Body: React.FC = ({ children }) => {
  return (
    <>
      <BrandedHeader />
      {children}
    </>
  )
}
