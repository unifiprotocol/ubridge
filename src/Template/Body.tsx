import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import { useScroll } from '../Shared/Hooks/useScroll'
import { Topbar } from './Topbar'

const BodyWrapper = styled.div<{ offset: number }>`
  margin-top: ${(p) => -p.offset}px;
  padding-top: 5rem;
  padding-bottom: 1000px;
`

const TopbarWrapper = styled.div<{ offset: number }>`
  position: fixed;
  margin-top: ${(p) => -p.offset}px;
  top: 0;
  right: 0;
  left: 0;
`

export const Body: React.FC = ({ children }) => {
  const topbarRef = useRef<HTMLDivElement>(null)

  const { scrollTop } = useScroll()

  const offset = useMemo(() => {
    console.log('scrollTop', scrollTop)
    return Math.min(25, scrollTop)
  }, [scrollTop])
  return (
    <BodyWrapper offset={offset}>
      <TopbarWrapper ref={topbarRef} offset={offset}>
        <Topbar />
      </TopbarWrapper>
      {children}
    </BodyWrapper>
  )
}
