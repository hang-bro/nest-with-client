<template>
  <main class="w-full h-full p-5 flex flex-col bg-gray-100" ref="mainRef">
    <!-- 搜索区域 -->
    <section class="hidden sm:block my-2" v-show="showSearch">
      <SearchForm :searchForm="searchForm" :getList="getList" :reset="reset" :loading="loading" />
    </section>
    <!-- 搜索区域 end-->
    <!--  -->
    <el-card shadow="never" class="flex-1 overflow-auto table-content">
      <!-- 按钮区域 -->
      <section class="mb-3 hidden sm:block">
        <div class="flex items-center justify-between">
          <section>
            <slot name="actions" v-bind="exposed" />
          </section>
          <!--  -->
          <ToolBar
            @selectColumns="handleSelectColumns"
            v-model:showSearch="showSearch"
            :getList="getList"
            v-model:columns="state.columns"
          />
        </div>
      </section>
      <!-- 按钮区域 end -->
      <!-- 表格区域 -->
      <section class="flex-1">
        <el-table
          :header-cell-style="{ 'background-color': '#f5f7fa' }"
          highlight-current-row
          show-overflow-tooltip
          v-loading="loading"
          @selection-change="(rows:any[]) => (tableCheck = rows)"
          :data="list"
          border
          style="width: 100%; height: 100%"
        >
          <template v-if="state.columns.length" v-for="column in state.columns">
            <el-table-column
              show-overflow-tooltip
              align="center"
              v-bind="column"
              v-if="column.type == 'expand' && column.showColumn"
            >
              <template #default="props: ITableColumnDefaultSlotProps">
                <!-- 
              使用示例
              <template #expand="{row}">
                <div>{{row}}</div>
              </template>  
             -->
                <slot name="expand" v-bind="{ ...props }" />
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              v-bind="column"
              v-if="column.type == 'index' && column.showColumn"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              v-bind="column"
              v-if="column.type == 'selection' && column.showColumn"
            />

            <el-table-column
              show-overflow-tooltip
              align="center"
              v-bind="column"
              v-if="(!column.type || column.type == 'default') && column.showColumn"
            >
              <template #default="props: ITableColumnDefaultSlotProps">
                <section class="text-with-copy">
                  <!-- 使用插槽  -->
                  <slot v-if="column.useSlot" :name="column.prop" v-bind="{ ...exposed, ...props }" />
                  <!-- 使用render函数 -->
                  <div class="text-with-copy__text" v-else-if="column.render" v-html="column.render(props)" />
                  <!-- 默认渲染方式 -->
                  <div class="text-with-copy__text" v-else>
                    {{ props.row[column.prop] || '' }}
                  </div>

                  <!-- 使用图标 复制内容 -->
                  <div class="text-with-copy__icon" v-if="column.useCopy && props.row[column.prop]">
                    <CopyText :text="props.row[column.prop]" />
                  </div>
                </section>
              </template>
            </el-table-column>
          </template>
          <slot v-else name="table" v-bind="exposed" />
        </el-table>
      </section>
      <!-- 表格区域 end -->
    </el-card>

    <!-- 分页区域 -->
    <section class="flex my-5 justify-end hidden sm:block">
      <el-pagination
        background
        v-model:current-page="pageIndex"
        v-model:page-size="pageSize"
        layout="total,prev, pager, next,sizes,"
        :page-sizes="[10, 20, 40, 80, 100]"
        :total="total"
      />
    </section>
    <!-- 分页区域 end -->
  </main>
</template>
<script lang="ts" setup>
import useList from '@/hooks/useList'
import { nanoid } from 'nanoid'

import { http } from '@/http'
import { Delete, Edit, Plus, View } from '@element-plus/icons-vue'

import type { ElTableColumn } from 'element-plus'

import { ElMessage, ElMessageBox } from 'element-plus'
import CopyText from './components/copyText.vue'
import SearchForm from './components/searchForm.vue'
import ToolBar from './components/toolBar.vue'
import viewImg from '@/utils/viewImg.tsx'


export type IProTableProps = {
  api: IProTableApi
  columns?: IProTableColumns
  searchForm?: IProTableSearchForm
  showLabel?: boolean
  searchFormSize?: IProTableSearchFormSize
}

type IState = {
  columns: IProTableColumns
}

const state = reactive<IState>({
  columns: [],
})

const props = withDefaults(defineProps<IProTableProps>(), {
  searchFormSize: () => 'default',
  showLabel: () => false,
  searchForm: () => ({}),
})

const { list, total, loading, pageIndex, pageSize, tableCheck, showSearch, reset, getList } = useList(
  props.api.list,
  props.searchForm,
)

await getList()

defineExpose({
  getList,
})

onMounted(() => {
  if (props.columns) {
    props.columns.forEach((column) => {
      column.uuid = nanoid()
      column.showColumn = true
    })
    state.columns = [...props.columns]
  }
})

const handleSelectColumns = (ids: string[]) => {
  state.columns.forEach((column) => {
    column.showColumn = false
  })
  ids.map((id) => {
    const index = state.columns.findIndex((i) => i.uuid == id)
    state.columns[index].showColumn = true
  })
}

const handleDelete = (id?: string) => {
  const ids = id || tableCheck.value.map((i) => i.id)

  ElMessageBox.confirm('确定删除?', '提示', { type: 'warning' })
    .then(() => {
      http.delete(`${props.api.delete}/${ids}`).then((res) => {
        const { code, message } = res
        if (code == 200) {
          ElMessage.success(message)
          getList()
        }
      })
    })
    .catch((e) => e)
}

const icons = shallowRef({
  Plus,
  Edit,
  Delete,
  View,
})

/**暴露出去给各个 slot使用的数据 */
const exposed = reactive({
  getList,
  reset,
  handleDelete,
  tableCheck,
  icons,
  showSearch,
  props,
  viewImg,
})
</script>
<style lang="scss" scoped>
.preview {
  --b1: 100% 0 0;
  --b2: 96.1151% 0 0;
  background-image: repeating-linear-gradient(
    45deg,
    var(--fallback-b1, oklch(var(--b1))),
    var(--fallback-b1, oklch(var(--b1))) 13px,
    var(--fallback-b2, oklch(var(--b2))) 13px,
    var(--fallback-b2, oklch(var(--b2))) 14px
  ) !important;
  background-size: 40px 40px !important;
}
.table-content {
  :deep(.el-card__body) {
    @apply h-full flex flex-col;
  }
  :deep(.el-scrollbar) {
    @apply preview;
  }
  :deep(thead) {
    @apply text-gray-600;
  }

  .text-with-copy {
    @apply flex items-center justify-center w-full;
    &:hover {
      // .text-with-copy__icon {
      //   display: block;
      // }
      // .text-with-copy__text {
      //   max-width: calc(100% - 25px);
      // }
    }
    &__text {
      @apply overflow-hidden text-ellipsis cursor-pointer whitespace-nowrap flex;
      max-width: calc(100% - 25px);
    }
    &__icon {
      @apply ml-1 w-[16px]  text-[#1677ff] cursor-pointer;
    }
  }
}
</style>
