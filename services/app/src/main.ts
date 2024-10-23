import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'

import * as icons from './icons'
import router from './router'

import './assets/base.scss'
import './assets/animations.scss'

library.add(icons)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(VueQueryPlugin)
app.use(router)

app.mount('#app')
