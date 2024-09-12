/*
 * @Author: June
 * @Description: 
 * @Date: 2024-07-26 09:03:55
 * @LastEditTime: 2024-07-26 09:04:05
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\typings\env.d.ts
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}