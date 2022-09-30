import ApiService from './api/api-service'
import { ConfigObject } from './users-service'
import { IStorage } from '~/storage/storage'
import { user } from '@/compositions/users'
import { candidates } from '@/compositions/candidates'
import UserModel from '~~/models/user-model'
import { isConfigLoading } from '~~/compositions/loaders'
import CandidateModel from '~~/models/candidate-model'

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
    } finally {
      isConfigLoading.value = false
    }
  }

  static handleInitData (data: ConfigObject) {
    user.value = new UserModel(data.user)
    candidates.value = data.candidates.map(candidateData => new CandidateModel(candidateData))
  }
}
