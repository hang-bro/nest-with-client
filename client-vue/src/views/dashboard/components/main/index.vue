<template>
  <div class="flex-1 overflow-hidden animate__animated animate__fadeInLeft" ref="mainRef">
    <!--  Swiper  -->
    <div class="p-5 shadow-xl rounded-xl bg-gray-50 overflow-hidden">
      <div>
        <el-carousel motion-blur height="350px" :interval="5000">
          <el-carousel-item v-for="item in imgs" :key="item">
            <img loading="lazy" class="w-full h-full object-cover" :src="item.url" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { http } from '@/http'
const mainRef = ref<HTMLElement>()

const imgs = ref([])
onMounted(() => {
  mainRef.value.addEventListener('animationend', function () {
    console.log(`css3运动结束！ ==>`)
    http.get<any>('/user/bannerList').then((res) => {
      imgs.value = res.data
    })
  })
})
</script>
<style lang="scss" scoped>
:deep(.el-carousel__indicators) {
  @apply whitespace-nowrap;
}
</style>
