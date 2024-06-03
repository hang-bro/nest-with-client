<template>
  <main class="w-full h-full p-5">
    <el-button @click="showSourceCode('/src/directives/module/copy.ts')">showSourceCode</el-button>
  </main>
</template>
<script lang="ts" setup>
import showSourceCode from '@/utils/showSourceCode.tsx'
</script>
<style lang="scss" scoped></style>
