<template>
  <main class="w-full h-full p-5">
    <!-- @vue-ignore -->
    <input name="" id="" type="color" @change="(e) => (color = e.target!.value)" />
    <hr/>
    <el-button @click="log('tilte', 'text')">测试</el-button>
  </main>
</template>
<script lang="ts" setup>
const color = ref('#67c23a')
const log = (title, text) => {
  console.log(
    `%c ${title} %c ${text} `,
    `background:${color.value};border:1px solid ${color.value}; padding: 1px; color: #fff;`,
    `border:1px solid ${color.value}; padding: 1px; color: ${color.value};`,
  )
}
</script>
<style lang="scss" scoped></style>
