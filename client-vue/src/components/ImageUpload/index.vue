<template>
  <div class="my-upload" :style="{ '--show-upload': showUpload }">
    <!-- :on-success="handleSuccess" -->
    <!-- :http-request="httpRequest" -->
    <!-- :on-remove="handleRemove" -->
    <!-- :on-preview="(f) => viewImg({ url: f.url })" -->
    <el-upload
      :auto-upload="false"
      :on-change="handleChange"
      v-model:file-list="fileList"
      accept="image/*"
      list-type="picture-card"
      :multiple="multiple"
      :limit="multiple ? maxNum : limit"
    >
      <el-icon size="35"><Plus /></el-icon>
      <template #file="{ file }">
        <div class="file-wrapper">
          <el-progress
            type="circle"
            v-if="file.status == 'ready' || file.status == 'uploading'"
            :stroke-width="10"
            status="success"
            :percentage="file.percentage"
          >
            <template #default="{ percentage }">
              <div class="flex flex-col items-center justify-center" v-if="file.status == 'uploading'">
                <div>{{ percentage.toFixed(2) }}%</div>
              </div>
              <div v-else>等待中...</div>
            </template>
          </el-progress>
          <section v-if="file.status == 'success'" class="file-img">
            <img :src="file.url" alt="" class="file-status-success" />
            <label class="el-upload-list__item-status-label text-white">
              <el-icon>
                <Check />
              </el-icon>
            </label>
          </section>
          <section v-if="file.status == 'fail'" class="file-img file-img-fail">
            <img :src="file.url" alt="" class="file-status-fail" v-if="file.status == 'fail'" />
          </section>

          <section class="file-toolbar">
            <div @click="viewImg(file.url)" v-if="view">
              <el-icon><ZoomIn /></el-icon>
            </div>
            <div @click="handleDownload(file)" v-if="download">
              <el-icon><Download /></el-icon>
            </div>
            <div @click="handleRemove(file)" v-if="remove">
              <el-icon><Delete /></el-icon>
            </div>
          </section>
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import { IResponse, http } from '@/http'

import { uploadActions } from '@/http/axios'
import { Check, Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElUpload } from 'element-plus'
import { ref } from 'vue'
import viewImg from '@/utils/viewImg.tsx'

import type { UploadFile } from 'element-plus'

const handleDownload = (file: UploadFile) => {
  if (file.raw) {
    fetch(URL.createObjectURL(file.raw))
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'image.jpg'
        link.click()
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => console.error('Error:', error))
  } else {
    fetch(file.url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'image.jpg'
        link.click()
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => console.error('Error:', error))
  }
}
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
  /**查看 */
  view?: boolean
  /**删除 */
  remove?: boolean
  /**下载 */
  download?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  action: uploadActions.singleImage,
  limit: 1,
  maxNum: 15,
  formatType: 'string',
  multiple: false,
  view: true,
  remove: true,
  download: true,
})

const showUpload = computed(() => {
  if (props.multiple) {
    return fileList.value.length == props.maxNum ? 'none' : 'flex'
  }
  return fileList.value.length == props.limit ? 'none' : 'flex'
})

const handleModelValue = (modelValue: any) => {
  if (!modelValue || (modelValue as string).trim() == '') {
    fileList.value = []
    return emit('update:modelValue', props.formatType == 'string' ? '' : [])
  }

  const imgArr: string[] = modelValue?.toString()?.split(',') || []

  if (imgArr.length) {
    ;(fileList.value as { url: string }[]) = imgArr.map((url) => ({ url }))
  }
}
const attrs = useAttrs()

onMounted(() => handleModelValue(attrs.modelValue))

const handleRemove = (deleteFile) => {
  const index = fileList.value.findIndex((i) => i.uid == deleteFile.uid)
  fileList.value.splice(index, 1)
  const modelValue = []
  fileList.value.map((file) => {
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
    if (modelValue.length) {
      emit('update:modelValue', props.formatType == 'string' ? modelValue.toString() : modelValue)
    }
  }

  const formData = new FormData()

  const file = state.waitUploadList.shift()

  if (!file) return

  formData.append('file', file.raw)

  const config = {}

  http
    .upload(props.action, formData, {
      onUploadProgress: (progressEvent) => {
        const index = fileList.value.findIndex((item) => item.uid === file.uid)
        fileList.value[index].percentage = +(progressEvent.progress * 100).toFixed(2)
        fileList.value[index].status = 'uploading'
      },
      animate: false,
    })
    .then((response) => {
      const index = fileList.value.findIndex((item) => item.uid === file.uid)

      fileList.value[index].response = response
      fileList.value[index].status = 'success'
    })
    .catch((e) => {
      const index = fileList.value.findIndex((item) => item.uid === file.uid)
      fileList.value[index].response = {}
      fileList.value[index].status = 'fail'
      console.log(`index ==>`, index)
      console.log(`fileList.value ==>`, fileList.value)
      console.log(`e ==>`, e)
    })
    .finally(() => uploadSingleFile())
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
  .file-wrapper {
    @apply w-full h-full flex flex-col overflow-hidden relative;
    &:hover {
      .file-toolbar {
        @apply flex bg-gray-900/70;
      }
    }
    .file-img {
      @apply w-full h-full relative;
      img {
        @apply w-full h-full object-cover;
      }
      @keyframes dashedBorder {
        $border-width: 3px;
        0% {
          border: $border-width dashed transparent;
        }
        50% {
          border: $border-width dashed red;
        }
        100% {
          border: $border-width dashed transparent;
        }
      }
      &-fail {
        animation: dashedBorder 2s infinite linear;
        img {
          border-radius: 5px;
        }
      }
    }

    .file-toolbar {
      @apply text-2xl font-bold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full hidden items-center justify-center gap-1;
      i {
        @apply cursor-pointer text-gray-200;
        &:hover {
          @apply scale-110;
        }
      }
    }
    // .el-upload-list {
    //   .el-upload--picture-card {
    //     display: var(--show-upload);
    //   }
    // }
    // .el-upload-list__item-thumbnail {
    //   object-fit: cover;
    // }
    // .is-fail {
    //   animation: dashedBorder 2s infinite linear;
    //   position: relative;
    //   @keyframes dashedBorder {
    //     0% {
    //       border: 2px dashed transparent;
    //     }
    //     50% {
    //       border: 2px dashed red;
    //     }
    //     100% {
    //       border: 2px dashed transparent;
    //     }
    //   }
    //   @keyframes bg {
    //     0% {
    //       background: red;
    //     }
    //     50% {
    //       background: black;
    //     }
    //     100% {
    //       background: red;
    //     }
    //   }
    //   // &::after {
    //   //   content: '';
    //   //   position: absolute;
    //   //   right: -23px;
    //   //   top: -18px;
    //   //   width: 70px;
    //   //   height: 39px;
    //   //   background: red;
    //   //   text-align: center;
    //   //   transform: rotate(45deg);
    //   //   animation: bg 2s infinite linear;
    //   // }
    // }
  }
}
</style>
