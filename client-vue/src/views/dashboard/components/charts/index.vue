<template>
  <main>
    <div>
      <p>操作系统: {{ data.system }}</p>
      <p>架构: {{ data.architecture }}</p>
      <p>CPU核数: {{ data.cpus }}</p>
    </div>
    <div ref="chart1Ref" style="width: 100%; height: 400px"></div>
  </main>
</template>
<script lang="ts" setup>
import { http } from '@/http'
import useECharts from '@/hooks/useECharts'
const chart1Ref = ref(null)

const { data } = await http.get('/computer', {}, { animate: false })
const options = (data) => {
  return {
    title: {
      text: '内存使用情况',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '内存',
        type: 'pie',
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
          { value: parseFloat(data.totalMemory), name: '总内存' },
          { value: parseFloat(data.usedMemory), name: '已使用内存' },
          { value: parseFloat(data.freeMemory), name: '剩余内存' },
        ],
      },
    ],
  }
}

let timer = null
useECharts(chart1Ref, options(data), (instance) => {
  timer = setInterval(async () => {
    const { data } = await http.get('/computer', {}, { animate: false })
    instance.setOption(options(data))
  }, 5000)
})
onUnmounted(() => {
  clearInterval(timer)
  timer = null
})
</script>
<style lang="scss" scoped></style>
