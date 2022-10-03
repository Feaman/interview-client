import BaseService from './base-service'
import ApiService from './api/api-service'
import CandidateModel, { ICandidate } from '~~/models/candidate-model'
import { isCandidateLoading } from '~~/compositions/loaders'

export default class CandidateService extends BaseService {
  static async update (candidate: CandidateModel) {
    try {
      isCandidateLoading.value = true
      const candidateData = await this.api.updateCandidate(candidate)
      isCandidateLoading.value = false
      return new CandidateModel(candidateData)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async create (name: string, data: string) {
    try {
      isCandidateLoading.value = true
      const candidateData = await this.api.createCandidate(name, data)
      isCandidateLoading.value = false
      return new CandidateModel(candidateData)
    } catch (error) {
      this.handleError(error)
    }
  }

  static async remove (candidate: CandidateModel) {
    try {
      isCandidateLoading.value = true
      await this.api.removeCandidate(candidate)
      isCandidateLoading.value = false
    } catch (error) {
      this.handleError(error)
    }
  }
}
