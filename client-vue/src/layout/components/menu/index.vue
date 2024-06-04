<template>
  <div class="flex flex-col">
    <header
      id="site-name"
      v-if="!isCollapse"
      class="border-b h-14 uppercase text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center whitespace-nowrap"
    >
      Hang-bro
    </header>
    <el-menu
      router
      :default-active="$route.path"
      class="animate__animated animate__fadeInDown overflow-auto no-scroll flex-1"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item :index="route.path" v-for="route in $routes">
        <el-icon><setting /></el-icon>
        <template #title>{{ route.name }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
// import { $routes } from '@/router';
import { Setting } from '@element-plus/icons-vue';

withDefaults(
  defineProps<{
    isCollapse: boolean
  }>(),
  {
    isCollapse: false,
  },
)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>

</style>
