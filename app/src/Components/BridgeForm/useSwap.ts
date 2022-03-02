import { useState } from 'react'
import { Currency } from '@unifiprotocol/utils'

export const useSwap = () => {
  const [amount, setAmount] = useState('0')
  const [token0, setToken0] = useState<Currency | undefined>(undefined)
  const [destinationAddress, setDestinationAddress] = useState('')

  return {
    amount,
    token0,
    token1: token0,
    destinationAddress,
    setDestinationAddress,
    setAmount,
    setToken0
  }
}
