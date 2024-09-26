import { LocalStorage, WebStorageGetMethodReturnType } from 'quasar'
import BaseService from '~/services/base-service'

export default class StorageService extends BaseService {
  private static key = '__ELVEN-INTERVIEW__'

  static set(data: object) {
    // Merge data with existing one
    const existingData = this.get()
    data = Object.assign(existingData, data)

    LocalStorage.set(StorageService.key, data)
  }

  static get(key = '') {
    const data: {[index: string]: WebStorageGetMethodReturnType }
      | string = LocalStorage.getItem(StorageService.key) || {}
    if (typeof data === 'string') {
      const parseData = JSON.parse(data)
      return key ? parseData[key] : parseData
    }
    return key ? data[key] : data
  }
}
