import { MotionPlugin } from '@lib'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const app = createApp(App)

app.use(MotionPlugin)

app.mount('#app')