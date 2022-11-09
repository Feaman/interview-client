import { ConfigObject } from '~/services/users-service'
import ApiService from '~/services/api/api-service'
import { IStorage } from '~/storage/storage'
import { user } from '~/compositions/users'
import { candidates } from '~/compositions/candidates'
import UserModel from '~/models/user-model'
import { isConfigLoading } from '~/compositions/loaders'
import CandidateModel from '~/models/candidate-model'

export default class BaseService {
  static error: (errorText: string) => void
  static storage: IStorage
  static isDev: boolean
  static api: ApiService
  static navigateTo: typeof navigateTo

  static async initApplication (): Promise<any> {
    try {
      isConfigLoading.value = true
      const data = await this.api.getConfig()
      this.handleInitData(data)
    } catch (error) {
      this.handleError(error)
    } finally {
      isConfigLoading.value = false
    }
  }

  static handleInitData (data: ConfigObject) {
    user.value = new UserModel(data.user)
    candidates.value = data.candidates.map(candidateData => new CandidateModel(candidateData))
  }

  static handleError (error: any) {
    if (error.response?.status === 401) {
      BaseService.navigateTo('/login')
      throw error
    } else {
      throw error
    }
  }
}
