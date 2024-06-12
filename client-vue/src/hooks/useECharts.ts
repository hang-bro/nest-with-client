import * as echarts from 'echarts'
type IOptions = Parameters<echarts.ECharts['setOption']>['0']
type ICb = (instance: IInstance) => void
type IInstance = echarts.ECharts

export default function useECharts(chartContainer: Ref<HTMLElement>, options: IOptions, cb?: ICb) {
  const instance = ref<IInstance>(null)

  onMounted(() => {
    // 初始化 ECharts 实例
    instance.value = echarts.init(chartContainer.value)
    // 设置 ECharts 配置项
    instance.value.setOption(options)

    // 监听窗口大小变化，自动调整图表大小
    window.addEventListener('resize', () => instance.value.resize())
    cb(instance.value as IInstance,)
  })

  onUnmounted(() => {
    // 销毁 ECharts 实例
    instance.value.dispose()
    // 移除窗口大小变化监听器
    window.removeEventListener('resize', () => instance.value.resize())
  })

  // 返回 ECharts 实例，以便在外部进行操作
  return instance
}
