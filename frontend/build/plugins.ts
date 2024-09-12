/*
 * @Description:
 * @Author: June
 * @Date: 2024-08-21 13:03:57
 * @LastEditTime: 2024-09-12 16:37:44
 * @LastEditors: June
 */
/*
 * @Description:
 * @Author: June
 * @Date: 2024-08-21 13:03:57
 * @LastEditTime: 2024-08-21 13:12:03
 * @LastEditors: June
 */
import { PluginOption } from 'vite'
// import electron from 'vite-plugin-electron'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Unocss from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { isProd } from './getEnv'

/**
 * 创建 vite 插件
 * @param viteEnv
 */
export const createVitePlugins = (
  mode: string,
  viteEnv: any
): (PluginOption | PluginOption[])[] => {
  const _isProd = isProd(mode)
  const { APP_TITLE } = viteEnv
  const plugins: PluginOption | PluginOption[] = [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: '../.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },

      dts: path.join(__dirname, '../typings/auto-imports.d.ts'),
      imports: ['vue', 'vue-router', 'vue-i18n']
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: [path.join(__dirname, '../src/components')],
      dts: path.join(__dirname, '../typings/components.d.ts')
    }),
    createHtmlPlugin({
      minify: _isProd,
      inject: {
        data: {
          title: APP_TITLE
        }
      }
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, '../src/assets/svgs')], // icon存放的目录
      symbolId: 'icon-[name]', // symbol的id
      inject: 'body-last', // 插入的位置
      customDomId: '__svg__icons__dom__' // svg的id
    }),
    Unocss(),
    vueJsx()
  ]
  return plugins
}
