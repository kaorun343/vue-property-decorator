import Vue from 'vue'
import Component from 'vue-class-component'
import { Ref } from '../../src/decorators/Ref'

describe(Ref, () => {
  describe('when key is not given', () => {
    const propertyName = 'PROPERTY_NAME'

    @Component
    class Test extends Vue {
      @Ref() [propertyName]: any
    }

    const component = new Test()
    const ref = 'REFERENCE' as any
    component.$refs[propertyName] = ref

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName].cache).toBe(false)
      expect(computed[propertyName].get).toBeInstanceOf(Function)
    })

    test('computed property returns ref object', () => {
      expect(component[propertyName]).toBe(ref)
    })
  })

  describe('when key is given', () => {
    const referenceName = 'REFERENCE_NAME'
    const propertyName = 'PROPERTY_NAME'

    @Component
    class Test extends Vue {
      @Ref(referenceName) [propertyName]: any
    }

    const component = new Test()
    const ref = 'REFERENCE' as any
    component.$refs[referenceName] = ref

    test('defines computed option', () => {
      const computed = component.$options.computed as any
      expect(computed[propertyName].cache).toBe(false)
      expect(computed[propertyName].get).toBeInstanceOf(Function)
    })

    test('computed property returns ref object', () => {
      expect(component[propertyName]).toBe(ref)
    })
  })
})
