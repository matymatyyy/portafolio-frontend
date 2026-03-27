import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/global.css'
import { useTheme } from './composables/useTheme'

// Initialize theme on startup
useTheme()

createApp(App).use(router).mount('#app')
