import { AxiosInstance } from 'axios'
import { Router } from 'vue-router'
import {
  candidates,
  globalError,
  isConfigLoading,
  isMobile,
  templates,
  user,
} from '~/composables'
import CandidateModel from '~/models/candidate-model'
import TemplateModel from '~/models/template-model'
import UserModel from '~/models/user-model'
import { TConfig } from '~/services/users-service'

export type TGlobalError = { status: number | undefined, message: string }

export default class BaseService {
  static error: (errorText: string) => void

  static api: AxiosInstance

  static baseURL = 'https://api.interview.pavlo.ru'

  static router: Router

  static async initApplication() {
    try {
      isConfigLoading.value = true
      const response = await this.api.get('/config')
      this.handleInitData(response.data)
    } catch (error) {
      this.handleError(error as TGlobalError)
    } finally {
      isConfigLoading.value = false
    }

    window.addEventListener('resize', this.handleWindowResize)
  }

  static handleWindowResize = () => {
    isMobile.value = window.innerWidth < 900
  }

  static handleInitData(data: TConfig) {
    user.value = new UserModel(data.user)
    candidates.value = data.candidates.map((candidateData) => new CandidateModel(candidateData))
    templates.value = data.templates.map((templateData) => new TemplateModel(templateData))
  }

  static handleError(error: TGlobalError) {
    globalError.value = error
  }
}
