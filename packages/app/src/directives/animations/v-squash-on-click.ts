import type { Directive } from 'vue'

export function playSquashAnimation(el: HTMLElement) {
  el.classList.remove('squash')
  requestAnimationFrame(() => el.classList.add('squash'))
}

export const vSquashOnClick: Directive = {
  mounted(el: HTMLElement) {
    el.addEventListener('click', () => playSquashAnimation(el))
  },
}
