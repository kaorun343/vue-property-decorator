import Vue from 'vue'
import {
  Component,
  ProvideReactive,
  InjectReactive,
  Provide,
  Inject
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
      @Provide() first = 'whatever'
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


  describe('can @Inject() dependency provided using @ProvideReactive()', () => {
    @Component
    class ParentComponent extends Vue {
      @ProvideReactive() one = 'one'
    }
    @Component
    class ChildComponent extends Vue {
      @Inject() one!: string
    }

    const parent = new ParentComponent()
    const component = new ChildComponent({ parent })

    test('provides value', () => {
      expect(component.one).toBe('one')
    })
  })


  describe('does not override parent reactive dependencies', () => {
    @Component
    class ParentComponent extends Vue {
      @ProvideReactive() root = 'root'
    }
    @Component
    class NodeComponent extends Vue {
      @ProvideReactive() node = 'node'
    }
    @Component
    class ChildComponent extends Vue {
      @InjectReactive() root!: string
      @InjectReactive() node!: string
    }

    const parent = new ParentComponent()
    const node = new NodeComponent({ parent })
    const component = new ChildComponent({ parent: node  })

    test('provides value', () => {
      expect(component.node).toBe('node')
      expect(component.root).toBe('root') // <== this one used to throw

      // check that they update correctly
      parent.root = 'new root'
      node.node = 'new node'
      expect(component.root).toBe('new root')
      expect(component.node).toBe('new node')
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
