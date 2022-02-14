import { mount, Wrapper } from '@vue/test-utils';
import Vue, { CreateElement } from 'vue';
import Component from 'vue-class-component';
import { PropClone } from '../../src/decorators/PropClone';

describe(PropClone, () => {
  describe('when having a simple default value', () => {
    const value = 'DEFAULT_VALUE'

    @Component
    class Test extends Vue {
      @PropClone('propertyName', { default: value }) currentPropertyName!: string
    }

    const component = new Test()

    test('the component data is assigned', () => {
      expect(component.$data.currentPropertyName).toEqual('DEFAULT_VALUE')
    })
  })

  describe('when having an object value', () => {
    const value = () => ({
      hello: 'world',
      universe: {
        planets: ['earth']
      }
    })

    @Component
    class Test extends Vue {
      @PropClone('propertyName', { default: value }) currentPropertyName!: string

      render(h: CreateElement) {
        return h('div')
      }
    }

    let wrapper: Wrapper<Test> = mount(Test)

    test('it clones it, so that the changes does not affect the property', async () => {
      expect(wrapper.vm.$data.currentPropertyName).toEqual({
        hello: 'world',
        universe: {
          planets: ['earth']
        }
      })
      expect(wrapper.vm.$props.propertyName).toEqual({
        hello: 'world',
        universe: {
          planets: ['earth']
        }
      })

      wrapper.vm.$data.currentPropertyName.hello = 'people'
      wrapper.vm.$data.currentPropertyName.universe.planets.push('mars')

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.$data.currentPropertyName).toEqual({
        hello: 'people',
        universe: {
          planets: ['earth', 'mars']
        }
      })
      expect(wrapper.vm.$props.propertyName).toEqual({
        hello: 'world',
        universe: {
          planets: ['earth']
        }
      })
    })

    describe('when the property updates', () => {
      test('it updates the clone too', async () => {
        wrapper.vm.$props.propertyName.hello = 'dev'
        wrapper.vm.$props.propertyName.universe.planets = ['mercury']
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.$data.currentPropertyName).toEqual({
          hello: 'dev',
          universe: {
            planets: ['mercury']
          }
        })
      })
    })
  })
})
