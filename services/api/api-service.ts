import { ConfigObject } from '../users-service'
import FetchService from '@/services/api/fetch-service'
import CandidateModel, { ICandidate } from '~~/models/candidate-model'

export default class ApiService extends FetchService {
  login (email: string, password: string): Promise<ConfigObject> {
    return this.post('login', { email, password })
  }

  register (email: string, password: string, firstName: string, secondName: string): Promise<ConfigObject> {
    return this.post('users', { email, password, firstName, secondName })
  }

  getConfig (): Promise<ConfigObject> {
    return this.get('config')
  }

  createCandidate (name: string, data: string): Promise<ICandidate> {
    return this.post('candidates', { name, data })
      .then((candidateData: ICandidate) => candidateData)
  }

  updateCandidate (candidate: CandidateModel): Promise<ICandidate> {
    candidate.data = JSON.stringify(candidate.questions)
    return this.put(`candidates/${candidate.id}`, candidate)
      .then((candidateData: ICandidate) => candidateData)
  }

  removeCandidate (candidate: CandidateModel) {
    return this.delete(`candidates/${candidate.id}`)
  }
}
