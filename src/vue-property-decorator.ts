/* vue-property-decorator verson 3.0.0 MIT LICENSE copyright 2016 kaorun343 */
"use strict";
import * as Vue from "vue";
import VueComponent from "vue-class-component";

/**
 * decorator of a prop
 * @param  {PropOption}        options the option for the prop
 * @return {PropertyDecorator}         PropertyDecorator
 */
export function prop(options: (Vue.PropOptions | { new (...args: any[]): any; })): PropertyDecorator {
    return function (target: any, propertyKey: string) {
        (target.constructor.props || (target.constructor.props = {}))[propertyKey] = options;
    };
}

/**
 * decorator of a watch function
 * @param  {string}            path the path or the expression to observe
 * @param  {WatchOption}       WatchOption
 * @return {MethodDecorator}      MethodDecorator
 */
export function watch(path: string, options: Vue.WatchOptions = {}): MethodDecorator {
    const { deep = false, immediate = false } = options;
    return function (target: any, handler: string) {
        (target.constructor.watch || (target.constructor.watch = {}))[path] = {
            handler,
            deep,
            immediate
        };
    };
}

export function Component<V extends Vue>(options: Vue.ComponentOptions<V>): ClassDecorator {
    return function (Class: any) {
        Object.assign(options, { props: Class.props, watch: Class.watch });
        return VueComponent(options)(Class);
    }
}
