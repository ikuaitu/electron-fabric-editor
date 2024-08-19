/*
 * @Author: June
 * @Description:
 * @Date: 2023-10-29 12:18:14
 * @LastEditors: June
 * @LastEditTime: 2024-08-19 14:52:13
 */
import { createI18n } from 'vue-i18n'
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import US from './en.json'
import CN from './zh.json'
import { getLocal, setLocal } from '@/utils/local'
import { LANG } from '@/config/constants/app'

const messages = {
  en: Object.assign(US, en), //将自己的英文包和iview提供的结合
  zh: Object.assign(CN, zh) //将自己的中文包和iview提供的结合
}

function getLocalLang() {
  let localLang = getLocal(LANG)
  if (!localLang) {
    let defaultLang = navigator.language
    if (defaultLang) {
      // eslint-disable-next-line prefer-destructuring
      defaultLang = defaultLang.split('-')[0]
      // eslint-disable-next-line prefer-destructuring
      localLang = defaultLang.split('-')[0]
    }
    setLocal(LANG, defaultLang)
  }
  return localLang
}
const lang = getLocalLang()

const i18n = createI18n({
  allowComposition: true,
  globalInjection: true,
  legacy: false,
  locale: lang,
  messages
})

export default i18n
export const t = (key: any) => {
  return i18n.global.t(key)
}
