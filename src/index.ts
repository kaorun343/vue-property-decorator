/** vue-property-decorator verson 9.1.2 MIT LICENSE copyright 2020 kaorun343 */
/// <reference types='reflect-metadata'/>
import Vue from 'vue'
import Component, { mixins } from 'vue-class-component'

export { Component, Vue, mixins as Mixins }

export { Emit } from './decorators/Emit'
export { Inject } from './decorators/Inject'
export { InjectReactive } from './decorators/InjectReactive'
export { Model } from './decorators/Model'
export { ModelSync } from './decorators/ModelSync'
export { Prop } from './decorators/Prop'
export { PropSync } from './decorators/PropSync'
export { Provide } from './decorators/Provide'
export { ProvideReactive } from './decorators/ProvideReactive'
export { Ref } from './decorators/Ref'
export { VModel } from './decorators/VModel'
export { Watch } from './decorators/Watch'
