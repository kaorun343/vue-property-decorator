import { Vue, Component, VModel } from '../src/vue-property-decorator'

describe(VModel, () => {
  @Component
  class Test extends Vue {
    @VModel({ type: String }) name!: string
  }

  it('returns prop value', () => {
    const value = 'NAME'
    const component = new Test({ propsData: { value } })
    expect(component.name).toBe(value)
  })

  it('emits input event', () => {
    const component = new Test()
    jest.spyOn(component, '$emit')
    const name = 'NEW NAME'
    component.name = name
    expect(component.$emit).toHaveBeenCalledWith('input', name)
  })
})
