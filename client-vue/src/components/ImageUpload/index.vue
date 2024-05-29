<!--
 * @Description: 
 * @Author: HYH
 * @LastEditors: HYH
 * @LastEditTime: 2023-07-13 16:04:52
-->

<template>
  <div class="w-full flex flex-wrap">
    <div>waitUploadList{{ state.waitUploadList }}</div>
    <div>fileList{{ fileList }}</div>
    <!-- :on-success="handleSuccess" -->
    <el-upload
      :auto-upload="false"
      :on-remove="handleRemove"
      :on-preview="(f) => viewImg({ url: f.url })"
      :on-change="handleChange"
      :http-request="httpRequest"
      v-model:file-list="fileList"
      accept="image/*"
      list-type="picture-card"
      multiple
    >
      <el-icon size="35"><Plus /></el-icon>
      <div slot="list" class="el-upload-list">
        <div
          v-for="file in fileList"
          :key="file.uid"
          class="el-upload-file"
          :class="{
            'el-upload-file--error': file.status === 'fail',
          }"
        >
          {{ file.name }}
          <div v-if="file.status === 'fail'" class="el-upload-file__error">上传失败</div>
        </div>
      </div>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import { IResponse, http } from '@/http'
import { uploadActions } from '@/http/axios'
import { Plus } from '@element-plus/icons-vue'
import { ElUpload, ElLoading } from 'element-plus'
import viewImg from '../ViewImg'

type ElUploadProps = InstanceType<typeof ElUpload>['$props']

type Resonse = IResponse<string>

type IEmit = {
  (e: 'success', url: string)
  (e: 'remove', v: any)
  (e: 'update:modelValue', v: any)
}

const emit = defineEmits<IEmit>()

const fileList = ref<ElUploadProps['fileList']>([])

interface IProps {
  /**上传地址 */
  action?: ElUploadProps['action']
  /**limit */
  limit?: number
  /**
   * v-model 绑定的值所转换的类型
   * ```javascript
   *   string  ==> img:'http://localhost:2333/static/upload/images/1716967083817.png,'
   *   array  ==> ['http://localhost:2333/static/upload/images/1716967083817.png']
   * ```
   */
  formatType?: 'string' | 'array'
}
const props = withDefaults(defineProps<IProps>(), {
  action: uploadActions.singleImage,
  limit: 1,
  formatType: 'string',
})

const handleRemove: ElUploadProps['onRemove'] = (deleteFile, fileList) => {
  const modelValue = []
  fileList.map((file) => {
    const url = file.url.startsWith('http') ? file.url : (file.response as Resonse)?.data
    modelValue.push(url)
  })
  emit('update:modelValue', props.formatType == 'string' ? modelValue.toString() : modelValue)
}

const handleSuccess: ElUploadProps['onSuccess'] = () => {
  const modelValue = []
  fileList.value.map((file) => {
    const url = file.url.startsWith('http') ? file.url : (file.response as Resonse)?.data
    modelValue.push(url)
  })
  emit('update:modelValue', props.formatType == 'string' ? modelValue.toString() : modelValue)
}

const state = reactive({
  /**是否正在上传 */
  uploadFlag: false,
  /**等待上传的图片 */
  waitUploadList: [],
})

/**上传单个文件 */
const uploadSingleFile = () => {
  if (!state.waitUploadList.length) {
    const modelValue = []
    fileList.value.map((file) => {
      const url = file.url.startsWith('http') ? file.url : (file.response as Resonse)?.data
      modelValue.push(url)
    })
    emit('update:modelValue', props.formatType == 'string' ? modelValue.toString() : modelValue)
    return
  }

  const formData = new FormData()
  const file = state.waitUploadList.shift()
  formData.append('file', file.raw)

  http.upload(props.action, formData).then((response) => {
    console.log(`response ==>`, response)
    const index = fileList.value.findIndex((item) => item.uid === file.uid)
    if (!Object.entries(response).length) {
      fileList.value[index].response = {}
      fileList.value[index].status = 'fail'
    } else {
      fileList.value[index].response = response
      fileList.value[index].status = 'success'
    }
    uploadSingleFile()
  })
}

const handleChange: ElUploadProps['onChange'] = async (file) => {
  if (state.uploadFlag) {
    return state.waitUploadList.push(file)
  }
  state.uploadFlag = true
  state.waitUploadList = [file]
  uploadSingleFile()
}

const httpRequest: ElUploadProps['httpRequest'] = async (file) => {
  const formData = new FormData()
  formData.append('file', file.file)
  return await http.upload(props.action, formData)
}
</script>
<style lang="scss" scoped>
.el-upload-file--error {
  color: #f56c6c; /* 失败文件名称的颜色 */
}

.el-upload-file__error {
  color: #f56c6c; /* 错误提示的文本颜色 */
  font-size: 12px; /* 错误提示的文本大小 */
}
</style>
