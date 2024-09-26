import QuestionModel, { IQuestion } from '~/models/question-model'
import BaseService from '~/services/base-service'

export type TCandidate = {
  id: number
  name: string
  photoPath: string
  data: string
  created: string
}

export default class CandidateModel {
  id: number

  name: string

  photoPath: string

  data: string

  created: string

  questions: IQuestion[]

  static rules = {
    id: 'string',
    name: 'string',
    data: 'string',
    created: 'string',
  }

  constructor(data: TCandidate) {
    this.id = data.id
    this.name = data.name || ''
    this.data = data.data || ''
    this.photoPath = data.photoPath ? `${BaseService.baseURL}/${data.photoPath}` : ''
    this.created = data.created || ''
    this.questions = []
    this.handleQuestions(data.data)
  }

  handleQuestions(json: string) {
    try {
      const data: IQuestion[] = JSON.parse(json)
      this.questions = (data || []).map((questionData) => new QuestionModel(questionData))
    } catch (error) {
      throw Error('JSON parsing error')
    }
  }

  getInitials() {
    const nameParts = this.name.split(' ')
    return `${nameParts[0].charAt(0).toUpperCase()}${nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : ''}`
  }
}
