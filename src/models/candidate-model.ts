import QuestionModel, { IQuestion } from '~/models/question-model'
import BaseService from '~/services/base-service'

export type TCandidate = {
  id: number
  firstName: string
  secondName: string
  photoPath: string
  data: string
  created: string
}

export default class CandidateModel {
  id: number

  firstName: string

  secondName: string

  photoPath: string

  data: string

  created: string

  questions: IQuestion[]

  constructor(data: TCandidate) {
    this.id = data.id
    this.firstName = data.firstName || ''
    this.secondName = data.secondName || ''
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
    return `${this.firstName.charAt(0).toUpperCase()}${this.secondName ? this.secondName.charAt(0).toUpperCase() : ''}`
  }

  getFio() {
    return `${this.firstName}${this.secondName ? ` ${this.secondName}` : ''}`
  }
}
