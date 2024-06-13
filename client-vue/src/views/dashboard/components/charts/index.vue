<template>
  <main>
    <section class="flex gap-2">
      <div ref="chart1Ref" style="width: 100%; height: 500px"></div>
      <div ref="chart2Ref" style="width: 100%; height: 500px"></div>
    </section>
  </main>
</template>
<script lang="ts" setup>
import { http } from '@/http'

import useECharts from '@/hooks/useECharts'
const chart1Ref = ref(null)
const chart2Ref = ref(null)

const { data } = await http.get('/computer', {}, { animate: false })
const options = (data) => {
  return {
    title: {
      text: `总内存\n\n${data.totalMemory}GB`,
      left: 'center',
      top: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '内存',
        type: 'pie',
        radius: ['30%', '80%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          formatter: function (e) {
            let data = e.data
            if (data.value == 0) {
              data.labelLine.show = false
              data.label.show = false
            } else {
              return `${data.name}:${e.value}GB`
            }
          },
        },
        data: [
          // { value: parseFloat(data.totalMemory), name: '总内存' },
          { value: parseFloat(data.usedMemory), name: '已使用内存' },
          { value: parseFloat(data.freeMemory), name: '剩余内存' },
        ],
      },
    ],
  }
}

let timer1 = null
let timer2 = null
useECharts(chart1Ref, options(data), (instance) => {
  if (document.visibilityState == 'visible') {
    timer1 = setInterval(async () => {
      const { data } = await http.get('/computer', {}, { animate: false })
      instance.setOption(options(data))
    }, 5000)
  }
})
useECharts(chart2Ref, options(data), (instance) => {
  if (document.visibilityState == 'visible') {
    timer2 = setInterval(async () => {
      const { data } = await http.get('/computer', {}, { animate: false })
      instance.setOption(options(data))
    }, 5000)
  }
})
onUnmounted(() => {
  clearInterval(timer1)
  clearInterval(timer2)
  timer1 = null
  timer2 = null
})
</script>
<style lang="scss" scoped></style>
