import 'reflect-metadata'
import Vue from 'vue'
import Component from 'vue-class-component'
import { ModelSync } from '../../src/decorators/ModelSync'

const mockFunction = jest.fn()

describe(ModelSync, () => {
  const eventName = 'change'
  const propertyName = 'checked'
  const accessorName = 'chackedValue'
  @Component
  class TestComponent extends Vue {
    @ModelSync(propertyName, eventName, Boolean) [accessorName]!: boolean

    changeChecked(newValue: boolean) {
      this[accessorName] = newValue
    }
  }

  const initialValue = false
  let component: TestComponent

  beforeEach(() => {
    component = new TestComponent({
      propsData: { [propertyName]: initialValue },
    })
    component.$emit = mockFunction
  })

  test('define model option correctly', () => {
    expect(component.$options.model).toEqual({
      prop: propertyName,
      event: eventName,
    })
  })

  test('define props option correctly', () => {
    const props = (component.$options.props as any) as Record<string, any>
    expect(props![propertyName]).toEqual({ type: Boolean })
  })

  test('component recieves prop', () => {
    expect(component[accessorName]).toBe(initialValue)
  })

  describe('when props has been changed', () => {
    const newValue = true

    beforeEach(() => {
      component.changeChecked(newValue)
    })

    test('calls $emit method', () => {
      expect(mockFunction).toHaveBeenCalled()
    })

    test('emits event with event name', () => {
      expect(mockFunction.mock.calls[0][0]).toBe(eventName)
    })

    test('emits event with new value', () => {
      expect(mockFunction.mock.calls[0][1]).toBe(newValue)
    })
  })
})
