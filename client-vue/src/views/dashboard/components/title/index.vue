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
        <div class="p-6 pr-2 pb-2">
          <h1 class="text-4xl font-bold">Welcome to Hang-bro!</h1>
          <p class="text-right text-gray-300">
            {{ state.text }}-- <span class="text-xs">{{ state.from }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { http } from '@/http'

const state = reactive({
  text: '',
  from: '',
})
const getText = () => {
  http.get<any>('/hitokoto', {}, { animate: false }).then((res: any) => {
    state.text = res.data.hitokoto
    state.from = (res.data.from_who || '') + '-' + res.data.from
  })
}

onMounted(() => {
  getText()
})
</script>
<style lang="scss" scoped></style>
