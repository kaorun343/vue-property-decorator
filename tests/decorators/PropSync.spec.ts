import 'reflect-metadata'
import Vue from 'vue'
import Component from 'vue-class-component'
import { PropSync } from '../../src/decorators/PropSync'

describe(PropSync, () => {
  const propertyName = 'PROPERTY_NAME'
  const accessorName = 'GETTER_NAME'

  @Component
  class Test extends Vue {
    @PropSync(propertyName) [accessorName]!: string

    changeName(newName: string) {
      this[accessorName] = newName
    }
  }

  const value = 'John'
  let component: Test
  const mockFn = jest.fn()

  beforeEach(() => {
    component = new Test({ propsData: { [propertyName]: value } })
    component.$emit = mockFn
  })

  test('defines prop option', () => {
    const props = component.$options.props as any
    expect(props[propertyName]).toEqual({ type: String })
  })

  test('component recieves prop', () => {
    expect(component[accessorName]).toBe(value)
  })

  describe('when prop has been changed', () => {
    const newValue = 'Ola'

    beforeEach(() => {
      component.changeName(newValue)
    })

    test('calls $emit method', () => {
      expect(mockFn).toHaveBeenCalled()
    })

    test('emits event with event name', () => {
      expect(mockFn.mock.calls[0][0]).toBe(`update:${propertyName}`)
    })

    test('emits event with new value', () => {
      expect(mockFn.mock.calls[0][1]).toBe(newValue)
    })
  })
})
