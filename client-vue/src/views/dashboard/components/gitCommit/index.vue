<template>
  <section class="w-80 h-80 overflow-auto no-scroll my-3 shadow rounded-sm bg-white cursor-pointer">
    <el-card>
      <header class="mb-2 font-semibold">git提交记录</header>
      <el-steps direction="vertical">
        <el-step :title="item.message" v-for="item in steps">
          <template #description>
            <div class="mb-2 text-xs font-semibold">
              <div>{{ item.committer.name }}</div>
              <div>{{ dayjs(item.committer.date).format('YYYY-MM-DD hh:mm:ss') }}</div>
            </div>
          </template>
        </el-step>
      </el-steps>
    </el-card>
  </section>
</template>
<script lang="ts" setup>
interface ISteps {
  committer: {
    name: string
    email: string
    date: string
  }
  message: string
}
const steps = ref<ISteps[]>([])
// http.get('/github/log').then((res) => {
//   steps.value = res.data
// })
</script>
<style lang="scss" scoped></style>
