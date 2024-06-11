<template>
  <div class="flex flex-col overflow-hidden">
    <el-menu
      router
      :default-active="$route.path"
      class="overflow-auto no-scroll flex-1 el-menu-vertical-demo"
      :collapse="isCollapse"
    >
      <header
        id="site-name"
        v-if="!isCollapse"
        @click="$router.push('dashboard')"
        class="z-10 sticky top-0 border-b h-14 text-2xl font-semibold flex items-center justify-center whitespace-nowrap animate__animated animate__fadeInLeft bg-white"
      >
        <div class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Hang-bro</div>
      </header>
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Location /></el-icon>
          <span>vite自动生成路由</span>
        </template>
        <el-menu-item :index="route.path" v-for="route in routes">
          <el-icon><setting /></el-icon>
          <template #title>{{ route.name }}</template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { $routes } from '@/router'
import { Setting, Location } from '@element-plus/icons-vue'

const routes = $routes.filter((r) => r.name == 'layout')[0].children

withDefaults(
  defineProps<{
    isCollapse: boolean
  }>(),
  {
    isCollapse: false,
  },
)
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
