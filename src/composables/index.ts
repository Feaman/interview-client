import { ref } from 'vue'
import CandidateModel from '~/models/candidate-model'
import TemplateModel from '~/models/template-model'
import UserModel from '~/models/user-model'
import { type TGlobalError } from '~/services/base-service'

export const LANGUAGES = [
  { label: 'Русский', value: 'ru' },
  { label: 'English', value: 'en' },
]

export const globalError = ref<TGlobalError | undefined>(undefined)
export const isConfigLoading = ref(false)
export const isReportGenerating = ref(false)
export const isConfigLoaded = ref(false)
export const isMobile = ref(window.innerWidth < 768)
export const isCandidateLoading = ref(false)
export const isTemplateLoading = ref(false)
export const candidates = ref([] as CandidateModel[])
export const templates = ref([] as TemplateModel[])
export const currentCandidate = ref<CandidateModel | undefined>(undefined)
export const currentLanguage = ref(LANGUAGES[0])
export const user = ref<undefined | UserModel>(undefined)
