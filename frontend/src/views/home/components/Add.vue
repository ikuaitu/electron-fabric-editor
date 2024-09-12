<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-03 11:53:37
 * @LastEditTime: 2024-09-12 10:09:33
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\views\home\components\Add.vue
-->
<template>
  <div class="w-full h-fullr">
    <section>
      <div class="h-36px leading-36px font-bold ml-10px">图片</div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-88px ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          v-for="file in filesList"
          :key="file.type"
          @click="handleInsertFile(file.type)"
        >
          <SvgIcon
            :style="{ width: '24px', height: '24px' }"
            :name="file.icon"
            color="#333"
          />
          <span class="text-12px mt-10px">{{ file.name }}</span>
        </li>
      </ul>
    </section>
    <section class="-mt-10px">
      <div class="h-36px leading-36px font-bold ml-10px">文字</div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-88px ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          v-for="text in textList"
          :key="text.type"
          @click="handleAddText(text.type)"
        >
          <SvgIcon
            :style="{ width: '24px', height: '24px' }"
            :name="text.icon"
            color="#333"
          />
          <span class="text-12px mt-10px">{{ text.name }}</span>
        </li>
      </ul>
    </section>
    <section class="-mt-10px">
      <div class="h-36px leading-36px font-bold ml-10px">形状</div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-full ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          v-for="shape in shapeList"
          :key="shape.type"
          @click="handleAddShape(shape.type)"
        >
          <div class="w-24px h-24px" v-html="shape.icon"></div>
        </li>
      </ul>
    </section>
    <section class="-mt-10px">
      <div class="h-36px leading-36px font-bold ml-10px">条码图片</div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-full ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          v-for="code in codesList"
          :key="code.type"
          @click="handleAddCode(code.type)"
        >
          <div class="w-24px h-24px" v-html="code.icon"></div>
        </li>
      </ul>
    </section>

    <!-- 新建设计 -->
    <ModalSize
      title="新建设计"
      v-model:show="showSize"
      @set="customSizeCreate"
    ></ModalSize>
  </div>
</template>

<script lang="ts" setup>
import { textList, shapeList, codesList, filesList } from '@/constants/editor'
import { texts, shapes, codes, files } from '@/enums/editor'
import { debounce } from 'lodash-es'
import { useEditorStore } from '@/store/modules/editor'
import { fabric } from 'fabric'
import { getPolygonVertices } from '@/utils/math'
import { Utils } from '@/lib/core'
import { v4 as uuid } from 'uuid'
import ModalSize from '@/components/common/ModalSize.vue'

const { getImgStr, selectFiles } = Utils
const editorStore = useEditorStore()

const showSize = ref(false)

const customSizeCreate = async (w: number, h: number) => {
  editorStore.editor.clear()
  editorStore.editor.setSize(w, h)
  ElMessage.success('创建成功')
}

// 默认属性
const defaultPosition = { shadow: '', fontFamily: 'arial' }

const handleAddImg = debounce(function () {
  selectFiles({ accept: 'image/*', multiple: true }).then((fileList: any) => {
    Array.from(fileList).forEach((item: any) => {
      getImgStr(item).then((file: any) => {
        insertImgFile(file)
      })
    })
  })
}, 250)

const handleInsertFile = debounce(async function (type: files) {
  const loading = ElLoading.service({
    lock: true,
    body: true
  })
  try {
    switch (type) {
      case files.design:
        showSize.value = true
        break
      case files.img:
        selectFiles({ accept: 'image/*', multiple: true }).then(
          (fileList: any) => {
            Array.from(fileList).forEach((item: any) => {
              getImgStr(item).then((file: any) => {
                insertImgFile(file)
              })
            })
          }
        )
        break
      case files.svg:
        selectFiles({ accept: '.svg', multiple: true }).then(
          (fileList: any) => {
            Array.from(fileList).forEach((item: any) => {
              getImgStr(item).then((file: any) => {
                insertSvgFile(file)
              })
            })
          }
        )
        break
      case files.json:
        editorStore.editor.insert()
        break
      case files.psd:
        await editorStore.editor.insertPSD()
        break
      default:
        break
    }
    loading.close()
  } catch (err) {
    loading.close()
  }
}, 250)

const handleAddText = debounce(function (type: texts) {
  let text: fabric.IText | null
  switch (type) {
    case texts.h1:
      text = new fabric.Textbox('双击编辑标题', {
        ...defaultPosition,
        fontWeight: 'bold',
        fontSize: 80,
        fill: '#000000'
      })
      break
    case texts.h2:
      text = new fabric.Textbox('双击编辑标题', {
        ...defaultPosition,
        fontWeight: 'bold',
        fontSize: 60,
        fill: '#000000'
      })
      break
    case texts.normal:
      text = new fabric.Textbox('双击编辑标题', {
        ...defaultPosition,
        fontSize: 48,
        fill: '#000000'
      })
      break
    default:
      break
  }
  text! && editorStore.editor.addBaseType(text, { center: true })
}, 250)

const handleAddShape = debounce(function (type: shapes) {
  switch (type) {
    case shapes.react:
      const rect = new fabric.Rect({
        ...defaultPosition,
        fill: '#F57274FF',
        width: 400,
        height: 400,
        name: '矩形'
      })
      editorStore.editor.addBaseType(rect, { center: true })
      break
    case shapes.triangle:
      const triangle = new fabric.Triangle({
        ...defaultPosition,
        width: 400,
        height: 400,
        fill: '#92706BFF',
        name: '三角形'
      })
      editorStore.editor.addBaseType(triangle, { center: true })
      break
    case shapes.around:
      const circle = new fabric.Circle({
        ...defaultPosition,
        radius: 150,
        fill: '#57606BFF',
        // id: uuid(),
        name: '圆形'
      })
      editorStore.editor.addBaseType(circle, { center: true })
      break
    case shapes.polygon:
      const polygon = new fabric.Polygon(getPolygonVertices(5, 200), {
        ...defaultPosition,
        fill: '#CCCCCCFF',
        name: '多边形'
      })
      polygon.set({
        // 创建完设置宽高，不然宽高会变成自动的值
        width: 400,
        height: 400,
        // 关闭偏移
        // @ts-ignore
        pathOffset: {
          x: 0,
          y: 0
        }
      })
      editorStore.editor.addBaseType(polygon, { center: true })
      break
    case shapes.line:
      const line = new fabric.Line([100, 100, 10, 10], {
        ...defaultPosition,
        stroke: '#333',
        fill: '#333',
        name: '直线'
      })
      editorStore.editor.addBaseType(line, { center: true })
      break
    default:
      break
  }
}, 250)

const handleAddCode = debounce(function (type: codes) {
  switch (type) {
    case codes.qrcode:
      editorStore.editor.addQrCode()
      break
    case codes.barCode:
      editorStore.editor.addBarcode()
      break
    default:
      break
  }
}, 250)

// 插入图片文件
function insertImgFile(file: any) {
  if (!file) throw new Error('file is undefined')
  const imgEl = document.createElement('img')
  imgEl.src = file
  // 插入页面
  document.body.appendChild(imgEl)
  imgEl.onload = async () => {
    const imgItem = await editorStore.editor.createImgByElement(imgEl)
    editorStore.editor.addBaseType(imgItem, {
      scale: true
    })
    imgEl.remove()
  }
}

// 插入文件元素
function insertSvgFile(svgFile: any) {
  if (!svgFile) throw new Error('file is undefined')
  fabric.loadSVGFromURL(svgFile, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      name: 'defaultSVG',
      id: uuid()
    })
    editorStore.editor.addBaseType(item, {
      scale: true
    })
  })
}
</script>
