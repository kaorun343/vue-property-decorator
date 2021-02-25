import { mount, VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import { Vue } from 'vue-class-component'
import { Watch } from '../../src/decorators/Watch'

describe(Watch, () => {
  const onChange = jest.fn()
  const WATCH_PATH = 'WATCH_PATH'
  const INITIAL_VALUE = 'INITIAL_VALUE'
  const UPDATED_VALUE = 'UPDATED_VALUE'

  describe('without watch options', () => {
    class MyComponent extends Vue {
      [WATCH_PATH] = INITIAL_VALUE

      @Watch(WATCH_PATH)
      onChange(value: string, oldValue: string) {
        onChange(value, oldValue)
      }

      @Watch(WATCH_PATH)
      onChangeAnother() {}

      render() {
        return h('div')
      }
    }

    let wrapper: VueWrapper<MyComponent>

    beforeEach(() => {
      wrapper = mount(MyComponent)
    })

    it('sets options correctly', () => {
      expect(wrapper.vm.$options.watch).toMatchInlineSnapshot(`
        Object {
          "WATCH_PATH": Array [
            Object {
              "handler": "onChange",
            },
            Object {
              "handler": "onChangeAnother",
            },
          ],
        }
      `)
    })

    it('does not call on mounted', () => {
      expect(onChange).toHaveBeenCalledTimes(0)
    })

    it('calls onChange after value is changed', async () => {
      wrapper.vm[WATCH_PATH] = UPDATED_VALUE
      await wrapper.vm.$nextTick()
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('calls onChange with new value and old value', async () => {
      wrapper.vm[WATCH_PATH] = UPDATED_VALUE
      await wrapper.vm.$nextTick()
      expect(onChange).toHaveBeenCalledWith(UPDATED_VALUE, INITIAL_VALUE)
    })
  })

  describe('with watch options', () => {
    class MyComponent extends Vue {
      [WATCH_PATH] = INITIAL_VALUE

      @Watch(WATCH_PATH, { deep: true, immediate: true, flush: 'post' })
      onChange(value: string, oldValue: string) {
        onChange(value, oldValue)
      }

      render() {
        return h('div')
      }
    }

    let wrapper: VueWrapper<MyComponent>

    beforeEach(() => {
      wrapper = mount(MyComponent)
    })

    it('sets options correctly', () => {
      expect(wrapper.vm.$options.watch).toMatchInlineSnapshot(`
        Object {
          "WATCH_PATH": Array [
            Object {
              "deep": true,
              "flush": "post",
              "handler": "onChange",
              "immediate": true,
            },
          ],
        }
      `)
    })
  })
})
