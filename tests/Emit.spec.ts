import Vue from 'vue'
import { Emit, Component } from '../src/vue-property-decorator'

describe(Emit, () => {
  describe('when event name is given', () => {
    @Component
    class ChildComponent extends Vue {
      count = 0

      @Emit('reset') resetCount() {
        this.count = 0
      }
    }

    const child = new ChildComponent()
    const mockFn = jest.fn()
    child.$emit = mockFn

    beforeAll(() => {
      child.resetCount()
    })

    test('call $emit method', () => {
      expect(mockFn).toHaveBeenCalled()
    })

    test('emit event with given name', () => {
      expect(mockFn.mock.calls[0][0]).toBe('reset')
    })
  })

  describe('when argument is given', () => {
    @Component
    class ChildComponent extends Vue {
      count = 0

      @Emit() increment(n: number) {
        this.count += n
      }
    }

    const child = new ChildComponent()
    const mockFn = jest.fn()
    child.$emit = mockFn

    const value = 30

    beforeAll(() => {
      child.increment(value)
    })

    test('call $emit method', () => {
      expect(mockFn).toHaveBeenCalled()
    })

    test('emit event with method name', () => {
      expect(mockFn.mock.calls[0][0]).toBe('increment')
    })

    test('emit event with argument', () => {
      expect(mockFn.mock.calls[0][1]).toBe(value)
    })
  })

  describe('when promise has been returned', () => {
    const value = 10

    @Component
    class ChildComponent extends Vue {
      @Emit() promise() {
        return Promise.resolve(value)
      }
    }

    const child = new ChildComponent()
    const mockFn = jest.fn()
    child.$emit = mockFn

    beforeAll(async () => {
      await child.promise()
    })

    test('call $emit method', () => {
      expect(mockFn).toHaveBeenCalled()
    })

    test('emit event with method name', () => {
      expect(mockFn.mock.calls[0][0]).toBe('promise')
    })

    test('emit even with resolved value', () => {
      expect(mockFn.mock.calls[0][1]).toBe(value)
    })
  })
})
