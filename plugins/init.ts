import BaseService from '~~/services/base-service'
import StorageFabric from '~~/storage/storage'
import ApiService from '~~/services/api/api-service'

export default defineNuxtPlugin(() => {
  BaseService.storage = StorageFabric.createStorage(true)
  BaseService.api = new ApiService()
  BaseService.navigateTo = navigateTo

  BaseService.initApplication()
})
