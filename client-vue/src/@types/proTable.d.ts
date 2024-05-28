import type { ElTableColumn } from 'element-plus'
import { ElDatePicker, ElForm, ElInput, ElSelect } from 'element-plus'

import ProTable, { IProTableProps as ProTableProps } from '@/components/proTable/index.vue'

type Value = string | number | null | any[]

/**
 * 处理数据
 * 如 options.type=='daterange'   value ===>['2024-05-10', '2024-06-20']
 * 处理成 ==> {startTime:'2024-05-10', endTime:'2024-06-20'}
 */
type IFormateValue = (value: Value, form?: Record<string, Value>) => any

// 定义表单项类型
type IInput = {
  type: 'input'
  label: string
  value: Value
  props?: InstanceType<typeof ElInput>['$props']
  formateValue?: IFormateValue
  placeholder?: string
}

type ISelect = {
  type: 'select'
  label: string
  value: Value
  options: { label: string; value: any }[]
  props?: InstanceType<typeof ElSelect>['$props']
  formateValue?: IFormateValue
  placeholder?: string
}

type IDate = {
  /**
   * 日期选择 YYYY-MM-DD
   * 如: 2024-05-23
   */
  type: 'date'
  label: string
  value: Value
  props?: InstanceType<typeof ElDatePicker>['$props']
  formateValue?: IFormateValue
  placeholder?: string
}

type IProTableColumn = InstanceType<typeof ElTableColumn>['$props'] & {
  /**
   * uuid
   */
  uuid?: string
  /**
   * 类型
   */
  type?: 'default' | 'selection' | 'index' | 'expand'
  /**
   * 自定义渲染方法
   * @param props
   * @returns
   */
  render?: (props: ITableColumnDefaultSlotProps) => string | number | null | undefined
  /**
   * 是否使用插槽
   */
  useSlot?: boolean
  /**
   * 是否添加复制图标  内容是否可复制
   */
  useCopy?: boolean
  /**
   * 是否显示column
   */
  showColumn?: boolean
}

declare global {
  type ITableColumnDefaultSlotProps = {
    row: Record<string, any>
    $index: number
    store?: Record<string, any>
    expanded?: boolean
  }
  type IProTable = InstanceType<typeof ProTable>
  type IProTableSearchFormSize = InstanceType<typeof ElForm>['$props']['size']
  /**
   * columns 示例
   *  ``` js
   * const columns = reactive<IProTableColumns>({
   *  name: { type: 'input', label: '名称', value: null },
   *  remark: { type: 'input', label: '备注', value: null },
   *  select: {
   *    type: 'select',
   *    label: '选择',
   *    value: null,
   *    options: [
   *      {
   *        label: '1',
   *        value: 1,
   *      },
   *      {
   *        label: '2',
   *        value: 2,
   *      },
   *    ],
   *  },
   *  date: {
   *    type: 'date',
   *    label: '日期',
   *    props: {
   *      type: 'daterange',
   *    },
   *    value: [],
   *    formateValue: (value, form) => {
   *      form.startTime = value[0]
   *      form.endTime = value[1]
   *    },
   *  },
   * })
   * ```
   */
  type IProTableColumns = IProTableColumn[]

  /**
   * IProTableSearchForm 示例
   *  ``` js
   * const searchForm = reactive<IProTableSearchForm>({
   *  name: { type: 'input', label: '名称', value: null },
   *  remark: { type: 'input', label: '备注', value: null },
   *  select: {
   *    type: 'select',
   *    label: '选择',
   *    value: null,
   *    options: [
   *      {
   *        label: '1',
   *        value: 1,
   *      },
   *      {
   *        label: '2',
   *        value: 2,
   *      },
   *    ],
   *  },
   *  date: {
   *    type: 'date',
   *    label: '日期',
   *    props: {
   *      type: 'daterange',
   *    },
   *    value: [],
   *    formateValue: (value, form) => {
   *      form.startTime = value[0]
   *      form.endTime = value[1]
   *    },
   *  },
   * })
   * ```
   */
  interface IProTableSearchForm {
    [prop: string]: IInput | ISelect | IDate
  }

  type IProTableApi = {
    /**
     * 获取列表 api
     */
    list?: string
    /**
     * 创建/新增 api
     */
    create?: string
    /**
     * 修改/更新 api
     */
    update?: string
    /**
     * 删除列表 api
     */
    delete?: string
  }

  type IProTableProps = ProTableProps
}

export {}
