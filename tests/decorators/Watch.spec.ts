import { mount, Wrapper } from '@vue/test-utils'
import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import { Watch } from '../../src/decorators/Watch'

describe(Watch, () => {
  const onChange = jest.fn()
  const WATCH_PATH = 'WATCH_PATH'
  const INITIAL_VALUE = 'INITIAL_VALUE'
  const UPDATED_VALUE = 'UPDATED_VALUE'

  describe('without watch options', () => {
    @Component
    class MyComponent extends Vue {
      [WATCH_PATH] = INITIAL_VALUE

      @Watch(WATCH_PATH)
      onChange(value: string, oldValue: string) {
        onChange(value, oldValue)
      }

      @Watch(WATCH_PATH)
      onChangeAnother() {}

      render(h: CreateElement) {
        return h('div')
      }
    }

    let wrapper: Wrapper<MyComponent>

    beforeEach(() => {
      wrapper = mount(MyComponent)
    })

    it('sets options correctly', () => {
      expect(wrapper.vm.$options.watch?.[WATCH_PATH]).toMatchInlineSnapshot(`
        Array [
          Object {
            "handler": "onChange",
            "user": true,
          },
          Object {
            "handler": "onChangeAnother",
            "user": true,
          },
        ]
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
    @Component
    class MyComponent extends Vue {
      [WATCH_PATH] = INITIAL_VALUE

      @Watch(WATCH_PATH, { deep: true, immediate: true })
      onChange(value: string, oldValue: string) {
        onChange(value, oldValue)
      }

      render(h: CreateElement) {
        return h('div')
      }
    }

    let wrapper: Wrapper<MyComponent>

    beforeEach(() => {
      wrapper = mount(MyComponent)
    })

    it('sets options correctly', () => {
      expect(wrapper.vm.$options.watch?.[WATCH_PATH]).toMatchInlineSnapshot(`
        Array [
          Object {
            "deep": true,
            "handler": "onChange",
            "immediate": true,
            "user": true,
          },
        ]
      `)
    })
  })

  describe('when multiple child components have the same watch event name', () => {
    const watcher1 = jest.fn()
    const watcher2 = jest.fn()
    const watcher3 = jest.fn()

    @Component
    class ChildComponent1 extends Vue {
      target = 30

      @Watch('target')
      handle(...args: any[]) {
        watcher1(...args)
      }

      render(h: CreateElement) {
        return h('div')
      }
    }

    @Component
    class ChildComponent2 extends Vue {
      target = 30

      @Watch('target')
      handle(...args: any[]) {
        watcher2(...args)
      }

      render(h: CreateElement) {
        return h('div')
      }
    }

    @Component
    class ChildComponent3 extends Vue {
      target = 30

      @Watch('target')
      handle(...args: any[]) {
        watcher3(...args)
      }

      render(h: CreateElement) {
        return h('div')
      }
    }

    @Component
    class ParentComponent extends Vue {
      $refs!: {
        child1: ChildComponent1
        child2: ChildComponent2
        child3: ChildComponent3
      }

      render(h: CreateElement) {
        return h('div', undefined, [
          h(ChildComponent1, { ref: 'child1' }),
          h(ChildComponent2, { ref: 'child2' }),
          h(ChildComponent3, { ref: 'child3' }),
        ])
      }
    }

    let wrapper: Wrapper<ParentComponent>

    beforeEach(() => {
      wrapper = mount(ParentComponent)
    })

    describe('child component 1', () => {
      it('triggers watch event once at each child component', async () => {
        wrapper.vm.$refs.child1.target += 10
        await Vue.nextTick()
        expect(watcher1).toHaveBeenCalledTimes(1)
        expect(watcher2).toHaveBeenCalledTimes(0)
        expect(watcher3).toHaveBeenCalledTimes(0)
      })
    })

    describe('child component 2', () => {
      it('triggers watch event once at each child component', async () => {
        wrapper.vm.$refs.child2.target += 10
        await Vue.nextTick()
        expect(watcher1).toHaveBeenCalledTimes(0)
        expect(watcher2).toHaveBeenCalledTimes(1)
        expect(watcher3).toHaveBeenCalledTimes(0)
      })
    })

    describe('child component 3', () => {
      it('triggers watch event once at each child component', async () => {
        wrapper.vm.$refs.child3.target += 10
        await Vue.nextTick()
        expect(watcher1).toHaveBeenCalledTimes(0)
        expect(watcher2).toHaveBeenCalledTimes(0)
        expect(watcher3).toHaveBeenCalledTimes(1)
      })
    })
  })
})
