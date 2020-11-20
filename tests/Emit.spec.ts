import Vue from 'vue'
import { Emit, Component } from '../src'

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

  describe('when multiple arguments is given', () => {
    @Component
    class ChildComponent extends Vue {
      count = 0

      @Emit() increment(n1: number, n2: number) {
        this.count += n1 + n2
      }
    }

    const child = new ChildComponent()
    const mockFn = jest.fn()
    child.$emit = mockFn

    const value1 = 30
    const value2 = 40

    beforeAll(() => {
      child.increment(value1, value2)
    })

    test('call $emit method', () => {
      expect(mockFn).toHaveBeenCalled()
    })

    test('emit event with method name', () => {
      expect(mockFn.mock.calls[0][0]).toBe('increment')
    })

    test('emit event with multiple arguments', () => {
      expect(mockFn.mock.calls[0][1]).toBe(value1)
      expect(mockFn.mock.calls[0][2]).toBe(value2)
    })
  })

  describe('when the value is returned and multiple arguments is given', () => {
    @Component
    class ChildComponent extends Vue {
      count = 0

      @Emit() increment(n1: number, n2: number) {
        return n1 + n2;
      }
    }

    const child = new ChildComponent()
    const mockFn = jest.fn()
    child.$emit = mockFn

    const value1 = 30
    const value2 = 40

    beforeAll(() => {
      child.increment(value1, value2)
    })

    test('call $emit method', () => {
      expect(mockFn).toHaveBeenCalled()
    })

    test('emit event with method name', () => {
      expect(mockFn.mock.calls[0][0]).toBe('increment')
    })

    test('emit event with multiple arguments', () => {
      expect(mockFn.mock.calls[0][1]).toBe(value1 + value2)
      expect(mockFn.mock.calls[0][2]).toBe(value1)
      expect(mockFn.mock.calls[0][3]).toBe(value2)
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
