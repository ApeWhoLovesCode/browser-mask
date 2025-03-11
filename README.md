## 描述

<img src="./assets/icon.svg" style="width: 200px" />

用于调整浏览器中某个页面的亮度。

| 描述  | 快捷键         |
| ----- | -------------- |
| 开/关 | Ctrl Shift M   |
| 亮度  | Ctrl Shift +/- |

![browser-mask-demo](https://github.com/ApeWhoLovesCode/browser-mask/blob/main/assets/browser-mask-demo.gif)

## 使用

[下载 browser-mask](https://github.com/ApeWhoLovesCode/browser-mask/tree/main/build/browser-mask.zip)

将下载后的压缩包解压后，将文件夹拖拽添加到浏览器的扩展程序中即可使用。


## 运行

### 下载依赖

```bash
cnpm i
```

npm 和 pnpm 安装依赖会出现报错

### 报错

#### sharp@0.32.6/node_modules/sharp 安装不上

使用 cnpm 安装

```bash
npm i -g cnpm
cnpm i
```

还不行就切换 node 版本为 18.17.0，重新安装

```bash
nvm install 18.17.0
nvm use 18
cnpm i
```