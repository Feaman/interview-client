import BaseService from '~~/services/base'
import StorageFabric from '~~/storage/storage'

export default defineNuxtPlugin(() => {
  BaseService.storage = StorageFabric.createStorage(true)
})
