<!--
 * @Description: 
 * @Author: HYH
 * @LastEditors: HYH
 * @LastEditTime: 2023-07-18 10:16:15
-->
<template>
  <div class="w-full h-full">
    <ProTable ref="ProTableRef" v-bind="proTableProps">
      <template #actions="{ tableCheck, handleDelete, icons }">
        <el-button type="primary" @click="handleAdd" :icon="icons.Plus">新增</el-button>
        <el-button type="danger" :disabled="!tableCheck.length" :icon="icons.Delete" @click="handleDelete()">
          删除
        </el-button>
      </template>
      <template #avatar="{ row, viewImg }">
        <el-image class="w-10 aspect-square cursor-pointer" :src="row.avatar" @click="viewImg(row.avatar)" />
      </template>
      <template #option="{ row, handleDelete }">
        <el-button @click="handleDelete(row.id)" link type="danger">删除</el-button>
        <el-button @click="handleEdit(row)" link type="warning">编辑</el-button>
        <el-popconfirm icon-color="#626AEF" title="确认重置密码?" @confirm="resetPwd(row.id)">
          <template #reference>
            <el-button link type="success">重置密码</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>
    <AddAndEditDialog @getList="getList" v-model:show="addAndEditDialog.show" v-bind="addAndEditDialog" />
  </div>
</template>
<script lang="ts" setup>
import { http } from '@/http'
import { ElMessage } from 'element-plus'
import AddAndEditDialog, { IProps } from './components/addAndEditDialog.vue'

const ProTableRef = ref<IProTable>()

const getList = () => ProTableRef.value.getList()

const addAndEditDialog = reactive<IProps>({
  show: false,
  type: '',
  formData: {},
})

const proTableProps = reactive<IProTableProps>({
  api: { list: '/user/list', delete: '/user' },
  searchForm: {
    username: { type: 'input', label: '用户名', value: null },
    email: { type: 'input', label: '邮箱', value: null },
  },
  columns: [
    { type: 'selection' },
    { type: 'index', label: '序号', width: 60 },
    { prop: 'id', label: 'ID', useCopy: true, width: 220 },
    { prop: 'username', label: '用户名', useCopy: true },
    { prop: 'avatar', label: '头像', useSlot: true },
    { prop: 'email', label: '邮箱', useCopy: true },
    { prop: 'address', label: '地址' },
    { prop: 'role', label: '角色' },
    {
      prop: 'createTime',
      label: '创建时间',
      width: 160,
      render: ({ row }) => {
        return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      prop: 'updateTime',
      label: '修改时间',
      width: 160,
      render: ({ row }) => {
        return dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    { label: '操作', prop: 'option', useSlot: true, width: 200, fixed: 'right' },
  ],
})

const resetPwd = (userId: string) => {
  http.post('/user/resetPwd', { userId }).then((res) => {
    const { code, message } = res
    if (code === 200) {
      ElMessage.success(message)
      getList()
    }
  })
}

const handleAdd = () => {
  addAndEditDialog.type = 'add'
  addAndEditDialog.formData = {}
  addAndEditDialog.show = true
}

const handleEdit = (row: IUser) => {
  addAndEditDialog.type = 'edit'
  addAndEditDialog.formData = row
  addAndEditDialog.show = true
}
</script>
<style lang="scss" scoped></style>
