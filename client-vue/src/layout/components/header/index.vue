<template>
  <header class="bg-white flex items-center justify-center border-b animate__animated animate__fadeInDown">
    <!-- logo -->
    <section
      id="site-name"
      @click="$router.push('dashboard')"
      class="h-full ml-5 text-3xl font-semibold whitespace-nowrap hidden sm:block"
    >
      <div
        class="h-full flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
      >
        Hang-bro
      </div>
    </section>
    <!-- logo end-->

    <section class="w-full flex items-center justify-between font-semibold">
      <!-- Search -->
      <Search />
      <!-- Search end -->
      <div class="gap-5 items-center hidden md:flex mr-5">
        <a href="https://github.com/hang-bro/nest-with-client" target="_blank">
          <GithubOne theme="outline" size="22" fill="#333" />
        </a>
        <div>
          <!-- 头像 -->
          <!-- @click="viewImg(user.avatar)" -->
          <img
            :src="user.avatar"
            class="w-12 p-1 aspect-square cursor-pointer rounded-full object-cover border"
            @error="useErrorImg"
          />
        </div>
        <div class="cursor-pointer text-sm max-w-[100px]">
          <div class="overflow-hidden text-ellipsis whitespace-nowrap" :title="user.username">
            {{ user.username }}
          </div>
          <div class="text-blue-500" @click="logout">退出登录</div>
        </div>
      </div>
    </section>
  </header>
</template>
<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

import useErrorImg from '@/hooks/useErrorImg'
import { useStore } from '@/hooks/useStore'
import router from '@/router'
import { GithubOne } from '@icon-park/vue-next'
import Search from './search.vue'
import viewImg from '@/utils/viewImg'
const user = useStore((store) => store.user)
const logout = () => {
  ElMessageBox.confirm('确认退出?', '提示').then(() => {
    useStore((store) => {
      store.user.$reset()
      store.config.$reset()
      router.push('/login')
    })
  })
}
</script>
<style lang="scss" scoped></style>
