import { files, isFileLoading } from '~/composables'
import FileModel from '~/models/file-model'
import BaseService, { TGlobalError } from '~/services/base-service'

export default class FileService extends BaseService {
  static async save(file: FileModel, fileObject?: File) {
    try {
      isFileLoading.value = true
      let response
      const formData = new FormData()
      if (fileObject) {
        formData.append('file', fileObject)
      }
      formData.append('name', file.name)
      if (file.id) {
        response = await this.api.put(`files/${file.id}`, formData)
        Object.assign(file, response.data)
      } else {
        response = await this.api.post('files', formData)
        files.value.push(new FileModel(response.data))
      }
      isFileLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
  }

  static async remove(file: FileModel) {
    try {
      isFileLoading.value = true
      await this.api.delete(`files/${file.id}`)
      files.value = files.value.filter((_file) => _file.id !== file.id)
      isFileLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
  }
}
