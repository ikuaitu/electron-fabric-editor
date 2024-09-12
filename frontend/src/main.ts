/*
 * @Author: June
 * @Description:
 * @Date: 2024-07-24 17:26:12
 * @LastEditors: June
 * @LastEditTime: 2024-09-12 10:08:05
 * @FilePath: \element-fabric-editor\src\main.ts
 */
import '@/assets/fonts/font.css'
import '@/styles/index.scss'
// 自定义字体文件
import '@/styles/reset.scss'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import { createApp } from 'vue'
import { VueMasonryPlugin } from 'vue-masonry'
import VueLazyLoad from 'vue3-lazyload'
import App from './App.vue'
import i18n from './language/index'
import { setupRouter, router } from './router'
import { setupStore } from './store'

async function bootstrap() {
  const app = createApp(App)
  await setupRouter(app)
  await setupStore(app)
  app.use(VueMasonryPlugin)
  app.use(i18n)
  app.use(VueLazyLoad, {})
  await router.isReady()
  app.mount('#app')
}

bootstrap()
