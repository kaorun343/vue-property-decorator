import Vue from 'vue'
import { Provide, Component, Inject } from '../src/vue-property-decorator'

describe(Provide, () => {
  describe('when key is not given', () => {
    const value = 'VALUE'

    @Component
    class ParentComponent extends Vue {
      @Provide() one = value
    }

    @Component
    class ChildComponent extends Vue {
      @Inject() one!: string
    }

    const component = new ChildComponent({ parent: new ParentComponent() })

    test('provides value', () => {
      expect(component.one).toBe(value)
    })
  })

  describe('when key is given', () => {
    const key = 'KEY'
    const value = 'VALUE'

    @Component
    class ParentComponent extends Vue {
      @Provide(key) eleven = value
    }

    @Component
    class ChildComponent extends Vue {
      @Inject(key) one!: string
    }

    const component = new ChildComponent({ parent: new ParentComponent() })

    test('provides value', () => {
      expect(component.one).toBe(value)
    })
  })
})
