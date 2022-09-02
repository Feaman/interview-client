import { IStorage } from '~/storage/storage'

export default class BaseService {
  static error: (errorText: string) => void
  static storage: IStorage
  static isDev: boolean
}
