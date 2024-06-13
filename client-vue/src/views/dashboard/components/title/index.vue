<template>
  <section class="w-full select-none">
    <div class="relative mb-3">
      <!-- 背景图片 -->
      <img
        src="http://localhost:2333/static/hotPic/wallhaven-o565xl.png"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- 毛玻璃效果的容器 -->
      <div class="relative backdrop-filter backdrop-blur bg-white bg-opacity-30">
        <!-- 容器内容 -->
        <div class="p-6 pr-2 pb-2 relative cursor-pointer">
          <Redo
            :class="state.loading ? 'animate-spin' : ''"
            class="absolute right-3 top-3 text-gray-300"
            @click="getText"
          />
          <h1 class="text-4xl font-bold">Welcome to Hang-bro!</h1>
          <div class="text-right text-gray-300" @click="useCopy(state.text)">
            {{ state.text }} <span class="text-xs"> {{ state.from }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { http } from '@/http'
import useCopy from '@/hooks/useCopy'
import { Redo } from '@icon-park/vue-next'
const state = reactive({
  loading: false,
  text: '',
  from: '',
})

const getText = () => {
  state.loading = true
  http
    .get('/hitokoto', {}, { animate: false })
    .then((res: any) => {
      state.text = res.data.hitokoto
      state.from = (res.data.from_who || '') + '-' + res.data.from
    })
    .finally(() => (state.loading = false))
}

onMounted(() => {
  getText()
})
</script>
<style lang="scss" scoped></style>
