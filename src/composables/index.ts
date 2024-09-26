import { ref } from 'vue'
import CandidateModel from '~/models/candidate-model'
import UserModel from '~/models/user-model'
import { type TGlobalError } from '~/services/base-service'

export const globalError = ref<TGlobalError | undefined>(undefined)
export const isConfigLoading = ref(false)
export const isMobile = ref(window.innerWidth < 768)
export const isCandidateLoading = ref(false)
export const candidates = ref([] as CandidateModel[])
export const currentCandidate = ref<CandidateModel | undefined>(undefined)
export const user = ref<undefined | UserModel>(undefined)
