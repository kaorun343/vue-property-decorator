import { mount } from '@vue/test-utils'
import { defineComponent, h, provide, reactive, ref } from 'vue'
import { Vue } from 'vue-class-component'
import { Inject } from '../../src/decorators/Inject'

const PRIMITIVE_VALUE_KEY = 'PRIMITIVE_VALUE_KEY'
const OBJECT_VALUE_KEY = 'OBJECT_VALUE_KEY'

const ParentComponentBuilder = (ChildComponent: any) =>
  defineComponent({
    setup() {
      const primitive = ref(30)
      const object = reactive({ age: 30, food: 'Apple' })
      provide(PRIMITIVE_VALUE_KEY, primitive)
      provide(OBJECT_VALUE_KEY, object)
      return { primitive, object }
    },
    render() {
      return h(ChildComponent, { ref: 'child' })
    },
  })

describe(Inject, () => {
  describe('without options', () => {
    class ChildComponent extends Vue {
      @Inject() [PRIMITIVE_VALUE_KEY]!: number;
      @Inject() [OBJECT_VALUE_KEY]!: { age: number; food: string }

      render() {
        return h('div')
      }
    }

    const ParentComponent = ParentComponentBuilder(ChildComponent)
    const mountParentComponet = () => mount(ParentComponent)
    let wrapper: ReturnType<typeof mountParentComponet>
    let child: ChildComponent

    beforeEach(() => {
      wrapper = mountParentComponet()
      child = wrapper.vm.$refs['child'] as ChildComponent
    })

    it('injects value', () => {
      expect(child[PRIMITIVE_VALUE_KEY]).toEqual(wrapper.vm.primitive)
      expect(child[OBJECT_VALUE_KEY]).toEqual(wrapper.vm.object)
    })

    it(`follows parent's updates`, () => {
      wrapper.vm.primitive = 40
      wrapper.vm.object.food = 'Lemon'
      expect(child[PRIMITIVE_VALUE_KEY]).toEqual(wrapper.vm.primitive)
      expect(child[OBJECT_VALUE_KEY]).toEqual(wrapper.vm.object)
    })
  })

  describe('with from', () => {
    class ChildComponent extends Vue {
      @Inject({ from: PRIMITIVE_VALUE_KEY }) renamed!: number

      render() {
        return h('div')
      }
    }

    const ParentComponent = ParentComponentBuilder(ChildComponent)
    const mountParentComponet = () => mount(ParentComponent)
    let wrapper: ReturnType<typeof mountParentComponet>
    let child: ChildComponent

    beforeEach(() => {
      wrapper = mountParentComponet()
      child = wrapper.vm.$refs['child'] as ChildComponent
    })

    it('injects value', () => {
      expect(child.renamed).toEqual(wrapper.vm.primitive)
    })
  })

  describe('with default', () => {
    const UNDEFINED_VALUE_KEY = 'UNDEFINED_VALUE_KEY'

    class ChildComponent extends Vue {
      @Inject({ default: 'DEFAULT VALUE' }) [UNDEFINED_VALUE_KEY]!: string

      render() {
        return h('div')
      }
    }

    const ParentComponent = ParentComponentBuilder(ChildComponent)
    const mountParentComponet = () => mount(ParentComponent)
    let wrapper: ReturnType<typeof mountParentComponet>
    let child: ChildComponent

    beforeEach(() => {
      wrapper = mountParentComponet()
      child = wrapper.vm.$refs['child'] as ChildComponent
    })

    it('injects default value', () => {
      expect(child[UNDEFINED_VALUE_KEY]).toEqual('DEFAULT VALUE')
    })
  })
})
