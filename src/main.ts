import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerPlugins } from '@/plugins'
import 'unfonts.css'
import './styles/global.scss'

const app = createApp(App)
app.use(router)
registerPlugins(app)
app.mount('#app')
