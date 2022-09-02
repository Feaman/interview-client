import BaseService from "./base"
import InterviewModel, { IInterview } from "~~/models/interview"

export default class InterviewService extends BaseService {
  static async getList () {
    const listData = (await BaseService.storage.get('list')) || []
    return listData.map(interviewData => new InterviewModel(interviewData))
  }

  static async save (interview: InterviewModel) {
    const listData = (await BaseService.storage.get('list')) || []
    const existedInterviewIndex = listData.findIndex(interviewData => interviewData.id === interview.id)
    if (existedInterviewIndex === -1) {
      throw new Error(`Interview ${interview.id} not found.`)
    }
    listData[existedInterviewIndex] = interview
    await BaseService.storage.set({ list: listData })
  }

  static async add (interviewData: InterviewModel) {
    const listData = (await BaseService.storage.get('list')) || []
    listData.push(interviewData)
    await BaseService.storage.set({ list: listData })
  }
}
