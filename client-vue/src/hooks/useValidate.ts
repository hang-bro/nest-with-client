import { FormItemRule } from 'element-plus'
import Joi from 'joi'

const validators = {
  /**请输入 数据不能为空 */
  pleaseInput: Joi.alternatives().try(Joi.string(), Joi.number()).error(new Error('请输入')),

  /**密码 密码长度应在6~20*/
  password: Joi.string().min(6).max(20).error(new Error('密码长度应在6~20')),

  /**邮箱 */
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .error(new Error('邮箱不符合规范')),
}

type RuleCallback = Parameters<FormItemRule['asyncValidator']>['2']

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
   * 自定义校验法
   * @param value 输入的值
   * @param cb 错误信息回调
   * @example
   * ```javascript
   *   check: async (email, cb) => {
   *     const { data } = await http.get('/user/emailExist', { email }, { animate: false })
   *     data ? cb('邮箱已存在') : cb()
   *   }
   * ```
   * @example
   * ```
   * check: (email, cb) =>
        http
          .get('/user/emailExist', { email }, { animate: false })
          .then(({ data }) => {
            data ? cb('邮箱已存在') : cb()
          }),
   * ```
   * @returns
   */
  check?: <T extends any = string>(value: T, cb: RuleCallback) => Promise<void>
}

type ICallback = (args: { joi: typeof Joi; validators: typeof validators }) => any

let timer: any = null

function debounce(cb: Function, delay = 1000) {
  return new Promise<any>((resolve) => {
    if (timer) {
      clearInterval(timer)
    }
    timer = setTimeout(() => resolve(cb()), delay)
  })
}

export const defineValidator = (callback: ICallback, params: IParams = {}) => {
  let { trigger = ['blur', 'change'], required = true, check } = params

  return [
    {
      asyncValidator: async (_rule: any, value: any, cb: RuleCallback) => {
        const { error } = callback({ joi: Joi, validators }).validate(value)

        if (error) return cb(new Error(error.message))

        if (check) {
          return debounce(() => check(value, cb))
        }

        return cb()
      },
      required,
      trigger,
    },
  ] as FormItemRule
}

/**表单校验规则 */
const useValidate = {
  /**
   * 请输入
   */
  pleaseInput: defineValidator(() => validators.pleaseInput),
  /**
   * 请选择
   */
  pleaseSelect: [{ required: true, trigger: 'blur', message: '请选择' }],
  /**
   * 密码  (6~20)
   */
  password: defineValidator(() => validators.password),
  /**
   * 邮箱
   */
  email: defineValidator(() => validators.email),
}

export default useValidate
