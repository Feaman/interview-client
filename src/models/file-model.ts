export type TFile = {
  id: number
  name: string
  extension: string
  size: string
  path: string
}

export default class FileModel {
  id: number

  name: string

  extension: string

  size: string

  path: string

  constructor(data: TFile) {
    this.id = data.id
    this.name = data.name || ''
    this.extension = data.extension || ''
    this.size = data.size || ''
    this.path = data.path || ''
  }
}
