/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-19 12:53:30
 * @LastEditTime: 2024-09-12 16:49:20
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\uno.config.ts
 */
import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'
import transformerCompileClass from '@unocss/transformer-compile-class' // 将一组类编译为一个类

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetTypography()],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
  theme: {
    colors: {
      primary: '#409eff'
    }
  },
  shortcuts: [{ 'wh-full': 'w-full h-full' }, { 'f-center': 'flex justify-center items-center' }]
})
