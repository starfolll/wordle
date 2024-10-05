import type { Directive } from 'vue'

type TListenerEvent = (el: HTMLElement, e: KeyboardEvent) => void
type TKeydownListener = (e: KeyboardEvent) => void

const weakMapElToKeydownListener = new WeakMap<any, TKeydownListener>()

export const vGlobalKeyPress: & Directive<any, TListenerEvent> = {
  mounted(el, binding) {
    const listener = weakMapElToKeydownListener.set(el, e => binding.value(el, e)).get(el)!
    window.addEventListener('keydown', listener)
  },

  updated(el, binding) {
    const oldListener = weakMapElToKeydownListener.get(el)
    if (oldListener)
      window.removeEventListener('keydown', oldListener)

    const listener = weakMapElToKeydownListener.set(el, e => binding.value(el, e)).get(el)!
    window.addEventListener('keydown', listener)
  },

  beforeUnmount(el) {
    const listener = weakMapElToKeydownListener.get(el)
    if (listener)
      window.removeEventListener('keydown', listener)
  },
}
