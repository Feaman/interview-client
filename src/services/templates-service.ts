import { isTemplateLoading, templates } from '~/composables'
import TemplateModel from '~/models/template-model'
import BaseService, { TGlobalError } from '~/services/base-service'

export default class TemplateService extends BaseService {
  static async save(template: TemplateModel) {
    isTemplateLoading.value = true
    let response
    const templateData = {
      title: template.title,
      data: template.data,
      isDefault: template.isDefault,
    }
    if (template.id) {
      response = await this.api.put(`templates/${template.id}`, templateData)
      template = new TemplateModel(response.data)
    } else {
      response = await this.api.post('templates', templateData)
      templates.value.push(new TemplateModel(response.data))
    }
    isTemplateLoading.value = false
  }

  static async remove(template: TemplateModel) {
    try {
      isTemplateLoading.value = true
      await this.api.delete(`templates/${template.id}`)
      isTemplateLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
  }
}
