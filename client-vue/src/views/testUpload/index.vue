<!--
 * @Description: 
 * @Author: HYH
 * @LastEditors: HYH
 * @LastEditTime: 2023-07-13 16:04:52
-->

<template>
  <div class="w-full flex flex-wrap">
    form{{ form }}
    <ImageUpload format-type="array" v-model="form.avatar" />
  </div>
</template>
<script lang="ts" setup>
const form = reactive({
  avatar: '',
})
</script>
<style lang="scss" scoped></style>
