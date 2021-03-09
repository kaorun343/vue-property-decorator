import { mount, VueWrapper } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'
import { Vue } from 'vue-class-component'
import { Provide } from '../../src/decorators/Provide'

const PRIMITIVE_VALUE_KEY = 'PRIMITIVE_VALUE_KEY'
const OBJECT_VALUE_KEY = 'OBJECT_VALUE_KEY'

type ObjectType = { age: number; food: string }

const ChildComponent = defineComponent({
  setup() {
    const primitive = inject<number>(PRIMITIVE_VALUE_KEY)
    const object = inject<ObjectType>(OBJECT_VALUE_KEY)
    return {
      primitive,
      object,
    }
  },
  render() {
    return h('div')
  },
})

interface ChildType {
  primitive: number | undefined
  object: ObjectType | undefined
}

describe(Provide, () => {
  describe(`without options`, () => {
    class ParentComponent extends Vue {
      @Provide() [PRIMITIVE_VALUE_KEY] = 30;
      @Provide() [OBJECT_VALUE_KEY] = { age: 30, food: 'Apple' }

      $refs!: {
        child: ChildType
      }

      render() {
        return h(ChildComponent, { ref: 'child' })
      }
    }

    let wrapper: VueWrapper<ParentComponent>
    let child: typeof ParentComponent['prototype']['$refs']['child']

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      child = wrapper.vm.$refs.child
    })

    it('provides values', () => {
      expect(child.primitive).toEqual(wrapper.vm[PRIMITIVE_VALUE_KEY])
      expect(child.object).toEqual(wrapper.vm[OBJECT_VALUE_KEY])
    })

    it('does not dispatch updates', () => {
      wrapper.vm[PRIMITIVE_VALUE_KEY] = 40
      expect(child.primitive).not.toEqual(wrapper.vm[PRIMITIVE_VALUE_KEY])
    })
  })

  describe(`with 'to' option`, () => {
    class ParentComponent extends Vue {
      @Provide({ to: PRIMITIVE_VALUE_KEY }) primitive = 30
      @Provide({ to: OBJECT_VALUE_KEY }) object = { age: 30, food: 'Apple' }

      $refs!: {
        child: ChildType
      }

      render() {
        return h(ChildComponent, { ref: 'child' })
      }
    }

    let wrapper: VueWrapper<ParentComponent>
    let child: typeof ParentComponent['prototype']['$refs']['child']

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      child = wrapper.vm.$refs.child
    })

    it('provides values', () => {
      expect(child.primitive).toEqual(wrapper.vm.primitive)
      expect(child.object).toEqual(wrapper.vm.object)
    })
  })

  describe(`with 'reactive' option`, () => {
    class ParentComponent extends Vue {
      @Provide({ reactive: true }) [PRIMITIVE_VALUE_KEY] = 30;
      @Provide({ reactive: true }) [OBJECT_VALUE_KEY] = {
        age: 30,
        food: 'Apple',
      }

      $refs!: {
        child: ChildType
      }

      render() {
        return h(ChildComponent, { ref: 'child' })
      }
    }

    let wrapper: VueWrapper<ParentComponent>
    let child: typeof ParentComponent['prototype']['$refs']['child']

    beforeEach(() => {
      wrapper = mount(ParentComponent)
      child = wrapper.vm.$refs.child
    })

    it('provides values', () => {
      expect(child.primitive).toEqual(wrapper.vm[PRIMITIVE_VALUE_KEY])
      expect(child.object).toEqual(wrapper.vm[OBJECT_VALUE_KEY])
    })

    it('dispatches updates', () => {
      wrapper.vm[PRIMITIVE_VALUE_KEY] = 40
      expect(child.primitive).toEqual(wrapper.vm[PRIMITIVE_VALUE_KEY])
    })
  })
})
