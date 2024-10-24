export default class StringHelper {
  static checkForLettersAndSpaces(string: string) {
    return /^[\p{Letter}\p{Mark}\s]+$/gu.test(string)
  }
}
