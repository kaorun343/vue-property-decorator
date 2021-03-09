import { mount, Wrapper } from '@vue/test-utils'
import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import { Emit } from '../../src/decorators/Emit'

const mockFn = jest.fn()

describe(Emit, () => {
  describe('when event name is given', () => {
    @Component
    class ChildComponent extends Vue {
      count = 0

      @Emit('reset') resetCount() {
        this.count = 0
      }

      render(h: CreateElement) {
        return h('div')
      }
    }

    @Component
    class ParentComponent extends Vue {
      $refs!: { child: ChildComponent }
      render(h: CreateElement) {
        return h(ChildComponent, { on: { reset: mockFn }, ref: 'child' })
      }
    }

    let wrapper: Wrapper<ParentComponent>

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      wrapper.vm.$refs.child.resetCount()
    })

    test('call $emit method', () => {
      expect(mockFn).toHaveBeenCalled()
    })

    test('emit event with given name', () => {
      expect(mockFn).toHaveBeenCalledWith()
    })
  })

  describe('when arguments are given', () => {
    @Component
    class ChildComponent extends Vue {
      count = 0

      @Emit() increment(n1: number, n2: number) {
        this.count += n1 + n2
      }

      render(h: CreateElement) {
        return h('div')
      }
    }

    @Component
    class ParentComponent extends Vue {
      $refs!: { child: ChildComponent }
      render(h: CreateElement) {
        return h(ChildComponent, { on: { increment: mockFn }, ref: 'child' })
      }
    }

    let wrapper: Wrapper<ParentComponent>

    const NEW_VALUE1 = 30
    const NEW_VALUE2 = 40

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      wrapper.vm.$refs.child.increment(NEW_VALUE1, NEW_VALUE2)
    })

    test('emit event with multiple arguments', () => {
      expect(mockFn).toHaveBeenCalledWith(NEW_VALUE1, NEW_VALUE2)
    })
  })

  describe('when the value is returned and multiple arguments is given', () => {
    @Component
    class ChildComponent extends Vue {
      count = 0

      @Emit() increment(n1: number, n2: number) {
        return n1 + n2
      }

      render(h: CreateElement) {
        return h('div')
      }
    }

    @Component
    class ParentComponent extends Vue {
      $refs!: { child: ChildComponent }
      render(h: CreateElement) {
        return h(ChildComponent, { on: { increment: mockFn }, ref: 'child' })
      }
    }

    let wrapper: Wrapper<ParentComponent>

    const NEW_VALUE1 = 30
    const NEW_VALUE2 = 40

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      wrapper.vm.$refs.child.increment(NEW_VALUE1, NEW_VALUE2)
    })

    test('emit event with multiple arguments', () => {
      expect(mockFn).toHaveBeenCalledWith(
        NEW_VALUE1 + NEW_VALUE2,
        NEW_VALUE1,
        NEW_VALUE2,
      )
    })
  })

  describe('when promise has been returned', () => {
    const VALUE = 10

    @Component
    class ChildComponent extends Vue {
      @Emit() promise() {
        return Promise.resolve(VALUE)
      }

      render(h: CreateElement) {
        return h('div')
      }
    }

    @Component
    class ParentComponent extends Vue {
      $refs!: { child: ChildComponent }
      render(h: CreateElement) {
        return h(ChildComponent, { on: { promise: mockFn }, ref: 'child' })
      }
    }

    let wrapper: Wrapper<ParentComponent>

    beforeEach(async () => {
      wrapper = mount(ParentComponent)
      await wrapper.vm.$refs.child.promise()
    })

    test('call $emit method', () => {
      expect(mockFn).toHaveBeenCalled()
    })

    test('emit even with resolved value', () => {
      expect(mockFn).toHaveBeenCalledWith(VALUE)
    })
  })
})
