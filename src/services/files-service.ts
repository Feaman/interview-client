import { files, isFileLoading } from '~/composables'
import FileModel from '~/models/file-model'
import BaseService, { TGlobalError } from '~/services/base-service'

export default class FileService extends BaseService {
  static async save(file: FileModel) {
    isFileLoading.value = true
    let response
    const fileData = {
      name: file.name,
      extension: file.extension,
      size: file.size,
      path: file.path,
    }
    if (file.id) {
      response = await this.api.put(`files/${file.id}`, fileData)
      file = new FileModel(response.data)
    } else {
      response = await this.api.post('files', fileData)
      files.value.push(new FileModel(response.data))
    }
    isFileLoading.value = false
  }

  static async remove(file: FileModel) {
    try {
      isFileLoading.value = true
      await this.api.delete(`files/${file.id}`)
      isFileLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
  }
}
