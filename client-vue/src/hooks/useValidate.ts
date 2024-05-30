import { FormItemRule } from 'element-plus'
import Joi from 'joi'

type IParams = {
  /**
   * 触发方式
   */
  trigger?: 'blur' | 'change' | ['blur', 'change']
  /**
   * 是否必填
   */
  required?: boolean
  /**
   * 远程验证方法
   */
  remoteFn?: (value: any) => Promise<{ error?: string }>
}

type ICallback = (joi: typeof Joi) => any

let timer: any = null

function debouce(cb: Function) {
  return new Promise<{ error?: string }>((resolve, reject) => {
    if (timer) {
      clearInterval(timer)
    }
    timer = setTimeout(async () => {
      resolve(await cb())
    }, 1000)
  })
}

export const defineValidator = (callback: ICallback, params: IParams = {}) => {
  const { trigger = ['blur', 'change'], required = true, remoteFn } = params

  return [
    {
      validator: async (_rule: any, value: any, cb: Function) => {
        const { error } = callback(Joi).validate(value)

        if (error) return cb(new Error(error.message))

        if (remoteFn) {
          const { error } = await debouce(() => remoteFn(value))
          if (!error) return cb()
          else {
            return cb(new Error(error))
          }
        }

        return cb()
      },
      required,
      trigger,
    },
  ] as FormItemRule
}

const pleaseInput = Joi.alternatives().try(Joi.string(), Joi.number()).error(new Error('请输入'))

const password = Joi.string().min(6).max(20).error(new Error('密码长度应在6~20'))

const email = Joi.string()
  .email({ tlds: { allow: false } })
  .error(new Error('邮箱不符合规范'))

/**表单校验规则 */
const useValidate = {
  /**
   * 请输入
   */
  pleaseInput: defineValidator(() => pleaseInput),
  /**
   * 请选择
   */
  pleaseSelect: [{ required: true, trigger: 'blur', message: '请选择' }],
  /**
   * 密码  (6~20)
   */
  password: defineValidator(() => password),
  /**
   * 邮箱
   */
  email: defineValidator(() => email),
}

export default useValidate
