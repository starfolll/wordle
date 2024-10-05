import type { Directive } from 'vue'

type TListenerEvent = (el: HTMLElement, e: KeyboardEvent) => void
type TKeydownListener = (e: KeyboardEvent) => void

const listenerToKeydownListenerMap = new Map<TListenerEvent, TKeydownListener>()

export const vGlobalKeyPress: & Directive<any, TListenerEvent> = {
  mounted(el, binding) {
    const listener = listenerToKeydownListenerMap.set(el, e => binding.value(el, e)).get(el)!
    window.addEventListener('keydown', listener)
  },

  updated(el, binding) {
    const oldListener = listenerToKeydownListenerMap.get(el)
    if (oldListener)
      window.removeEventListener('keydown', oldListener)

    const listener = listenerToKeydownListenerMap.set(el, e => binding.value(el, e)).get(el)!
    window.addEventListener('keydown', listener)
  },

  beforeUnmount(el) {
    const listener = listenerToKeydownListenerMap.get(el)
    if (listener) {
      window.removeEventListener('keydown', listener)
      listenerToKeydownListenerMap.delete(el)
    }
  },
}
