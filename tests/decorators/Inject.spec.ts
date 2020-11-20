import Vue from 'vue'
import Component from 'vue-class-component'
import { Inject } from '../../src/decorators/Inject'

describe(Inject, () => {
  describe('when inject key is given', () => {
    const injectKey = Symbol()
    const value = 'PROVIDED_VALUE'

    @Component({
      provide() {
        return {
          [injectKey]: value,
        }
      },
    })
    class ParentComponent extends Vue {}

    @Component
    class ChildComponent extends Vue {
      @Inject(injectKey) foo!: string
    }

    const component = new ChildComponent({ parent: new ParentComponent() })

    test('injects provided value', () => {
      expect(component.foo).toBe(value)
    })
  })

  describe('when inject key is not given', () => {
    const propertyName = 'PROPERTY_NAME'
    const value = 'PROVIDED_VALUE'

    @Component({
      provide() {
        return {
          [propertyName]: value,
        }
      },
    })
    class ParentComponent extends Vue {}

    @Component
    class ChildComponent extends Vue {
      @Inject() [propertyName]!: string
    }

    const component = new ChildComponent({ parent: new ParentComponent() })

    test('injects provided value', () => {
      expect(component[propertyName]).toBe(value)
    })
  })

  describe('when default value is given', () => {
    const value = 'DEFAULT_VALUE'

    @Component
    class ChildComponent extends Vue {
      @Inject({ from: 'notFound', default: value }) optional!: string
    }

    const component = new ChildComponent()

    test('injects default value', () => {
      expect(component.optional).toBe(value)
    })
  })
})
