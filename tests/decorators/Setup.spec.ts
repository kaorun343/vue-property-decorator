import Vue from 'vue'
import Component from 'vue-class-component'
import VueCompositionAPI, { ref } from '@vue/composition-api'
import { Setup, setup } from '../../src/decorators/Setup'

Vue.use(VueCompositionAPI)

describe(Setup, () => {
  describe('when key is not given', () => {
    
    @Component
    class Test extends Vue {
      @Setup() get setup() {
        return setup(() => {
          const count = ref(0)

          const increment = () => {
            count.value++
          }
          
          return { count, increment };
        });
      }
    }

    const component = new Test()

    test('we can use the composition api within class based components', () => {
      const computed = component.setup
      expect(computed.count.value).toBe(0)
      computed.increment()
      expect(computed.count.value).toBe(1)
      computed.increment()
      expect(computed.count.value).toBe(2)
    })
  })
})