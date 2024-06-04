<template>
  <main class="w-full h-full p-5">socket</main>
</template>
<script lang="ts" setup>
import { WebSocketClient } from './index'

// 创建实例
const ws = new WebSocketClient('ws://localhost:3200')

// 连接
ws.connect()
// 同原生方法
ws.onclose(() => {})
// 同原生方法
ws.onerror(() => {})
// 同原生方法
ws.onmessage(() => {
  // 同原生方法
  ws.send('自定义发送的数据')
})
// 同原生方法
ws.onopen(() => {})

// 关闭连接
ws.close()
</script>
<style lang="scss" scoped></style>
