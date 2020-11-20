import Vue from 'vue'
import Component from 'vue-class-component'
import { Inject } from '../../src/decorators/Inject'
import { Provide } from '../../src/decorators/Provide'

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

  describe('does not override parent dependencies', () => {
    @Component
    class ParentComponent extends Vue {
      @Provide() root = 'root'
    }
    @Component
    class NodeComponent extends Vue {
      @Provide() node = 'node'
    }
    @Component
    class ChildComponent extends Vue {
      @Inject() root!: string
      @Inject() node!: string
    }

    const parent = new ParentComponent()
    const node = new NodeComponent({ parent })
    const component = new ChildComponent({ parent: node })

    test('provides value', () => {
      expect(component.node).toBe('node')
      expect(component.root).toBe('root')
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
