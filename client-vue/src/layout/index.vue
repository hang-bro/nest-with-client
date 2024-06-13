<!--
 * @Description: 
 * @Author: HYH
 * @LastEditors: HYH
 * @LastEditTime: 2023-07-28 20:03:56
-->
<template>
  <main class="w-screen h-screen bg-gray-50/50 flex">
    <div class="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <Header class="h-14 bg-gray-50" @collapse="isCollapse = !isCollapse" />
      <div class="flex-1 overflow-hidden p-2">
        <RouterView v-slot="{ Component, route: { meta } }">
          <!-- @vue-ignore -->
          <Transition
            :enter-active-class="
              meta.enterActive ? meta.enterActive : 'animate__animated animate__fadeInLeft'
            "
            :leave-active-class="meta.leaveActive ? meta.leaveActive : 'animate__animated animate__fadeOutUp'"
            mode="in-out"
          >
            <Suspense>
              <!-- 主要内容 -->
              <component :is="Component"></component>
              <!-- 加载中状态 -->
              <template #fallback>
                <main class="w-full h-full absolute">
                  <el-skeleton :rows="10" animated />
                </main>
              </template>
            </Suspense>
          </Transition>
        </RouterView>
      </div>
      <DragButton />
    </div>
  </main>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from './components/header/index.vue'
import DragButton from './components/dragButton/index.vue'
import { useIntroduce } from './index'
const isCollapse = ref(false)

onMounted(() => {
  setTimeout(() => {
    useIntroduce()
  }, 1000)
})
const route = useRoute()
const showBackIcon = computed(() => {
  const hidePaths = ['/login', '/regist', '/resetPwd', '/welcome', '/dashboard', '/dev']
  return !hidePaths.includes(route.path)
})
</script>
<style lang="scss"></style>
