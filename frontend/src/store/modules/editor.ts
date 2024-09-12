/*
 * @Author: June
 * @Description:
 * @Date: 2024-09-12 10:06:32
 * @LastEditTime: 2024-09-12 10:07:17
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\store\modules\editor.ts
 */
import { defineStore } from 'pinia'
import store from '@/store'
import { fabric } from 'fabric'

interface IState {
  editor: any
  canvas: fabric.Canvas | null
  zoom: number
}

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): IState => ({
    editor: null,
    canvas: null,
    zoom: 1 // 缩放比例
  }),
  actions: {
    setEditor(editor: any) {
      this.editor = editor
    },
    setCanvas(ctx: fabric.Canvas) {
      this.canvas = ctx
    },
    setScale(val: number) {
      this.zoom = val
    }
  }
})

// Need to be used outside the setup
export function useEditorStoreWithOut() {
  return useEditorStore(store)
}
