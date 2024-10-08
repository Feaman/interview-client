import { currentLanguage } from '~/composables'
import translations from '~/translations.json'

export default class TranslateService {
  static translate(text: string, language: string) {
    const currentLanguageTranslations = (translations as {[key: string]: {[key: string]: string}})[language]
    if (currentLanguageTranslations) {
      return currentLanguageTranslations[text] || text
    }
    return text
  }
}

export const t = (text: string) => TranslateService.translate(text, currentLanguage.value.value)
