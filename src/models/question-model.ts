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

  // eslint-disable-next-line no-use-before-define
  items: QuestionModel[]

  status: string

  taskLinks: { title: string, url: string }[]

  taskText: string

  static STATUS_SUPER = 'STATUS_SUPER'

  static STATUS_NOT_GOOD = 'STATUS_NOT_GOOD'

  static STATUS_BAD = 'STATUS_BAD'

  constructor(data: IQuestion) {
    this.id = data.id
    this.title = data.title || ''
    this.comment = data.comment || ''
    this.status = data.status || ''
    this.taskText = data.taskText || ''
    this.taskLinks = data.taskLinks || []
    this.items = []
    this.handleItems(data.items)
  }

  handleItems(items: IQuestion[]) {
    this.items = items?.map((questionData: IQuestion) => new QuestionModel(questionData)) || []
  }

  getColorClass() {
    switch (this.status) {
      case QuestionModel.STATUS_SUPER:
        return 'green'
      case QuestionModel.STATUS_NOT_GOOD:
        return 'orange'
      case QuestionModel.STATUS_BAD:
        return 'red'
      default:
        return 'grey-darken-3'
    }
  }
}
