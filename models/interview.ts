import QuestionModel, { IQuestion } from "./question"

export interface IInterview {
  id: string
  title: string
  questions: IQuestion[]
}

export default class InterviewModel {
  id: string
  title: string
  questions?: QuestionModel[]

  static rules = {
    id: 'string',
    title: 'string',
  }

  constructor (data: IInterview) {
    this.id = data.id
    this.title = data.title || ''
    this.questions = (data.questions || []).map(questionData => new QuestionModel(questionData))
  }
}
