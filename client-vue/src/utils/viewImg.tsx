import '@/assets/css/viewImg.module.scss'
import { Transition, computed, nextTick, reactive, ref } from 'vue'
type IProp = {
  /**图片地址 */
  url: string | string[]
  /**是否可以通过点击 遮罩 关闭   默认true */
  closeOnClickModel?: boolean
  destroy: Function
}
const App: globalThis.Component = {
  props: {
    destroy: Function,
    url: String,
    closeOnClickModel: {
      type: Boolean,
      default: false,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false,
    },
  },
  render({ $props }) {
    const imgRef = ref<HTMLElement>()
    const state = reactive({
      imgUrl: '' as any,
      /**是否可以通过点击 遮罩 关闭   默认true */
      closeOnClickModel: true,
    })
    const transform = reactive({
      scale: 1,
      rotate: 0,
    })

    const imgStyle = computed(() => ({
      transform: `scale(${transform.scale}) rotate(${transform.rotate}deg)`,
    }))

    const close = () => $props.destroy()

    const reset = () => {
      transform.rotate = 0
      transform.scale = 1
    }

    /**添加相关监听事件 */
    const addEvent = () => {
      /**
       * 监听 ESC 键盘事件
       */
      document.onkeydown = (e: KeyboardEvent) => {
        //此处填写你的业务逻辑即可
        if (e.key === 'Escape') {
          //移除监听
          document.onkeydown = null
          $props.closeOnPressEscape && close()
        }
      }
      //不使用nextTick会造成获取不到imgRef.value
      nextTick(() => {
        // 图片加载完成回调函数
        imgRef.value.onload = () => {
          // 添加鼠标滚动事件
          imgRef.value.addEventListener('wheel', (e: WheelEvent) => {
            if (e.deltaY > 0) {
              //缩小
              transform.scale > 0.2 ? (transform.scale -= 0.1) : '' //此处进行最小缩放限制  否则会造成图片不存在 和其他bug
            } else {
              //放大
              transform.scale += 0.2
            }
          })
        }
      })
    }

    const open = (prop: IProp) => {
      const { url, closeOnClickModel } = prop

      state.imgUrl = url
      //判断传入参数是否启用 closeOnClickModel
      if (closeOnClickModel === false) state.closeOnClickModel = closeOnClickModel

      reset()
      addEvent()
    }
    open($props)

    return (
      <>
        <Transition mode="out-in">
          <div class="z-[999] bg-black bg-opacity-30 cursor-pointer flex flex-col items-center justify-center absolute top-0 w-full h-screen overflow-hidden">
            <div
              class="absolute w-full h-full top-0 left-0 opacity-50 bg-black"
              onClick={() => state.closeOnClickModel && close()}
            ></div>
            <div class="p-5 absolute z-[2] bottom-[40px] bg-black bg-opacity-30 rounded-[10px]">
              <button onClick={() => (transform.scale += 0.1)} class="hang i-bigger !text-2xl"></button>
              <button
                onClick={() => (transform.scale > 0.2 ? (transform.scale -= 0.1) : '')}
                class="hang i-smaller !text-2xl"
              ></button>
              <button onClick={() => (transform.rotate += 90)} class="hang i-rotate !text-2xl"></button>
              <button onClick={() => close()} class="hang i-close !text-2xl"></button>
            </div>
            <img
              class="cursor-pointer z-[1] w-4/5 duration-500 ease-in-out"
              ref={imgRef}
              style={imgStyle.value}
              src={state.imgUrl}
              alt=""
            />
          </div>
        </Transition>
      </>
    )
  },
}

type IConfig = {
  closeOnClickModel?: boolean
  closeOnPressEscape?: boolean
}
export default (url: string, config?: IConfig) => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const app = createApp(App, {
    url,
    destroy: () => {
      app.unmount()
      div.remove()
    },
    ...config,
  })

  app.mount(div)

  // return () => app.unmount()
}
