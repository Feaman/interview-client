import BaseService from '~~/services/base-service'
import StorageFabric from '~~/storage/storage'
import ApiService from '~~/services/api/api-service'

export default defineNuxtPlugin(async () => {
  BaseService.storage = StorageFabric.createStorage(true)
  BaseService.api = new ApiService()
  BaseService.navigateTo = navigateTo

  try {
    await BaseService.initApplication()
  } catch (error) {
    if (error?.response?.status !== 401) {
      throw createError({ fatal: true, message: error?.message || 'Unexpected error', statusCode: error?.response?.status })
    }
  }
})
