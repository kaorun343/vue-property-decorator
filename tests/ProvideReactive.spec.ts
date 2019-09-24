import Vue from 'vue'
import {
  Component,
  ProvideReactive,
  InjectReactive,
  Provide
} from '../src/vue-property-decorator'

describe(ProvideReactive, () => {
  describe('when key is not given', () => {
    const value = 'VALUE'

    @Component
    class ParentComponent extends Vue {
      @ProvideReactive() one = value
    }

    @Component
    class ChildComponent extends Vue {
      @InjectReactive() one!: string
    }

    const parent = new ParentComponent()
    const component = new ChildComponent({ parent })

    test('provides value', () => {
      expect(component.one).toBe(value)
    })

    describe('when changed', () => {
      const newValue = 'NEW VALUE'

      beforeAll(() => {
        parent.one = newValue
      })

      test('reflects updates', () => {
        expect(component.one).toBe(newValue)
      })
    })
  })


  describe('is compatible with @Provide()', () => {
    @Component
    class ParentComponent extends Vue {
      @Provide('first') first = 'whatever'
      @ProvideReactive() one = 'one'
    }
    @Component
    class ChildComponent extends Vue {
      @InjectReactive() one!: string
    }

    const parent = new ParentComponent()
    const component = new ChildComponent({ parent })

    test('provides value', () => {
      expect(component.one).toBe('one')
    })
  })


  describe('when key is given', () => {
    const key = 'KEY'
    const value = 'VALUE'

    @Component
    class ParentComponent extends Vue {
      @ProvideReactive(key) eleven = value
    }

    @Component
    class ChildComponent extends Vue {
      @InjectReactive(key) one!: string
    }

    const parent = new ParentComponent()
    const component = new ChildComponent({ parent })

    test('provides value', () => {
      expect(component.one).toBe(value)
    })

    describe('when changed', () => {
      const newValue = 'NEW VALUE'

      beforeAll(() => {
        parent.eleven = newValue
      })

      test('reflects updates', () => {
        expect(component.one).toBe(newValue)
      })
    })
  })
})
