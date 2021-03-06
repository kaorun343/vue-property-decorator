import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { Vue } from 'vue-class-component'
import { Emit } from '../../src/decorators/Emit'

const mockFn = jest.fn()

describe(Emit, () => {
  describe('when event name is given', () => {
    class ChildComponent extends Vue {
      count = 0

      @Emit('reset') resetCount() {
        this.count = 0
      }

      render() {
        return h('div')
      }
    }

    const ParentComponent = defineComponent({
      render() {
        return h(ChildComponent, { onReset: mockFn, ref: 'child' })
      },
    })

    const mountParentComponet = () => mount(ParentComponent)
    let wrapper: ReturnType<typeof mountParentComponet>
    let child: ChildComponent

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      child = wrapper.vm.$refs['child'] as ChildComponent
      child.resetCount()
    })

    it('adds event name into emits array', () => {
      expect(child.$options.emits).toContain('reset')
    })

    test('emit event with given name', () => {
      expect(mockFn).toHaveBeenCalledWith()
    })
  })

  describe('when arguments are given', () => {
    class ChildComponent extends Vue {
      count = 0

      @Emit() increment(n1: number, n2: number) {
        this.count += n1 + n2
      }

      render() {
        return h('div')
      }
    }

    const ParentComponent = defineComponent({
      render() {
        return h(ChildComponent, { onIncrement: mockFn, ref: 'child' })
      },
    })

    const mountParentComponet = () => mount(ParentComponent)
    let wrapper: ReturnType<typeof mountParentComponet>
    let child: ChildComponent

    const NEW_VALUE1 = 30
    const NEW_VALUE2 = 40

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      child = wrapper.vm.$refs['child'] as ChildComponent
      child.increment(NEW_VALUE1, NEW_VALUE2)
    })

    it('adds event name into emits array', () => {
      expect(child.$options.emits).toContain('increment')
    })

    test('emit event with argument', () => {
      expect(mockFn).toHaveBeenCalledWith(NEW_VALUE1, NEW_VALUE2)
    })
  })

  describe('when the value is returned and arguments are given', () => {
    class ChildComponent extends Vue {
      count = 0

      @Emit() increment(n1: number, n2: number) {
        return n1 + n2
      }

      render() {
        return h('div')
      }
    }

    const ParentComponent = defineComponent({
      render() {
        return h(ChildComponent, { onIncrement: mockFn, ref: 'child' })
      },
    })

    const mountParentComponet = () => mount(ParentComponent)
    let wrapper: ReturnType<typeof mountParentComponet>
    let child: ChildComponent

    const NEW_VALUE1 = 30
    const NEW_VALUE2 = 40

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      child = wrapper.vm.$refs['child'] as ChildComponent
      child.increment(NEW_VALUE1, NEW_VALUE2)
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

    class ChildComponent extends Vue {
      @Emit() promise() {
        return Promise.resolve(VALUE)
      }

      render() {
        return h('div')
      }
    }

    const ParentComponent = defineComponent({
      render() {
        return h(ChildComponent, { onPromise: mockFn, ref: 'child' })
      },
    })

    const mountParentComponet = () => mount(ParentComponent)
    let wrapper: ReturnType<typeof mountParentComponet>
    let child: ChildComponent

    beforeEach(async () => {
      wrapper = mount(ParentComponent)
      child = wrapper.vm.$refs['child'] as ChildComponent
      await child.promise()
    })

    test('emit even with resolved value', () => {
      expect(mockFn).toHaveBeenCalledWith(VALUE)
    })
  })
})
