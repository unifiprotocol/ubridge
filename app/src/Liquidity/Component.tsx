import React, { useEffect, useState } from 'react'
import { useLiquidity } from '.'
import { useConfig } from '../Config'
import Clocks from '../Services/Clocks'

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

  useEffect(() => {
    const fn = () => updateLiquidity()
    Clocks.on('SIXTY_SECONDS', fn)
    return () => {
      Clocks.off('SIXTY_SECONDS', fn)
    }
  }, [updateLiquidity])

  return <></>
}
