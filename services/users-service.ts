import BaseService from '@/services/base-service'
import { ICandidate } from '~~/models/candidate-model'
import { IUser } from '~~/models/user-model'

export interface ConfigObject {
  user: IUser,
  candidates: ICandidate[],
  token?: string,
}

export default class UsersService extends BaseService {
  static AUTH_TOKEN_NAME = 'auth-token'

  static async login (email: string, password: string) {
    try {
      const data = await this.api.login(email, password)
      this.auth(data)
      this.navigateTo('/')
    } catch (error) {
      this.handleError(error)
    }
  }

  static logout () {
    this.storage.set({ [this.AUTH_TOKEN_NAME]: null })
    this.navigateTo('/login')
  }

  static async register (email: string, password: string, firstName: string, secondName: string) {
    try {
      const data = await this.api.register(email, password, firstName, secondName)
      this.auth(data)
      this.navigateTo('/')
    } catch (error) {
      this.handleError(error)
    }
  }

  static auth (data: ConfigObject) {
    this.storage.set({ [this.AUTH_TOKEN_NAME]: data.token })
    BaseService.handleInitData(data)
  }
}
