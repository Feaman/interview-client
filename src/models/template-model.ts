import QuestionModel, { IQuestion } from './question-model'

export type TTemplate = {
  id: number
  title: string
  data: string
  isDefault?: boolean
  created?: string
  updated?: string
}

export default class TemplateModel {
  id: number

  title: string

  data: string

  isDefault = false

  created: string

  updated: string

  questions: IQuestion[]

  constructor(data: TTemplate) {
    this.id = data.id
    this.title = data.title || ''
    this.created = data.created || ''
    this.data = data.data || ''
    this.isDefault = !!data.isDefault || false
    this.updated = data.updated || ''
    this.questions = []

    this.handleData()
  }

  handleData() {
    if (!this.data) {
      throw new Error('No data found')
    }

    try {
      const questions: IQuestion[] = JSON.parse(this.data)
      this.questions = (questions || []).map((questionData) => new QuestionModel(questionData))
    } catch (error) {
      throw Error('JSON parsing error')
    }
  }
}
