import Vue from 'vue'
import Component from 'vue-class-component'
import { Inject } from '../../src/decorators/Inject'
import { InjectReactive } from '../../src/decorators/InjectReactive'
import { Provide } from '../../src/decorators/Provide'
import { ProvideReactive } from '../../src/decorators/ProvideReactive'

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
    const component = new ChildComponent({ parent: node })

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

    describe('multiple provider chains', () => {
      const key = 'KEY'
      const value1 = 'VALUE_1'
      const value2 = 'VALUE_2'

      @Component
      class ParentChain1 extends Vue {
        @ProvideReactive(key) provided = value1
      }

      @Component
      class ChildChain1 extends Vue {
        @InjectReactive(key) injected!: string
      }

      @Component
      class ParentChain2 extends Vue {
        @ProvideReactive(key) provided = value2
      }

      @Component
      class ChildChain2 extends Vue {
        @InjectReactive(key) injected!: string
      }
      const parent1 = new ParentChain1()
      const child1 = new ChildChain1({ parent: parent1 })
      const parent2 = new ParentChain2()
      const child2 = new ChildChain2({ parent: parent2 })

      test('respect values in chains', () => {
        expect(child1.injected).toBe(value1)
        expect(child2.injected).toBe(value2)
      })
    })

    describe('middle component participating in provider chain', () => {
      const rootKey = Symbol()
      const middleKey = Symbol()
      const rootValue = 'ROOT_VALUE'
      const middleValue = 'MIDDLE_VALUE'

      @Component
      class RootComponent extends Vue {
        @ProvideReactive(rootKey) baz = rootValue
      }

      const root = new RootComponent()

      @Component
      class MiddleComponent extends Vue {
        @ProvideReactive(middleKey) foo = middleValue
      }

      @Component
      class ChildComponent extends Vue {
        @InjectReactive(rootKey) baz!: string
        @InjectReactive(middleKey) foo!: string
      }

      const middle = new MiddleComponent({ parent: root })
      const child = new ChildComponent({ parent: middle })

      test('provided values from the chain', () => {
        expect(child.baz).toBe(rootValue)
        expect(child.foo).toBe(middleValue)
      })
    })
  })
})
