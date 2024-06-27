<template>
  <main class="w-full h-full p-5"></main>
</template>
<script lang="ts" setup>
import { http } from '@/http'
import { onMounted } from 'vue'

async function test() {
  const res = await fetch('http://localhost:2333/api/wallpaper')

  const reader = res.body!.getReader()
  const { value, done } = await reader.read()
  // while (!done) {
  //   if (done) {
  //     break
  //   }
  //   const textDecoder=new TextDecoder()
  //   textDecoder.decode(value)
  //   console.log(`value ==>`,  textDecoder.decode(value))

  // }
}

onMounted(test)
</script>
<style lang="scss" scoped></style>
