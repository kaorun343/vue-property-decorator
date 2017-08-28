declare module '*.html' {
    import Vue = require('vue')
    interface Template {
      <V extends Vue>(options: Vue.ComponentOptions<V>): Vue.ComponentOptions<V>
      <V extends typeof Vue>(component: V): V
    }
    const template: Template
    export = template
  }
