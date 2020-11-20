import 'reflect-metadata'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from '../../src/decorators/Prop'

describe(Prop, () => {
  describe('when constructor is given', () => {
    const propertyName = 'PROPERTY_NAME'

    @Component
    class Test extends Vue {
      @Prop(Number) [propertyName]!: number
    }

    const value = 10
    const component = new Test({ propsData: { [propertyName]: value } })

    test('defines prop option', () => {
      const props = component.$options.props as any
      expect(props[propertyName]).toEqual({ type: Number })
    })

    test('component recieves prop', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when default value is given', () => {
    const propertyName = 'PROPERTY_NAME'
    const value = 'DEFAULT_VALUE'

    @Component
    class Test extends Vue {
      @Prop({ default: value }) [propertyName]!: string
    }

    const component = new Test()

    test('defines prop option', () => {
      const props = component.$options.props as any
      expect(props[propertyName]).toEqual({ type: String, default: value })
    })

    test('component uses default value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when no value is given', () => {
    const propertyName = 'PROPERTY_NAME'

    @Component
    class Test extends Vue {
      @Prop() [propertyName]!: boolean
    }

    const component = new Test()

    test('defines prop option', () => {
      const props = component.$options.props as any
      expect(props[propertyName]).toEqual({ type: Boolean })
    })
  })
})
