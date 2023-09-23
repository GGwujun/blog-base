# Webpack 模块

webpack 本身维护了一套模块系统，这套模块系统兼容了所有前端历史进程下的模块规范，包括amd、commonjs、es6、amd等，本文主要针对commonjs、es6、amd规范进行说明。



### 问题思考

- 为何有的地方使用require去引用一个模块时需要加上default？require('xx').default?
- 经常在各大UI组件引用的文档上会看到说明import { button } from 'xx-ui'这样会引入所有组件内容，需要添加额外的 babel 配置，比如babel-plugin-component？
- 为什么可以使用 es6 的 import 去引用 commonjs 规范定义的模块，或者反过来也可以又是为什么？
- 我们在浏览一些 npm 下载下来的 UI 组件模块时（比如说 element-ui 的 lib 文件下），看到的都是 webpack 编译好的 js 文件，可以使用 import 或 require 再去引用。但是我们平时编译好的 js 是无法再被其他模块 import 的，这是为什么？
- babel 在模块化的场景中充当了什么角色？以及 webpack ？哪个启到了关键作用？
- 听说 es6 还有tree-shaking功能，怎么才能使用这个功能？

### CommonJS

1. 所有要输出的对象统统挂载在 `module.exports` 上，然后暴露给外界
2. 通过 `require` 加载别的模块，`require` 的返回值就是模块暴露的对象
3. CommonJS 是一个**单对象**输出，**单对象**加载的模型

### ES6

1. 可通过以下方式输出任何对模块内部的引用
   1. `export { A, B }`
   2. `export { A as a, B }`
   3. `export default A`
   4. `export const A = { }`
2. 通过以下方式加载模块中输出的任意引用
   1. `import A from './module'`
   2. `import * as A from './module'`
   3. `import { A, B } from './module'`
   4. `import { A as a, B } from './module'`

1. ES6 module 是一个**多对象**输出，**多对象**加载的模型

### module在webpack中的形式

```javascript
{
  i:moduleId,//module的索引
  l:false,//是否是安装了，webpack会对module做缓存
  exports:{}//module的源代码，最终都会通过这个暴露出去
}
```

### 导出模块被打包

##### es6 export default

```javascript
(function (module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony default export */
  __webpack_exports__["default"] = (function (a, b) { return a + b; });
  /***/
})
```

##### es6 export

```javascript
(function (module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony export (binding) */
  __webpack_require__.d(__webpack_exports__, "dsx", function () { return dsx; });
  function dsx() {
    console.log('dsx');
  }
})
```

##### es6 export add export default

```javascript
(function (module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony export (binding) */
  __webpack_require__.d(__webpack_exports__, "dsx", function () { return dsx; });
  /* harmony default export */
  __webpack_exports__["default"] = (function (a, b) {
    return a + b;
  });
  function dsx() {
    console.log('dsx');
  }
})
```

##### common module.exports

```javascript
module.exports = function (a, b) {
  return a - b;
};
// ------- 最后被编译的结果是原样输出
(function (module, exports) {
  module.exports = function (a, b) {
    return a - b;
  };
})
```

##### common  module.exports add exports

```javascript
module.exports = function (a, b) {
    return a - b;
};
exports.dsx = function () { }
// ------- 最后被编译的结果是原样输出
(function (module, exports) {
  module.exports = function (a, b) {
    return a - b;
  };
  exports.dsx = function () { }
})
```

##### amd define

```javascript
define(function (require, factory) {
    "use strict";
    return function (a, b) {
        return a * b;
    };
});
// ------- 最后被编译的结果:
(function (module, exports, __webpack_require__) {
  var __WEBPACK_AMD_DEFINE_RESULT__;
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require, factory) {
    "use strict";
    return function (a, b) {
      return a * b;
    };
  }).call(exports, __webpack_require__, exports, module),
    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
})
```

### 导入模块被打包

##### es6 async = false

```javascript
//__webpack_require__函数返回 module.exports
// --------------------------------------------------------------------------------------------
// import es6 from './es6'
var _vendor_es6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es6 */ "./es6.js");
_vendor_es6__WEBPACK_IMPORTED_MODULE_0__["default"] //使用
// import {es6} from './es6'
var _vendor_es6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es6 */ "./es6.js");
_vendor_es6__WEBPACK_IMPORTED_MODULE_0__["es6"] //使用
// import dsx, { dsx2 } from './vendor/es6';
var _vendor_es6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es6 */ "./es6.js");
console.log(_vendor_es6__WEBPACK_IMPORTED_MODULE_0__["default"]);
console.log(_vendor_es6__WEBPACK_IMPORTED_MODULE_0__["dsx2"])
// import * as dsx from './vendor/es6';
var _vendor_es6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es6 */ "./es6.js");
console.log(_vendor_es6__WEBPACK_IMPORTED_MODULE_0__);
```

##### es6 async = true

```javascript
import('./es6').then((show) => {
    show(1, 2);
});
// ------- 最后被编译的结果:
__webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./es6 */ "./es6.js")).then((__webpack_exports__) => {
    //es6 其实就是 __webpack_exports__ 对象
    __webpack_exports__.default(1, 2);
    __webpack_exports__.dsx;
});
```

##### common async = false

```javascript
var minus = require("./vendor/minus");
console.log("minus(1, 2) = ", minus(1, 2));
// ------- 最后被编译的结果:
var minus = __webpack_require__(/*! ./vendor/common */ "./src/vendor/common.js");
console.log("minus(1, 2) = ", minus(1, 2));
```

##### common async = true

```javascript
var minus = require("./vendor/common");
console.log("minus(1, 2) = ", minus(1, 2));

require.ensure(["./vendor/common"], function (minus) {
    console.log("minus(1, 2) require.ensure= ", minus(1, 2));
}, 'dsx');
// ------- 最后被编译的结果:
(function (module, exports, __webpack_require__) {
  var minus = __webpack_require__(/*! ./vendor/common */ "./src/vendor/common.js");
  console.log("minus(1, 2) = ", minus(1, 2));
  Promise.resolve(/*! require.ensure */).then((function (minus) {
    console.log("minus(1, 2) require.ensure= ", minus(1, 2))
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
})
```

```javascript
require.ensure(["./vendor/common"], function (minus) {
    console.log("minus(1, 2) require.ensure= ", minus(1, 2));
}, 'dsx');
// ------- 最后被编译的结果:
(function (module, exports, __webpack_require__) {
  __webpack_require__.e(/*! require.ensure | dsx */ "dsx").then((function (minus) {
    console.log("minus(1, 2) require.ensure= ", minus(1, 2));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
})
```

##### amd  async=true

```javascript
require(["./vendor/amd"], function (multi) {
    console.log("multi(1, 2) = ", multi(1, 2));
});
// ------- 最后被编译的结果:
(function (module, exports, __webpack_require__) {
  __webpack_require__.e(/*! AMD require */ 0).then(function () {
    var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(/*! ./amd */ "./amd.js")];
    (function (multi) {
      console.log("multi(1, 2) = ", multi(1, 2));
    }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);
  }).catch(__webpack_require__.oe);
})
```

### 参考：

[前端模块化：CommonJS,AMD,CMD,ES6](https://juejin.im/post/5aaa37c8f265da23945f365c)

[import、require、export、module.exports详解](https://github.com/xiaoxiaoaobama/_blog/issues/6)

[import、require、export、module.exports 混合详解](https://github.com/ShowJoy-com/showjoy-blog/issues/39)

[webpack解惑：require的五种用法](https://www.cnblogs.com/lvdabao/p/5953884.html)

