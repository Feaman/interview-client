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

  static login (email: string, password: string) {
    return this.api.login(email, password)
      .then((data: ConfigObject) => this.auth(data))
      .then(() => { this.navigateTo('/') })
  }

  static logout () {
    this.storage.set({ [this.AUTH_TOKEN_NAME]: null })
    this.navigateTo('/login')
  }

  static register (email: string, password: string, firstName: string, secondName: string) {
    return this.api.register(email, password, firstName, secondName)
      .then((data: ConfigObject) => this.auth(data))
  }

  static auth (data: ConfigObject) {
    this.storage.set({ [this.AUTH_TOKEN_NAME]: data.token })
    return BaseService.handleInitData(data)
  }
}
