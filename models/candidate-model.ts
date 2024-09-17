import QuestionModel, { IQuestion } from '~/models/question-model'

export interface ICandidate {
  id: string
  name: string
  data: string
  created: string
}

export default class CandidateModel {
  id: string
  name: string
  data: string
  created: string
  questions: IQuestion[]

  static rules = {
    id: 'string',
    name: 'string',
    data: 'string',
    created: 'string',
  }

  constructor (data: ICandidate) {
    this.id = data.id
    this.name = data.name || ''
    this.data = data.data || ''
    this.created = `${new Date(data.created).toLocaleDateString()} ${new Date(data.created).toLocaleTimeString()}` || ''
    this.handleQuestions(data.data)
  }

  handleQuestions (data) {
    try {
      data = JSON.parse(data)
      this.questions = (data || []).map(questionData => new QuestionModel(questionData))
    } catch (error) {
      throw createError('JSON parsing error')
    }
  }
}
