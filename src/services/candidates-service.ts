import { currentCandidate, isCandidateLoading } from '~/composables'
import CandidateModel, { TCandidate } from '~/models/candidate-model'
import BaseService, { TGlobalError } from '~/services/base-service'

export default class CandidateService extends BaseService {
  static async update(candidate: CandidateModel | FormData) {
    let candidateData
    try {
      isCandidateLoading.value = true
      const isFormData = candidate instanceof FormData
      if (!isFormData) {
        candidate.data = JSON.stringify(candidate.questions)
      }
      const candidateId = isFormData ? candidate.get('id') : candidate.id
      const response = await this.api.put(`candidates/${candidateId}`, candidate)
      candidateData = response.data
      isCandidateLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
    return new CandidateModel(candidateData)
  }

  static async create(formData: FormData): Promise<CandidateModel> {
    let candidateData
    try {
      isCandidateLoading.value = true
      const response = await this.api.post('candidates', formData)
      candidateData = response.data
      isCandidateLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
    return new CandidateModel(candidateData as TCandidate)
  }

  static async remove(candidate: CandidateModel) {
    try {
      isCandidateLoading.value = true
      await this.api.delete(`candidates/${candidate.id}`)
      isCandidateLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
  }
}
