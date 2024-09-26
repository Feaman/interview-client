import axios, { AxiosInstance } from 'axios'
import { boot } from 'quasar/wrappers'
import BaseService from '~/services/base-service'
import StorageService from '~/services/storage'
import UsersService from '~/services/users-service'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: BaseService.baseURL })

export default boot(({ app }) => {
  api.interceptors.request.use((config) => {
    // Auth token
    const token = StorageService.get(UsersService.AUTH_TOKEN_NAME)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })
})

export { api }
