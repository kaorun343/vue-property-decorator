/* vue-property-decorator verson 3.0.0 MIT LICENSE copyright 2016 kaorun343 */
"use strict";
import * as Vue from "vue";
import { PropOptions, ComponentOptions } from "vue";
import VueComponent from "vue-class-component";

/**
 * decorator of a prop
 * @param  {PropOption}        options the option for the prop
 * @return {PropertyDecorator}         PropertyDecorator
 */
export function prop(options: (PropOptions | { new (...args: any[]): any; })): PropertyDecorator {
    return function(target: any, propertyKey: string) {
        (target.constructor.props || (target.constructor.props = {}))[propertyKey] = options;
    };
}

/**
 * decorator of a watch function
 * @param  {string}            path the path or the expression to observe
 * @return {MethodDecorator}      MethodDecorator
 */
export function watch(path: string): MethodDecorator {
    return function(target: any, propertyKey: string) {
        (target.constructor.watch || (target.constructor.watch = {}))[path] = propertyKey;
    };
}

export function Component<V extends Vue>(options: ComponentOptions<V>): ClassDecorator {
    return function(Class: any) {
        Object.assign(options, { props: Class.props, watch: Class.watch });
        return VueComponent(options)(Class);
    }
}
