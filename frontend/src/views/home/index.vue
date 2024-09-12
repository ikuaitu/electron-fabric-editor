<template>
  <div class="editor-wrap">
    <!-- <el-button @click="test">测试UseModal</el-button> -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="flex items-center">
          <Logo />
          <el-divider direction="vertical" />
          <ImportJson />
          <el-divider direction="vertical" />
          <ImportFile />
          <el-divider direction="vertical" />
          <router-link
            custom
            v-slot="{ navigate }"
            to="/editor/template"
            target="_blank"
          >
            <el-button text @click="navigate">全部模板</el-button>
          </router-link>
          <el-divider direction="vertical" />
          <MyTemplName />

          <el-tooltip :content="$t('grid')">
            <el-switch
              v-model="state.ruler"
              @change="rulerSwitch"
              size="small"
              class="mx-10px"
            />
          </el-tooltip>
          <el-divider direction="vertical" />
          <History />
        </div>
        <div class="flex items-center">
          <a
            class="mr-10px"
            href="https://github.com/ikuaitu/element-fabric-editor"
            target="_blank"
          >
            <img
              src="https://img.shields.io/badge/GitHub-ElementFbricEditor-blue"
              alt="element-fbric-editor"
            />
          </a>
          <PreviewCurrent />
          <el-divider direction="vertical" />
          <Save />
          <el-divider direction="vertical" />
          <Login />
        </div>
      </el-header>
      <el-main>
        <!-- 左侧区域 -->
        <section class="flex justify-start max-w-384px">
          <ul
            class="relative bg-#fff z-1 w-72px flex flex-col items-center pt-10px box-border border-r-#eef2f8 border-r-solid border-r-1px"
          >
            <li
              class="flex flex-col items-center mb-20px cursor-pointer"
              v-for="tab in tabList"
              :key="tab.type"
              @click="tabChange(tab.type, panels.canvas)"
            >
              <div
                class="px-10px f-center py-4px rounded-10px tab-item editor-item"
                :class="[currentTab === tab.type ? 'tab-item_active' : '']"
              >
                <SvgIcon
                  :style="{ width: '24px', height: '24px' }"
                  :name="tab.icon"
                  :color="currentTab === tab.type ? '#000' : '#333'"
                />
              </div>
              <span
                class="text-12px"
                :class="[currentTab === tab.type ? 'font-bold' : '']"
                >{{ tab.name }}</span
              >
            </li>
          </ul>
          <div
            class="relative h-full border-r-#eef2f8 border-r-solid border-r-1px transition-all transition-ease"
            :class="[
              !showSub ? '-ml-312px' : '',
              subType === panels.canvas ? 'w-312px' : 'w-224px'
            ]"
          >
            <template v-if="showSub && subType === panels.canvas">
              <KeepAlive>
                <component
                  :is="
                    currentTab
                      ? tabComMap[currentTab]
                      : tabComMap[editorTabs.template]
                  "
                />
              </KeepAlive>
              <div
                class="inline-block absolute -right-14px top-50% -translate-y-50% z-1 cursor-pointer"
                @click="handleHideSubMenu"
              >
                <img src="@/assets/svgs/close-btn.svg" />
              </div>
            </template>
            <template v-else-if="subType === panels.layer">
              <Layer />
            </template>
          </div>
        </section>

        <!-- 画布区域 -->
        <section class="flex-1 w-full relative overflow-hidden" id="workspace">
          <div class="relative">
            <div class="absolute w-full z-2 inside-shadow"></div>
            <canvas
              class="w-300px h-300px mx-auto"
              id="canvas"
              :class="state.ruler ? 'design-stage-grid' : ''"
            ></canvas>

            <!-- 暂放 -->
            <div
              class="absolute left-30px bottom-10px bg-#fff rounded-4px p-4px"
              @click="handleLayer"
            >
              <SvgIcon
                :style="{ width: '24px', height: '24px' }"
                name="editor-layer"
              />
            </div>

            <DragMode v-if="state.show" />
            <Zoom />
          </div>
        </section>

        <!-- 属性区域 380-->
        <section
          class="right-bar flex-basis-304px box-border overflow-hidden p-10px"
          v-show="state.attrBarShow"
        >
          <div v-if="state.show" style="padding-top: 10px">
            <!-- 未选择元素时 展示背景设置 -->
            <div v-show="!mixinState.mSelectMode">
              <SetSize />
              <BgBar />
            </div>

            <!-- 多选时展示 -->
            <div v-show="mixinState.mSelectMode === 'multiple'">
              <!-- 分组 -->
              <Group />
              <!-- 组对齐方式 -->
              <Align />
              <!-- 居中对齐 -->
              <CenterAlign />
            </div>

            <div
              v-show="mixinState.mSelectMode === 'one'"
              class="attr-item-box"
            >
              <Group />
              <el-divider content-position="left">
                <h4>快捷操作</h4>
              </el-divider>
              <div class="bg-item" v-show="mixinState.mSelectMode">
                <Lock />
                <Delete />
                <Clone />
                <Hide />
                <Edit />
              </div>

              <!-- 居中对齐 -->
              <CenterAlign />
              <!-- 替换图片 -->
              <ReplaceImg />
              <!-- 图片裁切 -->
              <ClipImage />
              <!-- 翻转 -->
              <Flip />
              <!-- 条形码属性 -->
              <AttributeBarcode />
              <!-- 二维码 -->
              <AttributeQrCode />
              <!-- 图片滤镜 -->
              <Filters />
              <!-- 图片描边 -->
              <ImgStroke />
              <!-- 颜色 -->
              <AttributeColor />
              <!-- 字体属性 -->
              <AttributeFont />
              <!-- 字体小数点 -->
              <AttributeTextFloat />
              <!-- 文字内容  -->
              <AttributeTextContent />
              <!-- 位置信息 -->
              <AttributePostion />
              <!-- 阴影 -->
              <AttributeShadow />
              <!-- 边框 -->
              <AttributeBorder />
              <!-- 圆角 -->
              <AttributeRounded />
              <!-- 关联数据 -->
              <AttributeId />

              <!-- 新增字体样式使用 -->
              <el-button @click="canvasEditor.getFontJson()" size="small"
                >获取元素数据</el-button
              >
            </div>
          </div>
        </section>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { fabric } from 'fabric'
import { debounce } from 'lodash-es'
// hooks
import useSelectListen from '@/hooks/useSelectListen'
import { useI18n } from 'vue-i18n'
import { apiHost } from '@/constants/app'
import Editor, {
  DringPlugin,
  AlignGuidLinePlugin,
  ControlsPlugin,
  // ControlsRotatePlugin,
  CenterAlignPlugin,
  LayerPlugin,
  CopyPlugin,
  MoveHotKeyPlugin,
  DeleteHotKeyPlugin,
  GroupPlugin,
  DrawLinePlugin,
  GroupTextEditorPlugin,
  GroupAlignPlugin,
  WorkspacePlugin,
  HistoryPlugin,
  FlipPlugin,
  RulerPlugin,
  MaterialPlugin,
  FontPlugin,
  PolygonModifyPlugin,
  DrawPolygonPlugin,
  FreeDrawPlugin,
  PathTextPlugin,
  PsdPlugin,
  SimpleClipImagePlugin,
  BarCodePlugin,
  QrCodePlugin,
  ImageStroke,
  ResizePlugin,
  LockPlugin,
  AddBaseTypePlugin
} from '@/lib/core'
import { Add, Template, Element, Ai, Text, Image, Mine } from './components'
import { editorTabs, panels } from '@/enums/editor'
import { tabList } from '@/constants/editor'
import { useEditorStore } from '@/store/modules/editor'

// 暂放
import Layer from '@/components/Layer.vue'

defineOptions({
  name: 'Home'
})

const editorStore = useEditorStore()
const { t } = useI18n()

// 二级菜单
const showSub = ref(true)
const subType = ref<panels>(panels.canvas)
const handleHideSubMenu = debounce(function () {
  showSub.value = false
}, 250)
// 左侧tab相关
const currentTab = ref<editorTabs | ''>(editorTabs.template)
const tabChange = debounce(function (type: editorTabs, _subType: panels) {
  currentTab.value = type
  !unref(showSub) && (showSub.value = true)
  unref(subType) !== panels.canvas && (subType.value = _subType)
}, 250)
const tabComMap: Record<editorTabs, any> = {
  [editorTabs.add]: Add,
  [editorTabs.template]: Template,
  [editorTabs.element]: Element,
  [editorTabs.ai]: Ai,
  [editorTabs.text]: Text,
  [editorTabs.image]: Image,
  [editorTabs.mine]: Mine
}

// 暂放 待分离组件
const handleLayer = debounce(function () {
  currentTab.value = ''
  unref(subType) !== panels.layer && (subType.value = panels.layer)
}, 250)

// import { useModal } from '@/hooks/useModal'
// const { Modal } = useModal()

const APIHOST = apiHost

// 创建编辑器
const canvasEditor = new Editor()

const state = reactive({
  show: false,
  toolsBarShow: true,
  attrBarShow: true,
  select: null,
  ruler: true
})

onMounted(() => {
  // 初始化fabric
  const canvas = new fabric.Canvas('canvas', {
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    // imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
    preserveObjectStacking: true // 当选择画布中的对象时，让对象不在顶层。
  })

  // 初始化编辑器
  canvasEditor.init(canvas)
  canvasEditor
    .use(DringPlugin)
    .use(PolygonModifyPlugin)
    .use(AlignGuidLinePlugin)
    .use(ControlsPlugin)
    // .use(ControlsRotatePlugin);
    .use(CenterAlignPlugin)
    .use(LayerPlugin)
    .use(CopyPlugin)
    .use(MoveHotKeyPlugin)
    .use(DeleteHotKeyPlugin)
    .use(GroupPlugin)
    .use(DrawLinePlugin)
    .use(GroupTextEditorPlugin)
    .use(GroupAlignPlugin)
    .use(WorkspacePlugin)
    .use(HistoryPlugin)
    .use(FlipPlugin)
    .use(RulerPlugin)
    .use(DrawPolygonPlugin)
    .use(FreeDrawPlugin)
    .use(PathTextPlugin)
    .use(SimpleClipImagePlugin)
    .use(BarCodePlugin)
    .use(QrCodePlugin)
    .use(FontPlugin, {
      repoSrc: APIHOST
    })
    .use(MaterialPlugin, {
      repoSrc: APIHOST
    })
    .use(PsdPlugin)
    .use(ImageStroke)
    .use(ResizePlugin)
    .use(LockPlugin)
    .use(AddBaseTypePlugin)

  editorStore.setEditor(canvasEditor)
  state.show = true
  // 默认打开标尺
  if (state.ruler) {
    canvasEditor.rulerEnable()
  }

  // 有ID时，打开作品面板
  const route = useRoute()
  if (route?.query?.id) {
    menuActive.value = 'MyMaterial'
  }
})

onUnmounted(() => canvasEditor.destory())
const rulerSwitch = (val) => {
  if (val) {
    canvasEditor.rulerEnable()
  } else {
    canvasEditor.rulerDisable()
  }
  // 使标尺开关组件失焦，避免响应键盘的空格事件
  document.activeElement.blur()
}

// 隐藏工具条
const hideToolsBar = () => {
  state.toolsBarShow = !state.toolsBarShow
}
// 展示工具条
const showToolsBar = (val) => {
  console.log(val)
  menuActive.value = val
  state.toolsBarShow = true
}
// 属性面板开关
const switchAttrBar = () => {
  state.attrBarShow = !state.attrBarShow
}

const { mixinState } = useSelectListen(canvasEditor)

provide('fabric', fabric)
provide('canvasEditor', canvasEditor)
provide('mixinState', mixinState)
</script>

<style lang="scss" scoped>
.editor-wrap {
  .tab-item {
    &_active {
      background-color: #e8eaec !important;
    }
  }
  :deep(.el-header) {
    --height: 45px;
    padding: 0 10px;
    border-bottom: 1px solid #eef2f8;
    background: #fff;
    height: var(--height);
    line-height: var(--height);
    display: flex;
    justify-content: space-between;
  }

  :deep(.el-main) {
    display: flex;
    height: calc(100vh - 45px);
    padding: 0;
    overflow: hidden;
  }

  :deep(.el-menu-item) {
    flex-direction: column;
    justify-content: center;
    height: 60px;
    line-height: 20px;
  }
  .editor-item:hover {
    background: rgba(0, 0, 0, 0.12);
  }
  // 画布内阴影
  .inside-shadow {
    box-shadow: inset 0 0 9px 2px #0000001f;
    pointer-events: none;
  }

  #workspace {
    background: #f1f1f1;
  }

  // 网格背景
  .design-stage-grid {
    --offsetX: 0px;
    --offsetY: 0px;
    --size: 16px;
    --color: #dedcdc;
    background-image: linear-gradient(
        45deg,
        var(--color) 25%,
        transparent 0,
        transparent 75%,
        var(--color) 0
      ),
      linear-gradient(
        45deg,
        var(--color) 25%,
        transparent 0,
        transparent 75%,
        var(--color) 0
      );
    background-position:
      var(--offsetX) var(--offsetY),
      calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
    background-size: calc(var(--size) * 2) calc(var(--size) * 2);
  }

  // 右侧容器
  .right-bar flex-basis-264px box-border overflow-hidden p-10px {
    box-sizing: border-box;
    width: 304px;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
    background: #fff;
  }
}
</style>
