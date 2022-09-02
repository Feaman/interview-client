import LocalStorageService from '~/storage/local-storage'

export interface IStorage {
  set (data: any): Promise<any>
  get (key?: string): Promise<any>
}

export default class StorageFabric {
  static createStorage (isLocal: boolean) {
    if (isLocal) {
      return new LocalStorageService()
    } else {
      throw new Error('Remote API not ready.')
    }
  }
}
