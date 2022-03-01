import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'

interface TAdapterState {
  address: string | undefined
}

const AdapterState = atom<TAdapterState>({
  key: 'AdapterState',
  default: {
    address: undefined
  }
})

export const useAdapter = () => {
  const [{ address }, setState] = useRecoilState(AdapterState)
  const connect = useCallback(() => {
    const address = '0x52856Ca4ddb55A1420950857C7882cFC8E02281C'
    setState((s) => ({ ...s, address }))
  }, [setState])
  return {
    connect,
    address
  }
}
