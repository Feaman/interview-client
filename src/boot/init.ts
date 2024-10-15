import { AxiosError } from 'axios'
import { boot } from 'quasar/wrappers'
import { api } from '~/boot/axios'
import BaseService from '~/services/base-service'

export default boot(({ app }) => {
  BaseService.api = api

  // Register all the components
  const componentsFolderFiles: { [index: string]: { default: object } } = import.meta.globEager('../components/**/*.vue')
  Object.keys(componentsFolderFiles).forEach((key: string) => {
    const part: string | undefined = key.split('/').pop()
    if (part) {
      app.component(part.split('.')[0], componentsFolderFiles[key].default)
    }
  })

  app.config.errorHandler = (error) => {
    const status = (error as { response: { data: { statusCode: number }}}).response?.data?.statusCode || (error as AxiosError).status || 500
    const message = (typeof error === 'string')
      ? error
      : (error as { response: { data: { message: string }}}).response?.data?.message || (error as Error).message || 'Unexpected error'
    const stack = (error as Error)?.stack
    BaseService.handleError({ status, message, stack })
  }

  BaseService.initApplication()
})
