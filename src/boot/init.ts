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

  BaseService.initApplication()
})
