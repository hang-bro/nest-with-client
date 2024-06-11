<template>
  <main class="w-full h-full">
    <!-- <Banner/> -->
    <div style="height: 300px; max-width: 600px">
      <el-steps align-center direction="vertical" class="">
        <el-step :title="item.message" v-for="item in steps">
          <template #description>
            <div>{{ item.committer.name }}</div>
            <div>{{ dayjs(item.committer.date).format('YYYY-MM-DD hh:mm:ss') }}</div>
            <div></div>
          </template>
        </el-step>
      </el-steps>
    </div>
    <Footer />
  </main>
</template>
<script lang="ts" setup>
import Footer from './components/footer/index.vue'
import Banner from './components/Banner/index.vue'
import { http } from '@/http'
interface ISteps {
  committer: {
    name: string
    email: string
    date: string
  }
  message: string
}
const steps = ref<ISteps[]>([])
http.get('/github/log').then((res) => {
  steps.value = res.data
})
</script>
<style lang="scss" scoped></style>
