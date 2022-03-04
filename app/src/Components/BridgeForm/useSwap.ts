import { useEffect, useState } from 'react'
import { Currency } from '@unifiprotocol/utils'
import { useAdapter } from '../../Adapter'

export const useSwap = () => {
  const { adapter } = useAdapter()

  const [amount, setAmount] = useState('0')
  const [token0, setToken0] = useState<Currency | undefined>(undefined)
  const [destinationAddress, setDestinationAddress] = useState(
    adapter?.isConnected() ? adapter.getAddress() : ''
  )

  useEffect(() => {
    if (destinationAddress === '' && adapter?.isConnected()) {
      setDestinationAddress(adapter.getAddress())
    }
  }, [adapter, destinationAddress])

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
