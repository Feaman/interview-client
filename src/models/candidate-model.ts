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

  questions: QuestionModel[]

  constructor(data: TCandidate) {
    this.id = data.id
    this.firstName = data.firstName || ''
    this.secondName = data.secondName || ''
    this.data = data.data || ''
    this.photoPath = data.photoPath ? `${BaseService.baseURL}/${data.photoPath}` : ''
    this.created = data.created || ''
    this.questions = []
    this.handleQuestions()
  }

  handleQuestions() {
    try {
      const data: IQuestion[] = JSON.parse(this.data)
      this.questions = (data || []).map((questionData) => new QuestionModel(questionData))
    } catch (error) {
      throw Error('JSON parsing error')
    }
  }

  getInitials() {
    return `${this.firstName.charAt(0).toUpperCase()}${this.secondName ? this.secondName.charAt(0).toUpperCase() : ''}`
  }

  getFio(searchQuery = '') {
    let firstName = this.firstName.replace(/[^\p{Letter}\p{Mark}\s]/gu, '')
    let secondName = this.secondName.replace(/[^\p{Letter}\p{Mark}\s]/gu, '')
    let fio
    if (searchQuery) {
      const regEx = new RegExp(searchQuery, 'ig')
      if (searchQuery.split(' ').length > 1) {
        fio = `${firstName}${secondName ? ` ${secondName}` : ''}`
        fio = fio.replace(regEx, '<span class="highlight">$&</span>')
      } else {
        firstName = firstName.replace(regEx, '<span class="highlight">$&</span>')
        if (secondName) {
          secondName = secondName.replace(regEx, '<span class="highlight">$&</span>')
        }
      }
    }
    return fio || `${firstName}${secondName ? ` ${secondName}` : ''}`
  }
}
