import { RouteRecordRaw } from 'vue-router'
import MainLayoutComponent from '~/layouts/MainLayout.vue'
import SignPage from '~/pages/SignPage.vue'

export const ROUTE_SIGN = 'sign'
export const ROUTE_CANDIDATE = 'candidate-id'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayoutComponent,
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/sign',
    component: MainLayoutComponent,
    children: [{
      path: '',
      name: ROUTE_SIGN,
      component: SignPage,
    }],
  },
  {
    path: '/candidate/:id',
    component: MainLayoutComponent,
    children: [{
      path: '',
      name: ROUTE_CANDIDATE,
      component: () => import('pages/CandidatePage.vue'),
    }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('~/pages/ErrorNotFound.vue'),
  },
]

export default routes
