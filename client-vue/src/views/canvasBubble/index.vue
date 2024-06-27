<template>
  <main class="w-full h-full">
    <canvas id="canvas" width="1920" height="1000"></canvas>
    <!-- 不建议使用css控制常宽，因为如果设置的宽高与初始比例 300:150 不同，有可能出现扭曲的现象 -->
    <!-- 假如浏览器不支持canvas可以直接 <canvas>您的浏览器不支持canvas</canvas> 浏览器会渲染替代内容 -->
  </main>
</template>
<script lang="ts" setup>
class Bubble {
  colorList: any[]
  bubbleList: any[]
  ctx: CanvasRenderingContext2D
  constructor(ctx: HTMLCanvasElement) {
    this.colorList = Array(20)
      .fill({})
      .map(() => this.randomColor())
    this.ctx = ctx.getContext('2d')
    this.bubbleList = [] // 气泡数组
    this.start()
  }

  randomColor(alpha = true) {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    const a = alpha ? Math.random().toFixed(2) : 1

    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  randomInt(x: number, y: number) {
    return Math.floor(Math.random() * (y - x + 1)) + x
  }

  /**
   * 创建气泡
   */
  createBubble() {
    // 新气泡
    if (this.randomInt(0, 50)) return // 控制生成气泡的数量
    const { height, width } = this.ctx.canvas
    var circle: any = {} // 定义一个新的气泡对象
    circle.r = this.randomInt(10, 50) // 随机半径
    circle.x = this.randomInt(0, width) // 初始化气泡X坐标
    circle.xMoveSpeed = this.randomInt(-10, 10) // X方向移动速度以及方向
    circle.y = height + circle.r // 初始化气泡Y坐标
    circle.yMoveSpeed = this.randomInt(5, 10) // Y方向的移动速度
    circle.color = this.colorList[this.randomInt(0, this.colorList.length - 1)] // 获取气泡颜色
    this.bubbleList.push(circle) // 将对象放入数组
  }

  destroyCircle() {
    // 销毁气泡
    this.bubbleList.forEach((v, i) => {
      if (v.y < -v.r) this.bubbleList.splice(i, 1) // 气泡超过上边界就销毁气泡对象
    })
  }

  draw() {
    // 绘制气泡
    this.createBubble() // 调用产生新气泡
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height) // 清空画布
    this.ctx.save() // 保存画布状态
    this.bubbleList.forEach((bubble) => {
      const { color, r, x, y, xMoveSpeed, yMoveSpeed } = bubble
      this.ctx.beginPath() // 起始一条路径
      this.ctx.fillStyle = color // 设置背景颜色
      this.ctx.strokeStyle = color // 设置边线颜色
      this.ctx.arc(x, y, r, 0, Math.PI * 2) // 绘制圆 x坐标 y坐标 半径 起始角度 结束角度 顺/逆时针绘制
      this.ctx.fill() // 绘制填充
      this.ctx.stroke() // 绘制边线
      bubble.y -= yMoveSpeed * 0.3 // Y轴移动
      bubble.x += xMoveSpeed * 0.05 // X轴移动
    })
    this.ctx.restore() // 恢复画布状态
    this.destroyCircle() // 销毁气泡
    requestAnimationFrame(() => {
      this.draw()
    }) // 递归调用
  }

  start() {
    requestAnimationFrame(() => this.draw())
  }
}

onMounted(() => {
  new Bubble(document.getElementById('canvas') as HTMLCanvasElement) // 实例化Bubble
})
</script>
<style lang="scss" scoped>
#canvas {
  border: 1px solid #eee;
}
</style>
