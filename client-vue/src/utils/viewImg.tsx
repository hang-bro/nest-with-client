import '@/assets/css/viewImg.module.scss'
import { Transition, computed, nextTick, reactive } from 'vue'

const App: globalThis.Component = {
  props: {
    destroy: Function,
    url: [String, Array],
    closeOnClickModel: {
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
  },
  render({ $props }) {
    const state = reactive({
      /**缩放 */
      scale: 1,
      /**旋转角度 */
      rotate: 0,
      /** */
      imgUrl: '',
      /**索引值 */
      index: 0,
    })

    state.imgUrl = $props.url

    const imgStyle = computed(() => ({
      transform: `scale(${state.scale}) rotate(${state.rotate}deg)`,
    }))

    const close = () => $props.destroy()

    const reset = () => {
      state.rotate = 0
      state.scale = 1
    }

    /**添加相关监听事件 */
    const addEvent = (e: Event) => {
      e.target.addEventListener('wheel', (e: WheelEvent) => {
        //缩小
        if (e.deltaY > 0) {
          state.scale > 0.2 ? (state.scale -= 0.1) : '' //此处进行最小缩放限制  否则会造成图片不存在 和其他bug
        } /**放大*/ else {
          state.scale += 0.2
        }
      })
    }

    nextTick(() => {
      reset()
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
    })

    return (
      <>
        <Transition mode="out-in">
          <div class="z-[999] bg-black bg-opacity-30 cursor-pointer flex flex-col items-center justify-center absolute top-0 w-full h-screen overflow-hidden">
            <div
              class="absolute w-full h-full top-0 left-0 opacity-50 bg-black"
              onClick={() => $props.closeOnClickModel && close()}
            ></div>
            <div class="p-6 absolute z-[2] bottom-[40px] bg-black bg-opacity-30 rounded-[10px]">
              <button onClick={() => (state.scale += 0.1)} class="hang i-bigger !text-3xl"></button>
              <button
                onClick={() => (state.scale > 0.2 ? (state.scale -= 0.1) : '')}
                class="hang i-smaller !text-3xl"
              ></button>
              <button
                onClick={() => (state.rotate -= 90)}
                class="hang i-xiangzuoxuanzhuan !text-3xl"
              ></button>
              <button onClick={() => (state.rotate += 90)} class="hang i-rotate !text-3xl"></button>
              <button onClick={() => close()} class="hang i-close !text-3xl"></button>
            </div>
            {!Array.isArray($props.url) && (
              <img
                class="cursor-pointer z-[1] max-h-full  duration-500 ease-in-out"
                style={imgStyle.value}
                src={$props.url}
                alt=""
                onLoad={addEvent}
              />
            )}
            {Array.isArray($props.url) && (
              <>
                <img
                  class="cursor-pointer z-[1] max-h-full  duration-500 ease-in-out"
                  style={imgStyle.value}
                  src={state.imgUrl[state.index]}
                  alt=""
                  onLoad={addEvent}
                />
                <div
                  class="absolute z-[2] p-3 left-2 bg-black/20 text-white hang i-left !text-3xl"
                  onClick={() => {
                    reset()
                    if (state.index > 0) {
                      state.index -= 1
                    } else {
                      state.index = state.imgUrl.length - 1
                    }
                  }}
                ></div>
                <div
                  class="absolute z-[2] p-3 right-2 bg-black/20 text-white hang i-next !text-3xl"
                  onClick={() => {
                    reset()
                    if (state.index < state.imgUrl.length - 1) {
                      state.index += 1
                    } else {
                      state.index = 0
                    }
                  }}
                ></div>
              </>
            )}
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
export default (url: string | string[], config?: IConfig) => {
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
