import { RouteRecordRaw } from 'vue-router'
import MainLayoutComponent from '~/layouts/MainLayout.vue'
import CandidatePage from '~/pages/CandidatePage.vue'
import ImagePage from '~/pages/ImagePage.vue'
import IndexPage from '~/pages/IndexPage.vue'
import SignPage from '~/pages/SignPage.vue'
import TemplatePage from '~/pages/TemplatePage.vue'
import TemplatesPage from '~/pages/TemplatesPage.vue'

export const ROUTE_INDEX = 'index'
export const ROUTE_SIGN = 'sign'
export const ROUTE_CANDIDATE = 'candidate-id'
export const ROUTE_NEW_TEMPLATE = 'new-template'
export const ROUTE_UPDATE_TEMPLATE = 'update-template'
export const ROUTE_TEMPLATES = 'templates'
export const ROUTE_IMAGE = 'image'
export const ROUTE_NOT_FOUND = 'not-found'

const routes: RouteRecordRaw[] = [
  {
    path: '/image/:imageName',
    component: MainLayoutComponent,
    children: [{
      path: '',
      name: ROUTE_IMAGE,
      component: ImagePage,
    }],
  },
  {
    path: '/',
    component: MainLayoutComponent,
    children: [{
      path: '',
      name: ROUTE_INDEX,
      component: IndexPage,
    }],
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
      component: CandidatePage,
    }],
  },
  {
    path: '/templates',
    component: MainLayoutComponent,
    children: [{
      path: '',
      name: ROUTE_TEMPLATES,
      component: TemplatesPage,
    }],
  },
  {
    path: '/template/new',
    component: MainLayoutComponent,
    children: [{
      path: '',
      name: ROUTE_NEW_TEMPLATE,
      component: TemplatePage,
    }],
  },
  {
    path: '/template/:id',
    component: MainLayoutComponent,
    children: [{
      path: '',
      name: ROUTE_UPDATE_TEMPLATE,
      component: TemplatePage,
    }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: ROUTE_NOT_FOUND,
    component: () => import('~/pages/ErrorNotFound.vue'),
  },
]

export default routes
