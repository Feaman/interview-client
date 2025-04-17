import { user } from '~/composables'
import { TCandidate } from '~/models/candidate-model'
import { TFile } from '~/models/file-model'
import { TTemplate } from '~/models/template-model'
import UserModel, { TUser } from '~/models/user-model'
import BaseService from '~/services/base-service'
import StorageService from '~/services/storage'

export type TConfig = {
  user: TUser,
  candidates: TCandidate[],
  templates: TTemplate[],
  token?: string,
  files: TFile[],
}

export default class UsersService extends BaseService {
  static AUTH_TOKEN_NAME = 'auth-token'

  static auth(data: TConfig) {
    StorageService.set({ [this.AUTH_TOKEN_NAME]: data.token })
    BaseService.handleInitData(data)
    this.router.push('/')
  }

  static async signIn(email: string, password: string) {
    const response = await this.api.post('/login', { email, password })
    this.auth(response.data)
  }

  static async update(formData: FormData) {
    const response = await this.api.put('/users', formData)
    if (!user.value) {
      throw new Error('User not found')
    }
    user.value = new UserModel(response.data)
  }

  static async signUp(formData: FormData) {
    const response = await this.api.post('/users', formData)
    this.auth(response.data)
  }

  static signOut() {
    StorageService.set({ [this.AUTH_TOKEN_NAME]: undefined })
    user.value = undefined
    BaseService.router.push('/sign')
  }
}
