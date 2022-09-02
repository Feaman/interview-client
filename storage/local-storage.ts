import { IStorage } from "./storage"

export default class LocalStorage implements IStorage {
  static LOCAL_STORAGE_KEY = '__interview-app-for-interviewer__'

  set (data: any) {
    // Merge data with existing one
    const existingData = this._get()
    data = Object.assign(existingData, data)
    window.localStorage.setItem(LocalStorage.LOCAL_STORAGE_KEY, JSON.stringify(data))

    return Promise.resolve(data)
  }

  get (key = '') {
    return Promise.resolve(this._get(key))
  }

  _get (key = '') {
    const data = JSON.parse(window.localStorage.getItem(LocalStorage.LOCAL_STORAGE_KEY) || '{}')
    return key ? data[key] : data
  }
}
