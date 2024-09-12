/*
 * @Author: June
 * @Description:
 * @Date: 2024-07-24 17:34:22
 * @LastEditors: June
 * @LastEditTime: 2024-09-12 16:35:38
 * @FilePath: /element-fabric-editor/vite.config.mts
 */

import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { isProd, loadEnv, wrapperEnv } from './build/getEnv'
import { exclude, include } from './build/optimize'
import { createVitePlugins } from './build/plugins'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, `${root}/env`)!
  const viteEnv = wrapperEnv(env)
  const envPrefix = 'APP_'

  return {
    base: isProd(mode) ? env.APP_BASE_PATH : '/',
    publicDir: 'public',
    plugins: createVitePlugins(mode, viteEnv),
    server: {
      port: 8080,
      open: true,
      proxy: {
        '/fontFile': {
          target: 'https://github.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fontFile/, '')
        }
      }
    },
    css: {
      postcss: {
        plugins: [autoprefixer]
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${resolve(__dirname, 'src/styles/variable.scss')}";`
        }
      }
    },
    envPrefix,
    optimizeDeps: { include, exclude },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      },
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css', '.scss']
    },
    build: {
      target: 'es2015',
      outDir: resolve(__dirname, 'dist'),
      assetsDir: 'assets',
      assetsInlineLimit: 8192,
      // sourcemap: !isProd,
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js'
        }
      }
    }
  }
})
