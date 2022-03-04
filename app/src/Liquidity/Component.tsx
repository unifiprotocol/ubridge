import React, { useEffect, useState } from 'react'
import { useLiquidity } from '.'
import { useConfig } from '../Config'

export const Liquidty = () => {
  const [init, setInit] = useState(false)
  const { updateLiquidity } = useLiquidity()
  const { config } = useConfig()

  useEffect(() => {
    if (Object.keys(config).length > 0 && !init) {
      updateLiquidity()
      setInit(true)
    }
  }, [config, init, updateLiquidity])

  return <></>
}
