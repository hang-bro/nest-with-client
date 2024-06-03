import { loading } from '@/components/loading'
import axios, { AxiosError, AxiosResponse } from 'axios'
import 'nprogress/nprogress.css'

import userStore from '@/store/user'
import router from '@/router'
import { IRequestConfig } from '..'
const baseURL = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_BASE_API
const instance = axios.create({
  baseURL, //跨域问题  后端没解决这里要打开  vite.configt.ts 要去设置server proxy
  timeout: 300000, //设置超时
  responseType: 'json',
  withCredentials: true,
  headers: {
    ['Content-type']: 'application/json',
  },
})

/**
 * 上传对应的 actions
 */
export const uploadActions = {
  /**
   * 上传单个图片
   */
  singleImage: baseURL + '/upload',
}

const start = async (config: IRequestConfig) => {
  if (config.animate === false) return
  const { open } = await loading()
  // NProgress.start()
  await open()
}

const end = async () => {
  const { close } = await loading()
  // NProgress.done()
  close()
}

//设置请求拦截器
instance.interceptors.request.use(
  async (config) => {
    config.headers['authorization'] = userStore().token
    await start(config)
    return config
  },
  async (error) => {
    await end()
    return Promise.reject(error)
  },
)

//设置响应拦截器
instance.interceptors.response.use(
  async (res) => {
    await end()
    const { code, message } = res.data
    if (code && code !== 200) {
      ElNotification.warning(message)
    }

    return { data: res.data } as AxiosResponse
  },
  async (e: AxiosError) => {
    // console.log(e)

    await end()
    // 判断是否服务器端返回的错误
    if (e.response?.data) {
      const { message, statusCode, error } = e.response?.data as IServerError

      const toHtml = (arr: string[]) => {
        let html = `<div>`
        arr.map((m) => {
          html += `<div>${m}</div>`
        })
        html += '</div>'
        return html
      }
      ElNotification.error({
        title: error,
        dangerouslyUseHTMLString: true,
        message: Array.isArray(message) ? toHtml(message) : message,
      })
      userStore().lastVisitPath = router.currentRoute.value.path as string
      switch (statusCode) {
        case 401: //未认证 token失效
          router.push({ path: '/login', replace: true })
          break
        default:
          break
      }
    } else {
      ElNotification.error({ message: e.message })
    }

    return Promise.reject(new Error(e.message))
  },
)

export default instance

interface IServerError {
  message: string | string[]
  error: string
  statusCode: number
}
