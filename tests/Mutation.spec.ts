import Vue from 'vue'
import Vuex from 'vuex'
import { Mutation, Component } from '../src/vue-property-decorator'

describe(Mutation, () => {

  Vue.use(Vuex)

  describe('when key is not given', () => {
    const propertyName = 'PROPERTY_NAME'
    const mockMutation = jest.fn()

    const store = new Vuex.Store({
      mutations: {
        [propertyName]: mockMutation
      }
    });

    @Component
    class Test extends Vue {
      @Mutation() [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit mutation', () => {
      component[propertyName]()
      expect(mockMutation).toBeCalled()
    })
  })

  describe('when key is given', () => {
    const mutationName = 'MUTATION_NAME'
    const propertyName = 'PROPERTY_NAME'
    const mockMutation = jest.fn()

    const store = new Vuex.Store({
      mutations: {
        [mutationName]: mockMutation
      }
    });

    @Component
    class Test extends Vue {
      @Mutation(mutationName) [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit mutation', () => {
      component[propertyName]()
      expect(mockMutation).toBeCalled()
    })
  })

  describe('when options mutation is given', () => {
    const mutationName = 'MUTATION_NAME'
    const propertyName = 'PROPERTY_NAME'
    const mockMutation = jest.fn()

    const store = new Vuex.Store({
      mutations: {
        [mutationName]: mockMutation
      }
    });

    @Component
    class Test extends Vue {
      @Mutation({ name: mutationName }) [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit mutation', () => {
      component[propertyName]()
      expect(mockMutation).toBeCalled()
    })
  })

  describe('when options namespace is given', () => {
    const moduleName = 'MODULE_NAME'
    const propertyName = 'PROPERTY_NAME'
    const mockMutation = jest.fn()

    const store = new Vuex.Store({
      modules: {
        [moduleName]: {
          namespaced: true,
          mutations: {
            [propertyName]: mockMutation
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @Mutation({ namespace: moduleName }) [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit mutation', () => {
      component[propertyName]()
      expect(mockMutation).toBeCalled()
    })
  })

  describe('when options mutation and namespace is given', () => {
    const mutationName = 'MUTATION_NAME'
    const moduleName = 'MODULE_NAME'
    const propertyName = 'PROPERTY_NAME'
    const mockMutation = jest.fn()

    const store = new Vuex.Store({
      modules: {
        [moduleName]: {
          namespaced: true,
          mutations: {
            [mutationName]: mockMutation
          }
        }
      }
    });

    @Component
    class Test extends Vue {
      @Mutation({ name: mutationName, namespace: moduleName }) [propertyName]: () => void
    }

    const component = new Test({ store })

    test('defines methods option', () => {
      const methods = component.$options.methods as any
      expect(methods[propertyName]).toBeInstanceOf(Function)
    })

    test('method emit mutation', () => {
      component[propertyName]()
      expect(mockMutation).toBeCalled()
    })
  })
})
