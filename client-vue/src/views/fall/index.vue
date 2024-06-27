<template>
  <main class="w-full h-full overflow-auto scroll1" id="test">
    <div ref="containerRef" class="w-full relative"></div>
  </main>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { http } from '@/http'
import viewImg from '@/utils/viewImg'
const containerRef = ref<HTMLDivElement>()
const imgList = ref([])

const imgWidth = 350

function cal() {
  const containerWidth = containerRef.value!.clientWidth
  const columns = Math.floor(containerWidth / imgWidth)

  /**间隔 */
  const spaceNum = columns + 1
  const leftSpace = containerWidth - columns * imgWidth
  return {
    space: leftSpace / spaceNum,
    columns,
  }
}

function loadMore() {
  http.get('/wallpaper', {}, { animate: false }).then((res) => {
    imgList.value.concat(res.data)
    createImgs()
  })
}
let timer2

function createImgs() {
  let loadedCount = 0
  const totalImages = imgList.value.length
  imgList.value.map((i) => {
    const img = document.createElement('img')
    img.className = 'img-item'
    img.style.width = imgWidth + 'px'
    img.loading = 'lazy'
    const src = `http://localhost:2333/static/hotPic/${i}`
    img.src = `https://th.wallhaven.cc/small/6d/6d6kq6.jpg`
    img.setAttribute('data-src', src)

    img.onload = () => {
      img.addEventListener('click', () => viewImg(img.src))
      // loadedCount++
      // if (loadedCount === totalImages) {
      //   setPosition()
      // }
      setPosition()
    }
    const observer = new IntersectionObserver((entries) => {
      // 可见性变化处理
      entries.forEach((entry) => {
        /** 元素可见*/
        if (entry.isIntersecting) {
          img.src = img.getAttribute('data-src')
          observer.unobserve(img)
        } else {
        }
      })
    })
    observer.observe(img)

    containerRef.value?.appendChild(img)
    const element = document.getElementById('test') // 你的元素ID
    const threshold = 0 // 设置距离底部多远时触发事件，0表示当滚动条滑动到底部时触发

    element.addEventListener('scroll', () => {
      if (element.scrollHeight - element.scrollTop <= element.clientHeight + threshold) {
        if (timer2) {
          clearTimeout(timer2)
        }
        timer2 = setTimeout(() => {
          // 元素滚动到了底部
          // 在这里执行你需要的操作
          loadMore()
        }, 200)
      }
    })
  })
}

function setPosition() {
  const { space, columns } = cal()
  const nextTops = Array(columns).fill(0)
  for (let i = 0; i < containerRef.value!.children.length; i++) {
    const img = containerRef.value!.children[i] as HTMLImageElement
    // 找到nextTops中的最小值作为当前图片的纵坐标
    const minTop = Math.min.apply(null, nextTops)
    img.style.top = minTop + 'px'
    // 重新设置这个数组对应索引的值
    const index = nextTops.indexOf(minTop)
    nextTops[index] += space + img.height
    // 横坐标
    const left = index * imgWidth + (index + 1) * space
    img.style.left = left + 'px'
  }

  const max = Math.max.apply(null, nextTops)

  containerRef.value!.style.height = max + 'px'
}

let timer

onMounted(() => {
  http.get('/wallpaper').then((res) => {
    imgList.value = res.data
    createImgs()
  })

  window.addEventListener('resize', () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(setPosition, 200)
  })
})
</script>
<style lang="scss" scoped>
:deep(.img-item) {
  @apply absolute cursor-pointer;
  transition: 0.3s;
}
</style>
