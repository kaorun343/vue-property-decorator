import { mount, VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import { Vue } from 'vue-class-component'
import { Prop } from '../../src/decorators/Prop'

describe(Prop, () => {
  describe('without argument', () => {
    class MyComponent extends Vue {
      @Prop() stringProp: string | undefined
      @Prop() numberProp: number | undefined
      @Prop() booleanProp: boolean | undefined
      @Prop() arrayProp: Array<any> | undefined
      @Prop() objectProp: Record<string, any> | undefined
      @Prop() dateProp: Date | undefined
      @Prop() functionProp: Function | undefined
      @Prop() symbolProp: Symbol | undefined

      render() {
        return h('div')
      }
    }

    let wrapper: VueWrapper<MyComponent>

    describe('without prop values from its parent component', () => {
      beforeEach(() => {
        wrapper = mount(MyComponent)
      })

      it('sets props correctly', () => {
        expect(wrapper.vm.$options.props).toMatchSnapshot()
      })

      const properties: (keyof MyComponent)[] = [
        'stringProp',
        'numberProp',
        'booleanProp',
        'arrayProp',
        'objectProp',
        'functionProp',
        'symbolProp',
      ]

      it.each(properties)(`%s is undefined`, (property) => {
        expect(wrapper.vm[property]).toBeUndefined()
      })
    })

    describe('with prop values from its parent component', () => {
      beforeEach(() => {
        wrapper = mount(MyComponent, {
          props: {
            stringProp: 'STRING-PROP',
            numberProp: 2000,
            booleanProp: true,
            arrayProp: [],
            objectProp: {},
            dateProp: new Date('2020-01-01'),
            functionProp: new Function(),
            symbolProp: Symbol.for('SYMBOL-PROP'),
          },
        })
      })

      const properties: [keyof MyComponent, any][] = [
        ['stringProp', 'STRING-PROP'],
        ['numberProp', 2000],
        ['booleanProp', true],
        ['arrayProp', []],
        ['objectProp', {}],
        ['dateProp', new Date('2020-01-01')],
        ['functionProp', expect.any(Function)],
        ['symbolProp', Symbol.for('SYMBOL-PROP')],
      ]

      it.each(properties)(
        `%s equals to the given prop value`,
        (property, expected) => {
          expect(wrapper.vm[property]).toEqual(expected)
        },
      )
    })
  })

  describe('with constructor', () => {
    class MyComponent extends Vue {
      @Prop(String) stringProp: string | undefined
      @Prop(Number) numberProp: Number | undefined
      @Prop(Boolean) booleanProp!: boolean
      @Prop(Array) arrayProp: Array<any> | undefined
      @Prop(Object) objectProp: Record<string, any> | undefined
      @Prop(Date) dateProp: Date | undefined
      @Prop(Function) functionProp: Function | undefined
      @Prop(Symbol) symbolProp: Symbol | undefined

      render() {
        return h('div')
      }
    }

    let wrapper: VueWrapper<MyComponent>

    describe('without prop values from its parent component', () => {
      beforeEach(() => {
        wrapper = mount(MyComponent)
      })

      it('sets props correctly', () => {
        expect(wrapper.vm.$options.props).toMatchSnapshot()
      })

      const properties: [keyof MyComponent, any][] = [
        ['stringProp', undefined],
        ['numberProp', undefined],
        ['booleanProp', false],
        ['arrayProp', undefined],
        ['objectProp', undefined],
        ['dateProp', undefined],
        ['functionProp', undefined],
        ['symbolProp', undefined],
      ]

      it.each(properties)('%s equals to %s', (property, expected) => {
        expect(wrapper.vm[property]).toEqual(expected)
      })
    })

    describe('with prop values from its parent component', () => {
      beforeEach(() => {
        wrapper = mount(MyComponent, {
          props: {
            stringProp: 'STRING-PROP',
            numberProp: 300,
            booleanProp: true,
            arrayProp: [],
            objectProp: {},
            dateProp: new Date('2020-01-01'),
            functionProp: new Function(),
            symbolProp: Symbol.for('SYMBOL-PROP'),
          },
        })
      })

      const properties: [keyof MyComponent, any][] = [
        ['stringProp', 'STRING-PROP'],
        ['numberProp', 300],
        ['booleanProp', true],
        ['arrayProp', []],
        ['objectProp', {}],
        ['dateProp', new Date('2020-01-01')],
        ['functionProp', expect.any(Function)],
        ['symbolProp', Symbol.for('SYMBOL-PROP')],
      ]

      it.each(properties)(
        `%s equals to the given prop value`,
        (property, expected) => {
          expect(wrapper.vm[property]).toEqual(expected)
        },
      )
    })
  })

  describe('with multiple constructors', () => {
    class MyComponent extends Vue {
      @Prop([String, Number]) myId!: string | number

      render() {
        return h('div')
      }
    }

    let wrapper: VueWrapper<MyComponent>

    beforeEach(() => {
      wrapper = mount(MyComponent)
    })

    it('sets prop options correctly', () => {
      expect(wrapper.vm.$options.props).toMatchSnapshot()
    })
  })

  describe('with prop option', () => {
    class MyComponent extends Vue {
      @Prop({ type: String, default: 'DEFAULT-STRING' }) stringProp!: string
      @Prop({ type: Number, default: 1234 }) numberProp!: number
      @Prop({ type: Boolean, default: true }) booleanProp!: boolean
      @Prop({ type: Array, default: () => ['DEFAULT-ARRAY'] })
      arrayProp!: Array<any>
      @Prop({ type: Object, default: () => ({ value: 'DEFAULT-OBJECT' }) })
      objectProp!: Record<string, any>
      @Prop({ type: Date, default: () => new Date('2020-01-01') })
      dateProp!: Date
      @Prop({ type: Function, default: () => () => null })
      functionProp!: Function
      @Prop({ type: Symbol, default: Symbol.for('DEFAULT-SYMBOL') })
      symbolProp!: Symbol

      render() {
        return h('div')
      }
    }

    let wrapper: VueWrapper<MyComponent>

    beforeEach(() => {
      wrapper = mount(MyComponent)
    })

    it('sets prop options correctly', () => {
      expect(wrapper.vm.$options.props).toMatchSnapshot()
    })

    const properties: [keyof MyComponent, any][] = [
      ['stringProp', 'DEFAULT-STRING'],
      ['numberProp', 1234],
      ['booleanProp', true],
      ['arrayProp', ['DEFAULT-ARRAY']],
      ['objectProp', { value: 'DEFAULT-OBJECT' }],
      ['dateProp', new Date('2020-01-01')],
      ['functionProp', expect.any(Function)],
      ['symbolProp', Symbol.for('DEFAULT-SYMBOL')],
    ]

    it.each(properties)(
      `%s equals to the given prop value`,
      (property, expected) => {
        expect(wrapper.vm[property]).toEqual(expected)
      },
    )
  })
})
