import { WatchOptions } from 'vue'
import { createDecorator } from 'vue-class-component'

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  watchOptions
 */
export function Watch(path: string, watchOptions: WatchOptions = {}) {
  return createDecorator((componentOptions, handler) => {
    componentOptions.watch ||= Object.create(null)
    const watch: any = componentOptions.watch
    if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
      watch[path] = [watch[path]]
    } else if (typeof watch[path] === 'undefined') {
      watch[path] = []
    }

    watch[path].push({ handler, ...watchOptions })
  })
}
