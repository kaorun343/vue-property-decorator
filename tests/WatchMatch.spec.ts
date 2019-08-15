import Vue from 'vue'
import { WatchMatch, Watch, Component } from '../src/vue-property-decorator'

describe(WatchMatch, () => {

  const method1 = jest.fn()
  const method2 = jest.fn()

  @Component
  class Test extends Vue {
    expressionA: boolean = false
    expressionB = 0

    @Watch('expressionB')
    @WatchMatch()
    watchExpressionA() {
      method1()
    }

    @WatchMatch({ immediate: true })
    watchExpressionB() {
      method2()
    }

    @WatchMatch()
    noMatch() {
      method2();
    }
  }

  const component = new Test()

  beforeAll(() => {
    component.expressionA = true
    component.expressionB = 1;

    jest.clearAllMocks();
  })

  test('defines watch options', () => {
    const watch = component.$options.watch as any
    expect(watch['expressionB']).toHaveLength(2)

    expect(watch['expressionB'][0].handler).toBe('watchExpressionA')
    expect(watch['expressionB'][1].handler).toBe('watchExpressionB')
    expect(watch['expressionB'][1].immediate).toBe(true)
  })

  test('watch handlers are called', () => {
    expect(method1).toHaveBeenCalledTimes(2)
    expect(method2).toHaveBeenCalled()
  })

  test('does not add watcher if method name does not match', () => {
    const watch = component.$options.watch as any
    expect(watch['noMatch']).toBeUndefined()
  })
})
