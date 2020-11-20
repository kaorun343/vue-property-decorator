import Vue from 'vue'
import Component from 'vue-class-component'
import { InjectReactive } from '../../src/decorators/InjectReactive'
import { ProvideReactive } from '../../src/decorators/ProvideReactive'

describe(InjectReactive, () => {
  describe('when inject key is given', () => {
    const injectKey = Symbol()
    const value = 'PROVIDED_VALUE'

    @Component
    class ParentComponent extends Vue {
      @ProvideReactive(injectKey) baz = value
    }

    const parent = new ParentComponent()

    @Component
    class ChildComponent extends Vue {
      @InjectReactive(injectKey) foo!: string
    }

    @Component
    class GrandChildComponent extends Vue {
      @InjectReactive(injectKey) foo!: string
    }

    const child = new ChildComponent({ parent })
    const grandChild = new GrandChildComponent({ parent: child })

    test('injects provided value', () => {
      expect(child.foo).toBe(value)
      expect(grandChild.foo).toBe(value)
    })

    describe('when injected value is changed', () => {
      const updatedValue = 'UPDATED_PROVIDED_VALUE'

      beforeAll(() => {
        parent.baz = updatedValue
      })

      test('reflects updated value', () => {
        expect(child.foo).toBe(updatedValue)
        expect(grandChild.foo).toBe(updatedValue)
      })
    })
  })

  describe('when inject key is not given', () => {
    const propertyName = 'PROPERTY_NAME'
    const value = 'PROVIDED_VALUE'

    @Component
    class ParentComponent extends Vue {
      @ProvideReactive() [propertyName] = value
    }

    const parent = new ParentComponent()

    @Component
    class ChildComponent extends Vue {
      @InjectReactive() [propertyName]: string
    }

    @Component
    class GrandChildComponent extends Vue {
      @InjectReactive() [propertyName]!: string
    }

    const child = new ChildComponent({ parent })
    const grandChild = new GrandChildComponent({ parent: child })

    test('injects provided value', () => {
      expect(child[propertyName]).toBe(value)
      expect(grandChild[propertyName]).toBe(value)
    })
  })

  describe('when default value is given', () => {
    const value = 'DEFAULT_VALUE'

    @Component
    class ChildComponent extends Vue {
      @InjectReactive({ from: 'notFound', default: value }) optional!: string
    }

    @Component
    class GrandChildComponent extends Vue {
      @InjectReactive({ from: 'notFound', default: value }) optional!: string
    }

    const child = new ChildComponent({ parent: new Vue() })
    const grandChild = new GrandChildComponent({ parent: child })

    test('injects default value', () => {
      expect(child.optional).toBe(value)
      expect(grandChild.optional).toBe(value)
    })
  })
})
