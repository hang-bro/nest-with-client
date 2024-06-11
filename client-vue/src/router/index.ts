/*
 * @Description:
 * @Author: HYH
 * @LastEditors: HYH
 * @LastEditTime: 2023-07-17 15:28:41
 */
// 导入router所需的方法
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

import { routes } from './routes'

function autoGenerateRouted(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const modules = import.meta.glob('../views/**/index.{vue,tsx,jsx}')

  /**判断是否独立页面 */
  const spas = routes.filter((route) => route.meta?.spa).map((i) => i.name)

  const targetRoutes: RouteRecordRaw[] = []

  // 循环进入路由
  for (let key in modules) {
    const name = key.split('../views/').pop().split('/')[0]
    const ext = key.split('.').pop()
    if (!spas.includes(name)) {
      const route = {
        path: `${name}`,
        name: name,
        component: () => import(`@/views/${name}/index.${ext}`),
      }
      targetRoutes.push(route)
    }
  }

  const index = routes.findIndex((r) => r.name == 'layout')
  routes[index].children = targetRoutes
  return routes
}

export const $routes = autoGenerateRouted(routes)

// 路由参数配置
const router = createRouter({
  // 使用hash(createWebHashHistory)模式，(createWebHistory是HTML5历史模式，支持SEO)
  history: createWebHashHistory(),
  routes: $routes,
  // routes: routes,
})

// 全局前置守卫，这里可以加入用户登录判断
router.beforeEach((to, from, next) => {
  // console.log(`to, from, ==>`,to, from,);
  next()
})

// 全局后置钩子，这里可以加入改变页面标题等操作
router.afterEach((to, from) => {
  const title = to.meta.title as string
  if (title) {
    document.title = title
  } else {
    // document.title = 'doc'
  }
})

// 导出默认值
export default router
