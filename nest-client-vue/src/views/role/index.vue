<template>
  <main class="w-full h-full">
    <ProTable ref="ProTableRef" v-bind="proTableProps">
      <template #actions="{ tableCheck, handleDelete, icons }">
        <el-button type="primary" @click="handleAdd" :icon="icons.Plus">新增</el-button>
        <el-button type="danger" :disabled="!tableCheck.length" :icon="icons.Delete" @click="handleDelete()">
          删除
        </el-button>
      </template>
      <template #option="{ row, handleDelete }">
        <el-button link type="warning" @click="handleEdit(row)">修改</el-button>
        <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
      </template>
    </ProTable>
    <AddAndEditDialog v-model:show="addAndEditDialog.show" v-bind="addAndEditDialog" @getList="getList" />
  </main>
</template>
<script lang="ts" setup>
import AddAndEditDialog, { IProps } from './components/addAndEditDialog.vue'
const ProTableRef = ref<IProTable>()

const getList = () => ProTableRef.value.getList()

const addAndEditDialog = reactive<IProps>({
  show: false,
  type: '',
  formData: {},
})

const proTableProps = reactive<IProTableProps>({
  api: { list: '/role/list', delete: '/role' },
  searchForm: {
    name: { type: 'input', label: '名称', value: null },
    remark: { type: 'input', label: '备注', value: null },
    key: { type: 'input', label: '字符', value: null },
  },
  columns: [
    { type: 'selection' },
    { type: 'index', label: '序号', width: 60 },
    { prop: 'id', label: 'ID' },
    { prop: 'key', label: '字符', useCopy: true },
    { prop: 'name', label: '名称' },
    { prop: 'remark', label: '备注' },
    { label: '操作', prop: 'option', useSlot: true },
  ],
})

const handleEdit = (row: any) => {
  addAndEditDialog.type = 'edit'
  addAndEditDialog.formData = { ...row }
  addAndEditDialog.show = true
}
const handleAdd = () => {
  addAndEditDialog.type = 'add'
  addAndEditDialog.show = true
}
</script>
<style lang="scss" scoped></style>
