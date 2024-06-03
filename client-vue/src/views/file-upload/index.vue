<!--
 * @Description: 
 * @Author: HYH
 * @LastEditors: HYH
 * @LastEditTime: 2023-07-17 14:13:50
-->
<template>
  <main class="w-full h-full p-5 bg-gray-100">
    <el-upload :auto-upload="false" :limit="1" v-model:file-list="fileList" :on-change="handleChange">
      <el-button link type="primary">选择文件</el-button>
    </el-upload>
  </main>
</template>
<script lang="ts" setup>
import { http } from '@/http'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { nanoid } from 'nanoid'

const fileList = ref<UploadUserFile[]>([])
/**1Mb */
const $1M = 1 * 1024 * 1024
// 每一片大小
const chunkSize = $1M * 0.5 //   MB

const handleChange: UploadProps['onChange'] = async (file) => {
  const [, ext] = file.name.split('.')
  const chunks = []
  const name = nanoid()
  let cur = 0
  let index = 0
  while (cur < file.raw.size) {
    chunks.push({
      file: file.raw.slice(cur, cur + chunkSize),
      name: `${index}.${name}.${ext}`,
    })
    cur += chunkSize
    index += 1
  }

  for (const chunk of chunks) {
    await upload(new File([chunk.file], chunk.name))
  }

  merge(`${name}.${ext}`)
}

const upload = (file) => {
  const formData = new FormData()

  formData.append('file', file)

  return http.upload('/upload/slice', formData, {
    animate: false,
  })
}
const merge = (name) => {
  http.post('/upload/slice/merge', { name }).then((res) => {
    console.log(res)
  })
}
</script>
