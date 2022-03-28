import { ShowNotification } from '@unifiprotocol/shell'

type TNotification = (content: string) => ShowNotification

export const InfoNotification: TNotification = (content: string) =>
  new ShowNotification({
    content,
    appearance: 'info'
  })

export const SuccessNotification: TNotification = (content: string) =>
  new ShowNotification({
    content,
    appearance: 'success'
  })

export const FailNotification: TNotification = (content: string) =>
  new ShowNotification({
    content,
    appearance: 'error'
  })
