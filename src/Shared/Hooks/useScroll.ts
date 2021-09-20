import { useCallback, useEffect, useState } from 'react'

export const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollDirection] = useState('down')

  const listener = useCallback((e: Event) => {
    setScrollTop(window.scrollY)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', listener)
    return () => {
      window.removeEventListener('scroll', listener)
    }
  }, [listener])

  return {
    scrollTop,
    scrollDirection
  }
}
