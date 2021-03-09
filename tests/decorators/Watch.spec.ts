import { mount, VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
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

  describe('when multiple child components have the same watch event name', () => {
    const watcher1 = jest.fn()
    const watcher2 = jest.fn()
    const watcher3 = jest.fn()

    class ChildComponent1 extends Vue {
      target = 30

      @Watch('target')
      handle(...args: any[]) {
        watcher1(...args)
      }

      render() {
        return h('div')
      }
    }

    class ChildComponent2 extends Vue {
      target = 30

      @Watch('target')
      handle(...args: any[]) {
        watcher2(...args)
      }

      render() {
        return h('div')
      }
    }

    class ChildComponent3 extends Vue {
      target = 30

      @Watch('target')
      handle(...args: any[]) {
        watcher3(...args)
      }

      render() {
        return h('div')
      }
    }

    class ParentComponent extends Vue {
      $refs!: {
        child1: ChildComponent1
        child2: ChildComponent2
        child3: ChildComponent3
      }

      render() {
        return h('div', null, [
          h(ChildComponent1, { ref: 'child1' }),
          h(ChildComponent2, { ref: 'child2' }),
          h(ChildComponent3, { ref: 'child3' }),
        ])
      }
    }

    let wrapper: VueWrapper<ParentComponent>

    beforeEach(() => {
      wrapper = mount(ParentComponent)
    })

    describe('child component 1', () => {
      it('triggers watch event once at each child component', async () => {
        wrapper.vm.$refs.child1.target += 10
        await wrapper.vm.$nextTick()
        expect(watcher1).toHaveBeenCalledTimes(1)
        expect(watcher2).toHaveBeenCalledTimes(0)
        expect(watcher3).toHaveBeenCalledTimes(0)
      })
    })

    describe('child component 2', () => {
      it('triggers watch event once at each child component', async () => {
        wrapper.vm.$refs.child2.target += 10
        await wrapper.vm.$nextTick()
        expect(watcher1).toHaveBeenCalledTimes(0)
        expect(watcher2).toHaveBeenCalledTimes(1)
        expect(watcher3).toHaveBeenCalledTimes(0)
      })
    })

    describe('child component 3', () => {
      it('triggers watch event once at each child component', async () => {
        wrapper.vm.$refs.child3.target += 10
        await wrapper.vm.$nextTick()
        expect(watcher1).toHaveBeenCalledTimes(0)
        expect(watcher2).toHaveBeenCalledTimes(0)
        expect(watcher3).toHaveBeenCalledTimes(1)
      })
    })
  })
})
