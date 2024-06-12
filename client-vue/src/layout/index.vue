<!--
 * @Description: 
 * @Author: HYH
 * @LastEditors: HYH
 * @LastEditTime: 2023-07-28 20:03:56
-->
<template>
  <main class="w-screen h-screen bg-gray-50/50 flex">
    <!-- <Menu v-model:isCollapse="isCollapse" /> -->
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
    </div>
  </main>

  <div
    class="absolute right-[50px] bottom-[50px] p-3 bg-slate-100/70 shadow-xl rounded-full cursor-pointer hover:translate-y-[-5px] transition-all"
    @click="$router.back()"
    v-if="showBackIcon"
  >
    <Back theme="outline" size="30" fill="#666666" />
  </div>
</template>
<script setup lang="ts">
import { Back } from '@icon-park/vue-next'
import { useRoute } from 'vue-router'
import Header from './components/header/index.vue'
import Menu from './components/menu/index.vue'
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
