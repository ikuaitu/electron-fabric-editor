<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-12 09:52:22
 * @LastEditTime: 2024-09-12 11:08:55
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\views\home\components\Panel.vue
-->
<template>
  <div class="w-full relative">
    <div
      class="w-full absolute left-0 top-0 right-0 h-48px bg-#fff z-1 flex justify-between items-center box-border px-10px border-b-#eef2f8 border-b-solid border-b-1px"
    >
      <template v-if="isSearch">
        <el-input placeholder="请输入" @blur="isSearch = false" />
      </template>

      <template v-else>
        <ul class="h-full flex-1 flex justify-start items-center">
          <li
            class="cursor-pointer mr-20px"
            :class="[
              tabType === 'workspace' ? 'text-#333' : 'text-[var(--grey)]'
            ]"
            @click="handleTab('workspace')"
          >
            画布
          </li>
          <li
            class="cursor-pointer"
            :class="[tabType === 'layer' ? 'text-#333' : 'text-[var(--grey)]']"
            @click="handleTab('layer')"
          >
            图层
          </li>
        </ul>
        <div>
          <el-icon class="mr-10px"><Plus /></el-icon>
          <el-icon @click="isSearch = true"><Search /></el-icon>
        </div>
      </template>
    </div>
    <div class="w-full pt-48px box-border p-20px">
      <template v-if="tabType === 'workspace'"> Workspace </template>
      <template v-else-if="tabType === 'layer'"> layer </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Search } from '@element-plus/icons-vue'
// import { Workspace, Layer } from './index'
import { debounce } from 'lodash-es'

const props = defineProps({
  panelKey: {
    type: String,
    required: true
  }
})
const tabType = ref(props.panelKey)
const isSearch = ref(false)
const handleTab = debounce(function (type: string) {
  tabType.value = type
}, 250)

watch(
  () => props.panelKey,
  (val) => {
    tabType.value = val
  }
)
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  box-shadow: none;
}
</style>
