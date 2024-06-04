import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/layout',
  },
  {
    path: '/layout',
    name: 'layout',
    redirect: '/layout/dashboard',
    component: () => import('@/layout/index.vue'),
    children: [
      // {
      //   path: 'dashboard',
      //   name: 'dashboard',
      //   component: () => import('@/views/dashboard/index.vue'),
      //   meta: {
      //     title: 'dashboard',
      //   },
      // },
    ],
  },
  /***************************   独立页面   *****************************/
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('@/views/welcome/index.vue'),
    meta: {
      title: '欢迎',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      spa: true,
      title: 'login',
    },
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: () => import('@/views/login/forgetPassword.vue'),
    meta: {
      spa: true,
      title: '重置密码',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/register.vue'),
    meta: {
      spa: true,
      title: '注册',
    },
  },

  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      spa: true,
      title: '404',
    },
  },
  /*************************** 独立页面 end *****************************/
]
