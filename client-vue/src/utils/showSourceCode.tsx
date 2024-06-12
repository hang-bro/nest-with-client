import { ElButton, ElDialog } from 'element-plus'
import '@/assets/css/sourceCode.scss'
import prims from 'prismjs'
import Code from '@/components/code/index.vue'

const App: globalThis.Component = {
  props: {
    destroy: Function,
    codePath: String,
  },
  mounted() {
    nextTick(() => prims.highlightAll())
  },
  render({ $props }) {
    const show = ref(true)

    const destroy = () => $props.destroy()

    const sourceCode = computed(() => {
      const allFiles = import.meta.glob(['@/directives/**', '@/components/**'], {
        eager: true,
        as: 'raw',
      })
      return allFiles[$props.codePath] || '```代码地址不存在```'
    })

    return (
      <>
        <ElDialog
          modalClass="source-code-dialog"
          alignCenter
          beforeClose={destroy}
          modelValue={show.value}
          width={900}
        >
          {{
            header: () => (
              <div>
                代码地址:<span class="font-bold ml-5">{$props.codePath}</span>
              </div>
            ),
            footer: () => (
              <div class="dialog-footer">
                <ElButton onClick={destroy} type="danger">
                  关闭
                </ElButton>
              </div>
            ),
            default: () => (
              <>
                <section class="code-area overflow-auto no-scroll">
                  <Code html={sourceCode.value} language="ts" />
                </section>
              </>
            ),
          }}
        </ElDialog>
      </>
    )
  },
}

type IConfig = {
  closeOnClickModel?: boolean
  closeOnPressEscape?: boolean
}
export default (codePath: string, config?: IConfig) => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const app = createApp(App, {
    codePath,
    destroy: () => {
      app.unmount()
      div.remove()
    },
    ...config,
  })

  app.mount(div)

  // return () => app.unmount()
}
