<template>
  <el-dialog
    :modelValue="show"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    :before-close="cancel"
    destroy-on-close
  >
    rules{{ rules.email }}
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
        <ImageUpload v-model="form.avatar" @update:model-value="formRef.clearValidate('avatar')" />
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
        <!-- <el-button type="warning" @click="resetForm(formRef)">清空</el-button> -->
        <el-button type="primary" @click="handleSubmit(formRef)"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'

import useValidate, { defineValidator } from '@/hooks/useValidate'
import { http } from '@/http'

const roleList = ref([])

const formRef = ref<FormInstance>()

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
      if (!Object.keys(props.formData).length) {
        Object.keys(form).forEach((key) => (form[key] = null))
      } else {
        Object.keys(props.formData).forEach((key) => {
          form[key] = props.formData[key] || null
        })
      }
      if (props.type == 'add') {
        rules.email = defineValidator(
          (joi) => {
            return joi
              .string()
              .email({ tlds: { allow: false } })
              .error(new Error('邮箱不符合规范'))
          },
          {
            remoteFn: (email) =>
              new Promise((resolve, reject) => {
                http.get('/user/emailExist', { email }).then((res) => {
                  resolve({
                    error: res.data ? '邮箱已存在!' : null,
                  })
                })
              }),
          },
        )
      } else {
        rules.email = useValidate.email
      }

      getRoleList()
    }
  },
)

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

const getRoleList = () => http.get('/role').then((res) => (roleList.value = res.data))

const handleSubmit = (formEl: FormInstance) => {
  formEl.validate((valid) => {
    if (valid) {
      const data = JSON.parse(JSON.stringify(form))
      const apiUrl = '/user'
      if (props.type == 'add') {
        http.post(apiUrl, data).then((res) => {
          ElMessage.success(res.message)
          cancel()
          emit('getList')
        })
      }

      if (props.type == 'edit') {
        http.patch(`${apiUrl}/${form.id}`, data).then((res) => {
          ElMessage.success(res.message)
          cancel()
          emit('getList')
        })
      }
    }
  })
}
</script>
<style lang="scss" scoped></style>
