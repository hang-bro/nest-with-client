<template>
  <section v-draggable class="w-16 h-16 right-3 bottom-3 relative" ref="dragButtonRef">
    <!-- 弹出区域 -->
    <div
      class="absolute w-full flex items-center flex-col animate__animated gap-1"
      v-if="show"
      :class="{
        animate__fadeInUp: show,
        animate__fadeInDown: !show,
        '-top-56': show,
      }"
    >
      <el-button :icon="Search" circle />
      <el-button type="primary" :icon="Edit" circle />
      <el-button type="success" :icon="Check" circle />
      <el-button type="info" :icon="Message" circle />
      <el-button type="warning" :icon="Star" circle />
      <el-button type="danger" :icon="Delete" circle />
    </div>
    <div class="box1 cursor-pointer flex items-center justify-center text-gray-500">
      <SettingTwo size="22" @click="show = !show" />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { onClickOutside } from '@vueuse/core'

import { SettingTwo } from '@icon-park/vue-next'
const show = ref(false)
const dragButtonRef = ref()
onClickOutside(dragButtonRef, () => {
  show.value = false
})
</script>
<style lang="scss" scoped>
.box1 {
  @apply w-16 h-16;
  border-radius: 50%;
  background: #fff;
  transition: all ease 0.3s;
  box-shadow: 0 15px 25px -4px rgba(84, 81, 81, 0.5), inset 0 -3px 4px -1px rgba(0, 0, 0, 0.2),
    0 -10px 15px -1px rgba(255, 255, 255, 0.6), inset 0 3px 4px -1px rgba(255, 255, 255, 0.2),
    inset 0 0 5px 1px rgba(255, 255, 255, 0.8), inset 0 20px 30px 0 rgba(255, 255, 255, 0.2);
  &:active {
    transition: all ease 0.3s;
    box-shadow: 0 12px 25px -4px rgba(106, 101, 101, 0.4), inset 0 -8px 30px 1px rgba(255, 255, 255, 0.9),
      0 -10px 15px -1px rgba(255, 255, 255, 0.6), inset 0 8px 25px 0 rgba(0, 0, 0, 0.4),
      inset 0 0 10px 1px rgba(255, 255, 255, 0.6);
  }
}
</style>
