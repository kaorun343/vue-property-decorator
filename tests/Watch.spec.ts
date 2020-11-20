import Vue from 'vue'
import { Watch, Component } from '../src'

describe(Watch, () => {
  const expressionA = 'EXPRESSION_A'
  const expressionB = 'EXPRESSION_B'

  const method1 = jest.fn()
  const method2 = jest.fn()

  @Component
  class Test extends Vue {
    [expressionB] = false

    @Watch(expressionA)
    @Watch(expressionB, { immediate: true })
    method1() {
      method1()
    }

    @Watch(expressionB, { immediate: true })
    method2() {
      method2()
    }
  }

  const component = new Test()

  beforeAll(() => {
    component[expressionB] = true
  })

  test('defines watch options', () => {
    const watch = component.$options.watch as any
    expect(watch[expressionA]).toHaveLength(1)
    expect(watch[expressionB]).toHaveLength(2)

    expect(watch[expressionA][0].handler).toBe('method1')
    expect(watch[expressionB][1].immediate).toBe(true)
  })

  test('watch handlers are called', () => {
    expect(method1).toHaveBeenCalled()
    expect(method2).toHaveBeenCalled()
  })
})
