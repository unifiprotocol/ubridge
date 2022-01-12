import { Currency } from '@unifiprotocol/utils'
import { IConfig } from './IConfig'

export const Config: IConfig = {
  unfiToken: new Currency(
    '0x728c5bac3c3e370e372fc4671f9ef6916b814d8b',
    18,
    'UNFI',
    'UnifiProtocol DAO',
    'https://icon-service.unifi.report/icon_bsc?token=0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B&autoResolve=false'
  )
}
