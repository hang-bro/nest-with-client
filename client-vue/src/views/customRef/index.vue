<template>
  <main class="w-full h-full p-5">
    <!-- 使用el-input不行 -->
    <input type="text" v-model="text" />
    <p>value:{{ text }}</p>
  </main>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import debounceRef from './debounceRef'
const text = debounceRef('')
</script>
<style lang="scss" scoped></style>
