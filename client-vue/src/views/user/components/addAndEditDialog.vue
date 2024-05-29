<template>
  <el-dialog
    :modelValue="show"
    :title="title"
    :width="width"
    :before-close="cancel"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" status-icon :rules="rules" label-width="auto" class="demo-form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="type == 'add'" label="密码" prop="password">
        <el-input v-model="form.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <ImageUpload
          ref="uploadRef"
          @success="(url) => (form.avatar = url)"
          @remove="(e) => (form.avatar = '')"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" autocomplete="off" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input type="number" v-model="form.age" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select style="width: 100%" v-model="form.role" placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="warning" @click="resetForm(formRef)">清空</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'

import useValidate from '@/hooks/useValidate'
import { http } from '@/http'

const roleList = ref([])

const formRef = ref<FormInstance>()

const uploadRef = ref<FormInstance>()

export type IProps = {
  show: boolean
  type: 'add' | 'edit' | ''
  formData: Record<string, any>
  width?: number
}
const props = withDefaults(defineProps<IProps>(), {
  width: () => 500,
})

type IEmit = {
  (e: 'update:show', v: boolean)
  (e: 'getList')
}
const emit = defineEmits<IEmit>()

const cancel = () => emit('update:show', false)

const title = computed(() => {
  switch (props.type) {
    case 'add':
      return '新增'
    case 'edit':
      return '修改'
    default:
      return '标题'
  }
})

watch(
  () => props.show,
  (show) => {
    if (show) {
      nextTick(() => {
        resetForm(formRef.value)
        Object.keys(props.formData).forEach((key) => {
          form[key] = props.formData[key]
        })
        getRoleList()
      })
    }
  },
)

type IForm = {
  id?: number
  name: string
  key: string
  sort?: number
  remark?: string
}

const form = reactive<any>({
  age: null,
  email: '',
  username: '',
  address: '',
  avatar: '',
  password: '',
})

const rules = reactive({
  username: useValidate.pleaseInput,
  address: useValidate.pleaseInput,
  avatar: useValidate.pleaseSelect,
  email: useValidate.email,
  password: useValidate.password,
  role: useValidate.pleaseSelect,
})

const getRoleList = () => http.get('/role').then((res) => (roleList.value = res.data.data))

const handleSubmit = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    if (valid) {
      const data = JSON.parse(JSON.stringify(form))
      const apiUrl = '/role'
      if (props.type == 'add') {
        http.post(apiUrl, data).then((res) => {
          ElMessage.success(res.message)
          emit('getList')
        })
      }

      if (props.type == 'edit') {
        http.patch(`${apiUrl}/${form.id}`, data).then((res) => {
          ElMessage.success(res.message)
          emit('getList')
        })
      }
    }
  })
}
</script>
<style lang="scss" scoped></style>
