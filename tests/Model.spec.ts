import Vue from 'vue'
import { Model, Component } from '../src/vue-property-decorator'

describe(Model, () => {
  @Component
  class TestComponent extends Vue {
    @Model('change', Boolean) checked!: boolean
  }

  const { $options } = new TestComponent()

  test('define model option correctly', () => {
    expect($options.model).toEqual({ prop: 'checked', event: 'change' })
  })

  test('define props option correctly', () => {
    const props = ($options.props as any) as Record<string, any>
    expect(props!['checked']).toEqual({ type: Boolean })
  })
})
