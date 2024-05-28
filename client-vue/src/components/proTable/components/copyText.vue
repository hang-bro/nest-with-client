<template>
  <Select color="green" v-if="copied" />
  <DocumentCopy v-else @click="copy(text)" />
</template>
<script lang="ts" setup>
import useCopy from '@/hooks/useCopy'
import { DocumentCopy, Select } from '@element-plus/icons-vue'
defineProps<{ text: string }>()
const copied = ref(false)

const copy = (text: string) => {
  useCopy(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>
<style lang="scss" scoped></style>
