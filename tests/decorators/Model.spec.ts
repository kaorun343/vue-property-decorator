import { mount, VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import { Vue } from 'vue-class-component'
import { Model } from '../../src/decorators/Model'

describe(Model, () => {
  class ChildComponent extends Vue {
    @Model('modelValue', String) value!: string

    render() {
      return h('div')
    }
  }

  const INITIAL_VALUE = 'INITIAL VALUE'

  class ParentComponent extends Vue {
    myValue = INITIAL_VALUE

    $refs!: {
      child: ChildComponent
    }

    render() {
      return h(ChildComponent, {
        modelValue: this.myValue,
        [`onUpdate:modelValue`]: (v: string) => (this.myValue = v),
        ref: 'child',
      })
    }
  }

  let wrapper: VueWrapper<ParentComponent>
  let child: ChildComponent

  beforeEach(() => {
    wrapper = mount(ParentComponent)
    child = wrapper.vm.$refs.child
  })

  it('receives prop value from parent', () => {
    expect(child.value).toBe(INITIAL_VALUE)
  })

  it('emits change event to parent', () => {
    const UPDATED_VALUE = 'UPDATED VALUE'
    child.value = UPDATED_VALUE
    expect(wrapper.vm.myValue).toBe(UPDATED_VALUE)
  })
})
