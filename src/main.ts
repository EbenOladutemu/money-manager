import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/scss/main.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

createApp(App).use(router).mount('#app')
pinia.use(piniaPluginPersistedstate)

document.title = 'My Money Manager'

console.log(process.env)

if (process.env.NODE_ENV == 'production') {
  // console.log = () => {
  //   //
  // }
}
