import type { Directive } from 'vue'

export function playBounceAnimation(el: HTMLElement) {
  el.classList.remove('bounce')
  requestAnimationFrame(() => el.classList.add('bounce'))
}

export const vBounce: Directive = (el: HTMLElement, binding) => {
  if (binding.oldValue === binding.value)
    return

  playBounceAnimation(el)
}
