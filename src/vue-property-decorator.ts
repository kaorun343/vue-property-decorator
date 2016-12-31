/* vue-property-decorator verson 3.2.1 MIT LICENSE copyright 2016 kaorun343 */
"use strict";
import * as Vue from "vue";
import VueClassComponent, { createDecorator } from "vue-class-component";

/**
 * decorator of a prop
 * @param  {PropOption}        options the option for the prop
 * @return {PropertyDecorator}         PropertyDecorator
 */
export function prop(options: (Vue.PropOptions | { new (...args: any[]): any; })): PropertyDecorator {
    return createDecorator((componentOptions, key) => {
        (componentOptions.props || (componentOptions.props = {}) as any)[key] = options;
    });
}

/**
 * decorator of a watch function
 * @param  {string}            path the path or the expression to observe
 * @param  {WatchOption}       WatchOption
 * @return {MethodDecorator}      MethodDecorator
 */
export function watch(path: string, options: Vue.WatchOptions = {}): MethodDecorator {
    const { deep = false, immediate = false } = options;

    return createDecorator((componentOptions, handler) => {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null)
        }
        (componentOptions.watch as any)[path] = {handler, deep, immediate}
    })
}

export const Component = VueClassComponent;
