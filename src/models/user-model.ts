import BaseService from '~/services/base-service'

export type TUser = {
  id?: number,
  firstName: string,
  secondName: string,
  photoPath: string,
  email: string,
}

export default class UserModel {
  id?: number

  firstName: string

  secondName: string

  email: string

  photoPath: string

  constructor(data: TUser) {
    this.id = data.id
    this.firstName = data.firstName
    this.secondName = data.secondName
    this.email = data.email
    this.photoPath = data.photoPath ? `${BaseService.baseURL}/${data.photoPath}` : ''
  }

  getFio() {
    return `${this.secondName} ${this.firstName}`
  }

  getInitials() {
    return `${this.secondName.charAt(0).toUpperCase()}${this.firstName.charAt(0).toUpperCase()}`
  }
}
