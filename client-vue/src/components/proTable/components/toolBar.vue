<template>
  <section class="toolbar">
    <el-tooltip placement="top">
      <template #content> {{ showSearch ? '隐藏搜索' : '显示搜索' }} </template>
      <el-button class="ml-2" @click="handleShowSearch" circle :icon="Search" />
    </el-tooltip>

    <el-popover :width="200" trigger="click" @show="hanldeShow">
      <template #reference>
        <el-button class="ml-2" circle :icon="Setting" />
      </template>
      <el-table ref="tableRef" :height="300" @selection-change="handleSelectionChange" :data="columns">
        <el-table-column type="selection" />
        <el-table-column prop="label" label="标题">
          <template #default="{ row }">
            <div v-if="row.type == 'selection'">排序</div>
            <div v-else-if="row.type == 'index' && !row.label">多选</div>
            <div v-else>{{ row.label }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-popover>
    <el-tooltip placement="top">
      <template #content> 刷新列表 </template>
      <el-button class="ml-2" @click="getList" circle :icon="Refresh" />
    </el-tooltip>
    <el-tooltip placement="top">
      <template #content> 源代码 </template>
      <el-button class="ml-2" @click="showSourceCode('/src/views/user/index.vue')" circle :icon="Refresh" />
    </el-tooltip>
  </section>
</template>
<script lang="ts" setup>
import { Refresh, Search, Setting } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'
type IProps = {
  columns: IProTableColumns
  showSearch: boolean
  getList: (...args: any[]) => any
}

const props = defineProps<IProps>()

type IEmit = {
  (e: 'update:showSearch', v: boolean)
  (e: 'selectColumns', ids: string[])
}
const emit = defineEmits<IEmit>()

const tableRef = ref<InstanceType<typeof ElTable>>()

const flag = ref(false)

const handleShowSearch = () => emit('update:showSearch', !props.showSearch)

const handleSelectionChange = (rows: IProTableColumns) => {
  const ids = rows.map((i) => i.uuid)
  emit('selectColumns', ids)
}

const hanldeShow = () => {
  if (!flag.value) {
    tableRef.value!.toggleAllSelection()
    flag.value = true
  }
}
</script>
<style lang="scss" scoped>
.toolbar {
  :deep(button) {
    &:last-child {
      @apply mr-0;
    }
  }
}
</style>
