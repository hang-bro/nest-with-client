<template>
  <!-- 搜索 -->
  <div class="relative mx-5 flex-1" ref="searchRef" id="header-search">
    <input
      class="p-1 bg-gray-100/60 w-full sm:w-full md:w-[300px] text-base indent-1 placeholder:text-sm outline-none transition-all border"
      v-model="state.searchValue"
      placeholder="搜索..."
      @input="onSearch"
      @focus="state.showList = true"
    />
    <ul
      ref="searchScrollRef"
      class="hidden scroll1 absolute w-full max-h-[300px] overflow-auto bg-white shadow-2xl mt-1"
      :class="{ '!block': state.showList }"
    >
      <li
        @click.prevent="
          () => {
            state.showList = false
            router.push(item.path)
          }
        "
        class="hover:bg-[#ebeef5] px-3 py-1.5 border-b-[1px] cursor-pointer text-base"
        :class="{
          focus: state.selectIndex == index,
        }"
        v-for="(item, index) in state.searchList"
      >
        <div class="flex items-center">
          <span
            :class="{
              '!bg-red-500': index == 0,
              '!bg-red-400': index == 1,
              '!bg-red-300': index == 2,
            }"
            class="flex w-5 h-5 mr-2 bg-gray-500 items-center justify-center text-white text-sm"
          >
            {{ index + 1 }}
          </span>
          <span class="whitespace-nowrap overflow-hidden text-ellipsis">{{ item.name }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { $routes } from '@/router'
import useKeyDown from '@/hooks/useKeyDown'
import { useRouter } from 'vue-router'
const searchList = $routes.filter((r) => r.name == 'layout')[0].children

const router = useRouter()
const searchRef = ref<HTMLDivElement>()
const searchScrollRef = ref<HTMLElement>()
onClickOutside(searchRef, () => {
  state.showList = false
  state.selectIndex = 0
  state.searchValue = ''
  state.searchList = searchList
})

const state = reactive({
  searchList: searchList,
  showList: false,
  searchValue: '',
  selectIndex: 0,
})

const onSearch = () => {
  state.searchList = []
  searchList.map((item) => {
    // @ts-ignore
    if (item.name.indexOf(state.searchValue) != -1) {
      state.searchList.push(item)
    }
  })
}

useKeyDown((e) => {
  if ((e.key == 'ArrowDown' || e.key == 'ArrowUp' || e.key == 'Enter') && state.showList) {
    e.preventDefault()
    if (e.key == 'ArrowDown') {
      state.selectIndex += 1
      if (state.selectIndex == state.searchList.length) state.selectIndex = 0
    } else if (e.key == 'ArrowUp') {
      state.selectIndex -= 1
      if (state.selectIndex < 0) state.selectIndex = state.searchList.length - 1
    }
    const liHeight = (searchScrollRef.value.children[0] as HTMLDivElement).offsetHeight

    searchScrollRef.value.scrollTo({
      top: liHeight * state.selectIndex,
      behavior: 'smooth',
    })

    const { name, path } = state.searchList[state.selectIndex]
    // @ts-ignore
    state.searchValue = name

    if (e.key == 'Enter') router.push(path)
  }
})
</script>
<style lang="scss" scoped>
.focus {
  @apply bg-gray-300;
}
</style>
