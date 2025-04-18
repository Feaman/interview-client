import BaseService from '~/services/base-service'

export type TFile = {
  id: number
  name: string
  originalName: string
  extension: string
  mimeType: string
  size: number
  sizeInMegabytes?: number
  sizeInBytes?: number
  path: string
  fullPath?: string
}

export default class FileModel {
  id: number

  name: string

  originalName: string

  mimeType: string

  extension: string

  size: number

  sizeInMegabytes: number

  sizeInBytes: number

  path: string

  fullPath: string

  constructor(data: TFile) {
    this.id = data.id
    this.name = data.name || ''
    this.originalName = data.originalName || ''
    this.extension = data.extension || ''
    this.mimeType = data.mimeType || ''
    this.size = data.size
    this.sizeInMegabytes = Math.round((this.size / 1024 / 1024 + Number.EPSILON) * 100) / 100
    this.sizeInBytes = Math.round((this.size / 1024 + Number.EPSILON) * 100) / 100
    this.path = data.path || ''
    this.fullPath = `${BaseService.baseURL}/${this.path}`
  }

  getLink() {
    return `/files/${this.id}`
  }
}
