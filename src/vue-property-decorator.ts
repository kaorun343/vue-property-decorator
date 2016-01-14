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

export interface PropOption {
    type?: any;
    required?: boolean;
    default?: any;
    twoWay?: boolean;
    validator?: (value: any) => boolean;
}

/**
 * decorator of a prop
 * @param  {PropOption}        options the option for the prop
 * @return {PropertyDecorator}         PropertyDecorator
 */
export function prop(options: PropOption): PropertyDecorator {
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
