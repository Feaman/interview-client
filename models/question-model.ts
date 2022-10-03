export interface IQuestion {
  id: number
  title: string
  comment?: string
  items: IQuestion[]
  status?: string
  taskLinks?: { title: string, url: string }[]
  taskText?: string
}

export default class QuestionModel {
  id: number
  title: string
  comment: string
  items: QuestionModel[]
  status: string
  taskLinks: { title: string, url: string }[]
  taskText: string

  static STATUS_SUPER = 'STATUS_SUPER'
  static STATUS_NOT_GOOD = 'STATUS_NOT_GOOD'
  static STATUS_BAD = 'STATUS_BAD'

  static rules = {
    id: 'numeric',
    title: 'string',
    comment: 'string',
    status: 'string'
  }

  constructor (data: IQuestion) {
    this.id = data.id
    this.title = data.title || ''
    this.comment = data.comment || ''
    this.status = data.status || ''
    this.taskText = data.taskText || ''
    this.taskLinks = data.taskLinks || []
    this.handleItems(data.items)
  }

  handleItems (items) {
    this.items = items?.map((questionData: IQuestion) => new QuestionModel(questionData)) || []
  }

  getColorClass () {
    switch (this.status) {
      case QuestionModel.STATUS_SUPER:
        return 'text-green'
      case QuestionModel.STATUS_NOT_GOOD:
        return 'text-orange'
      case QuestionModel.STATUS_BAD:
        return 'text-red'
    }

    return 'text-grey-darken-3'
  }
}
