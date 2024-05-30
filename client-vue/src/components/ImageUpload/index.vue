<template>
  <div class="my-upload" :style="{ '--show-upload': showUpload }">
    <!-- :on-success="handleSuccess" -->
    <!-- :http-request="httpRequest" -->
    <el-upload
      :auto-upload="false"
      :on-remove="handleRemove"
      :on-preview="(f) => viewImg({ url: f.url })"
      :on-change="handleChange"
      v-model:file-list="fileList"
      accept="image/*"
      list-type="picture-card"
      :multiple="multiple"
      :limit="multiple ? maxNum : limit"
    >
      <el-icon size="35"><Plus /></el-icon>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import { IResponse, http } from '@/http'
import { uploadActions } from '@/http/axios'
import { Plus } from '@element-plus/icons-vue'
import { ElUpload } from 'element-plus'
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
  /**做多上传数量 */
  maxNum?: number
  /**
   * v-model 绑定的值所转换的类型
   * ```javascript
   *   string  ==> img:'http://localhost:2333/static/upload/images/1716967083817.png,'
   *   array  ==> ['http://localhost:2333/static/upload/images/1716967083817.png']
   * ```
   */
  formatType?: 'string' | 'array'
  /**多选 */
  multiple?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  action: uploadActions.singleImage,
  limit: 1,
  maxNum: 15,
  formatType: 'string',
  multiple: false,
})

const showUpload = computed(() => {
  return fileList.value.length == props.limit ? 'none' : 'flex'
})
const attrs = useAttrs()

onMounted(() => {
  const modelValue = attrs.modelValue
  if (!modelValue || (modelValue as string).trim() == '') {
    fileList.value = []
    emit('update:modelValue', props.formatType == 'string' ? '' : [])
    return
  }
  const imgArr: string[] = modelValue?.toString()?.split(',') || []

  if (imgArr.length) {
    ;(fileList.value as { url: string }[]) = imgArr.map((url) => ({ url }))
  }
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
    // 正在上传状态改为false
    state.uploadFlag = false

    const modelValue = []

    fileList.value.map((file) => {
      const url = file.url.startsWith('http') ? file.url : (file.response as Resonse)?.data
      url && modelValue.push(url)
    })

    return (
      modelValue.length &&
      emit('update:modelValue', props.formatType == 'string' ? modelValue.toString() : modelValue)
    )
  }

  const formData = new FormData()

  const file = state.waitUploadList.shift()

  formData.append('file', file.raw)

  http.upload(props.action, formData).then((response) => {
    const index = fileList.value.findIndex((item) => item.uid === file.uid)

    if (!Object.keys(response).length) {
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
  // 如果正在上传中，直接添加到待上传列表中
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
<style lang="scss">
.my-upload {
  .el-upload-list {
    .el-upload--picture-card {
      display: var(--show-upload);
    }
  }
  .el-upload-list__item-thumbnail {
    object-fit: cover;
  }
  .is-fail {
    animation: dashedBorder 2s infinite linear;
    position: relative;
    @keyframes dashedBorder {
      0% {
        border: 2px dashed transparent;
      }
      50% {
        border: 2px dashed red;
      }
      100% {
        border: 2px dashed transparent;
      }
    }
    @keyframes bg {
      0% {
        background: red;
      }
      50% {
        background: black;
      }
      100% {
        background: red;
      }
    }
    // &::after {
    //   content: '';
    //   position: absolute;
    //   right: -23px;
    //   top: -18px;
    //   width: 70px;
    //   height: 39px;
    //   background: red;
    //   text-align: center;
    //   transform: rotate(45deg);
    //   animation: bg 2s infinite linear;
    // }
  }
}
</style>
