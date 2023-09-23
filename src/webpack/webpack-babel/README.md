### Webpack babel

ES6是2015年发布的下一代javascript语言标准，它引入了新的语法和API，使我们编写js代码更加得心应手，比如class、let、for…of、promise等，但是可惜的是这些js新特性只被最新版本的浏览器支持，但是低版本浏览器并不支持，那么低版本浏览器下就需要一个转换工具，把es6代码转换成浏览器能识别的代码，babel就是这样的一个工具。可以理解为 babel是javascript语法的编译器。



### 问题思考

- 我们平时在使用的vue、react和angular，我们写的代码已经不是原来的html和css了，而是.vue、jsx等这些语法，包括我们使用的新的api，打包编译之后浏览器为什么可以执行？
- 为什么有时我们还需要**polyfill**？
- 大家肯定知道**babel-polyfill**和**babel-runtime**，那么他们有什么区别？

### [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)

Babel为了方便使用者，提供的配置预设，可以简单上手使用Babel。一个preset最终返回一个babel配置对象,@babel/preset-env返回的就是Babel的plugin集合：

```javascript
// 一个preset的返回示例
module.exports = () => ({
  presets: [
    require("@babel/preset-env"),
  ],
  plugins: [
    [require("@babel/plugin-proposal-class-properties"), { loose: true }],
    require("@babel/plugin-proposal-object-rest-spread"),
  ],
});
```

> `@babel/preset-env` is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s). This both makes your life easier and JavaScript bundles smaller!
>
> It is important to note that `@babel/preset-env` does *not* support `stage-x` plugins

### 模块导入转换规则

##### ES6 module

```javascript
import { NormalExport } from 'normal'
import { HasRenamed as RenameAgain } from 'rename'
import DefaultExport from 'default'
import * as All from 'all'

NormalExport()
RenameAgain()
DefaultExport()
All()

-------------------------转换后：

"use strict"

// function _interopRequireWildcard(obj) {
//     if (obj && obj.__esModule) { return obj; }
//     else {
//         var newObj = {};
//         if (obj != null) {
//             for (var key in obj) {
//                 if (Object.prototype.hasOwnProperty.call(obj, key)) {
//                     var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
//                     if (desc.get || desc.set) {
//                         Object.defineProperty(newObj, key, desc);
//                     } else { newObj[key] = obj[key]; }
//                 }
//             }
//         } newObj["default"] = obj; return newObj;
//     }
// }
var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

// function _interopRequireDefault(obj) {
//     return obj && obj.__esModule ? obj : { "default": obj };
// }
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _normal = require("normal");

var _rename = require("rename");

var _default = _interopRequireDefault(require("default"));

var All = _interopRequireWildcard(require("all"));

(0, _normal.NormalExport)();
(0, _rename.HasRenamed)();
(0, _default["default"])();
All();
```

### 模块导出转换规则

##### ES6 module

```javascript
export const InlineExport = {}
const NormalExport = {}
const RenameExport = {}
const DefaultExport = {}

export { NormalExport }
export { RenameExport as HasRenamed }
export default DefaultExport

-------------------------转换后：

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = exports.HasRenamed = exports.NormalExport = exports.InlineExport = void 0;
var InlineExport = {};
exports.InlineExport = InlineExport;
var NormalExport = {};
exports.NormalExport = NormalExport;
var RenameExport = {};
exports.HasRenamed = RenameExport;
var DefaultExport = {};
var _default = DefaultExport;
exports["default"] = _default;
```

### 分析

目前发现babel只会转换es6的module，其他common和amd不会转换。具体转换规则如上：

##### __esModule

给模块的输出对象增加 `__esModule` 是为了将不符合 Babel 要求的 CommonJS 模块转换成符合要求的模块，这一点在 `require` 的时候体现出来。

如果加载模块之后，发现加载的模块带着一个 `__esModule` 属性，Babel 就知道这个模块肯定是它转换过的，这样 Babel 就可以放心地从加载的模块中调用 `exports.default` 这个导出的对象，也就是 ES6 规定的默认导出对象，所以这个模块既符合 CommonJS 标准，又符合 Babel 对 ES6 模块化的需求。

然而如果 `__esModule` 不存在，也没关系，Babel 在加载了一个检测不到 `__esModule` 的模块时，它就知道这个模块虽然符合 CommonJS 标准，但可能是一个第三方的模块，Babel 没有转换过它，如果以后直接调用 `exports.default` 是会出错的，所以现在就给它补上一个 `default` 属性，就干脆让 `default` 属性指向它自己就好了，这样以后就不会出错了。

##### 逗号表达式（(0, _normal.NormalExport)()）

这个逗号表达式是 JavaScript 的语言特性，具体含义是这样的：整个逗号表达式都会从左到右执行一遍，然后逗号表达式的值等于最后一个逗号之后的表达式的值。这跟 C/C++ 等其他 C 类语言是一样的。

但是这句话对 JavaScript 有个特殊含义，如果执行 `(0, foo.bar)()`，这个逗号表达式等价于执行 `foo.bar()`，但是执行时的上下文环境会被绑定到全局对象身上，所以实际上真正等价于执行 `foo.bar.call(global)`。

### 参考文章

- [了解Babel6&7生态](https://github.com/creeperyang/blog/issues/25)