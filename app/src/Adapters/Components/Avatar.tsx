import React, { useMemo } from 'react'
import { useAdapter } from '../useAdapter'
import blockies from 'ethereum-blockies-png'
import styled from 'styled-components'

const AvatarImg = styled.img`
  border-radius: 100%;
`

type AvatarProps = React.InputHTMLAttributes<HTMLImageElement>

export const Avatar: React.FC<AvatarProps> = (props) => {
  const { address } = useAdapter()
  const avatar = useMemo(
    () => blockies.createDataURL({ seed: address || '0x0', scale: 1 }),
    [address]
  )

  return <AvatarImg {...(props as any)} src={avatar} alt={address} />
}
