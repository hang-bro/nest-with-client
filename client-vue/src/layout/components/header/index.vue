<template>
  <header class="h-14 z-10 flex items-center justify-center border-b animate__animated animate__fadeInDown">
    <div class="w-full px-3 flex items-center justify-between text-gray-500 font-semibold">
      <div class="text-2xl cursor-pointer flex items-center justify-center gap-5 hover:text-black">
        <el-icon @click="$emit('collapse')"><Operation /></el-icon>
        <Search />
      </div>

      <div class="flex gap-3 items-center">
       
        <span class="cursor-pointer text-black hidden sm:block max-w-[120px] overflow-hidden text-ellipsis">
          {{ user.username }}
        </span>
        <div>
          <el-dropdown trigger="click">
            <!-- 头像 -->
            <img
              :src="user.avatar"
              class="w-[40px] h-[40px] cursor-pointer rounded-full object-cover"
              @error="useErrorImg"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- theme -->
        <div class="flex cursor-pointer" id="theme-change">
          <el-dropdown @command="(theme:ITheme) => config.setTheme(theme)" size="large">
            <span class="el-dropdown-link"> 主题 </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="theme" v-for="theme in availableThemes">
                  {{ theme }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <a href="https://github.com/hang-bro/nest-with-client" target="_blank">
          <github theme="outline" size="24" fill="#333" />
        </a>
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
import { Operation } from '@element-plus/icons-vue'
import { Github } from '@icon-park/vue-next'
import useErrorImg from '@/hooks/useErrorImg'
import { ITheme, availableThemes } from '@/store/config'
import { useStore } from '@/hooks/useStore'
import router from '@/router'
import Search from './search.vue'
const user = useStore((store) => store.user)
const config = useStore((store) => store.config)
const logout = () => {
  useStore((s) => {
    s.user.$reset()
    console.log(` s.user ==>`, s.user.$state)
    s.config.$reset()
    router.push('/login')
  })
}
</script>
<style lang="scss" scoped></style>
