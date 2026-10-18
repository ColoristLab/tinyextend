# tinyextend

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.tslang.org)
[![Test](https://img.shields.io/github/actions/workflow/status/ColoristLab/tinyextend/tests.yml?label=Test&logo=github&style=flat-square&branch=main)](https://github.com/ColoristLab/tinyextend/actions/workflows/tests.yml)
[![codecov](https://codecov.io/github/ColoristLab/tinyextend/graph/badge.svg?token=YR846BMB6Y)](https://codecov.io/github/ColoristLab/tinyextend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ColoristLab/tinyextend/blob/main/LICENSE)
---

jQuery $.extend() 的现代化替代品。

## 特性

- ✅ 零依赖
- ✅ 极小体积（minified + brotli ≤ 300B）
- ✅ 浅合并与深合并
- ✅ Symbol 属性支持
- ✅ 循环引用安全
- ✅ 适合作为 JavaScript 插件的配置合并依赖

## 基本用法

### 基本合并

默认进行浅合并：

```js
import { extend } from "tinyextend";

const defaults = {
  theme: "light",
  duration: 300,
};

const options = extend({}, defaults, {
  theme: "dark",
});

console.log(options);
// {
//   theme: "dark",
//   duration: 300
// }
```

后面的对象会覆盖前面的同名属性。

### 合并多个对象

可以同时合并多个源对象：

```js
const options = extend({}, defaults, userOptions, runtimeOptions);
```

合并顺序从左到右，后面的对象具有更高优先级。

### 深度合并

传入 `true` 作为第一个参数，可以启用深度合并：

```js
const defaults = {
  animation: {
    enabled: true,
    duration: 300,
  },
};

const options = extend(true, {}, defaults, {
  animation: {
    duration: 500,
  },
});

console.log(options);
// {
//   animation: {
//     enabled: true,
//     duration: 500
//   }
// }
```

### 用于插件配置

`tinyextend` 特别适合用于 JavaScript 插件的默认配置合并：

```js
const defaults = {
  theme: "light",
  animation: true,
  duration: 300,
};

function createPlugin(options = {}) {
  const config = extend(true, {}, defaults, options);

  // 使用 config 初始化插件
}
```

这样可以将**默认配置**、**用户配置**清晰地组合起来。

### 支持 Symbol 属性

除了普通字符串属性，`tinyextend` 也会合并对象自身的 `Symbol` 属性：

```js
const key = Symbol("key");

const source = {
  [key]: "value",
};

const target = extend({}, source);

console.log(target[key]);
// "value"
```

### 支持循环引用

深度合并时可以安全处理循环引用：

```js
const source = {
  name: "foo",
};

source.self = source;

const target = extend(true, {}, source);

console.log(target.self === target);
// true
```

`tinyextend` 使用 `WeakMap` 跟踪已经处理过的对象，避免循环引用导致无限递归。
