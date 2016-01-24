/* vue-property-decorator verson 2.1.0 MIT LICENSE copyright 2016 kaorun343 */
"use strict";

/**
 * decorator of an event
 * @param  {string}            eventName the name of the event to listen
 * @return {PropertyDecorator}           PropertyDecorator
 */
export function event(eventName: string): PropertyDecorator {
    return function(target: any, propertyKey: string) {
        (target.constructor.events || (target.constructor.events = {}))[eventName] = propertyKey;
    };
}

/**
 * decorator of a prop
 * @param  {PropOption}        options the option for the prop
 * @return {PropertyDecorator}         PropertyDecorator
 */
export function prop(options: (PropOption | { new (...args: any[]): any; })): PropertyDecorator {
    return function(target: any, propertyKey: string) {
        (target.constructor.props || (target.constructor.props = {}))[propertyKey] = options;
    };
}

/**
 * decorator of a watch function
 * @param  {string}            path the path or the expression to observe
 * @return {PropertyDecorator}      PropertyDecorator
 */
export function watch(path: string): PropertyDecorator {
    return function(target: any, propertyKey: string) {
        (target.constructor.watch || (target.constructor.watch = {}))[path] = propertyKey;
    };
}

export function Data<T>(data: () => T) {
    return function(Class: { prototype: T }) {
        (Class.prototype as any).data = data;
    };
}

export interface PropOption {
    type: { new (...args: any[]): any; };
    required?: boolean;
    default?: any;
    twoWay?: boolean;
    validator?: (value: any) => boolean;
    coerce?: (value: any) => any;
}

export interface DirectiveOption {
    bind?(): any;
    update?(newVal?: any, oldVal?: any): any;
    unbind?(): any;
    params?: string[];
    deep?: boolean;
    twoWay?: boolean;
    acceptStatement?: boolean;
    priority?: number;
    [key: string]: any;
}

export interface FilterOption {
    read: Function;
    write: Function;
}

export interface TransitionOption {
    css?: boolean;
    beforeEnter?(el: HTMLElement): void;
    enter?(el: HTMLElement, done?: () => void): void;
    afterEnter?(el: HTMLElement): void;
    enterCancelled?(el: HTMLElement): void;
    beforeLeave?(el: HTMLElement): void;
    leave?(el: HTMLElement, done?: () => void): void;
    afterLeave?(el: HTMLElement): void;
    leaveCancelled?(el: HTMLElement): void;
    stagger?(index: number): number;
}

export interface PropOptions {
    [key: string]: PropOption;
}

export interface DirectiveOptions {
    [key: string]: DirectiveOption;
}

export interface FilterOptions {
    [key: string]: FilterOption;
}

export interface TransitionOptions {
    [key: string]: TransitionOption;
}

// instance/api/data.js
export interface $get {
    (exp: string, asStatement?: boolean): any;
}
export interface $set {
    <T>(key: string | number, value: T): T;
}
export interface $delete {
    (key: string): void;
}
export interface $watch {
    (expOrFn: string | Function, callback: ((newVal: any, oldVal?: any) => any) | string, options?: {
        deep?: boolean;
        immidiate?: boolean;
    }): Function;
}
export interface $eval {
    (expression: string): string;
}
export interface $interpolate {
    (expression: string): string;
}
export interface $log {
    (keypath?: string): void;
}

// instance/api/dom.js
export interface $nextTick {
    (callback: Function): void;
}
export interface $appendTo<V> {
    (target: (HTMLElement | string), callback?: Function, withTransition?: boolean): V;
}
export interface $prependTo<V> {
    (target: (HTMLElement | string), callback?: Function, withTransition?: boolean): V;
}
export interface $before<V> {
    (target: (HTMLElement | string), callback?: Function, withTransition?: boolean): V;
}
export interface $after<V> {
    (target: (HTMLElement | string), callback?: Function, withTransition?: boolean): V;
}
export interface $remove<V> {
    (callback?: Function): V;
}

// instance/api/events.js
export interface $on<V> {
    (event: string, callback: Function): V;
}
export interface $once<V> {
    (event: string, callback: Function): V;
}
export interface $off<V> {
    (event?: string, callback?: Function): V;
}
export interface $emit<V> {
    (event: string, ...args: any[]): V;
}
export interface $broadcast<V> {
    (event: string, ...args: any[]): V;
}
export interface $dispatch<V> {
    (event: string, ...args: any[]): V;
}

// instance/api/lifecycle.js
export interface $mount<V> {
    (elementOrSelector?: (HTMLElement | string)): V;
}
export interface $destroy {
    (remove?: boolean): void;
}
export interface $compile {
    (el: Element | DocumentFragment, host?: any): Function;
}
