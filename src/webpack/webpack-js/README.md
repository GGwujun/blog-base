## webpack 打包 js

主要搞清楚以下两个问题

1，import module 最后是怎么运行的
2，动态加载是怎么实现的
3，webpack 配置的 output.jsonpFunction 有啥作用

准备以下三个 js
├── index.js
├── local.js
└── dynamic.js
复制代码
内容如下

```javascript
index.js
import local from './local';

local();

import( /* webpackChunkName: "dynamic" */ './dynamic').then(dynamic => {
  dynamic()
});
```
local.js
```javascript
export default function local () {
    alert('local')
}
```
dynamic.js
```javascript
export default function dynamic () {
    alert('dynamic')
}
```
打包配置
```javascript
const path = require('path')
module.exports = {
  entry: {
    app: './src/index.js'
  },
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    jsonpFunction: 'cd-spin'
  }
}
```
随后我们运行下 webpack ，看看 build 后得到的文件
```bash
"rm -rf ./dist && webpack --mode development",
```
接下来我们一起来搞定前面提到的三个问题
1，import module 最后是怎么运行的
最后打包后，生成的 main.js 主体结果如下
```javascript
// 整体是一个闭包，参数 modules 是一个结构为[module path]: Function 的对象
(function (modules) {
    /** 省略代码 **/
    return __webpack_require__("./src/index.js");
})({
    "./src/index.js": (function (module, __webpack_exports__, __webpack_require__) {
         /** 省略代码 **/
    }),
    "./src/local.js": (function (module, __webpack_exports__, __webpack_require__) {
         /** 省略代码 **/
    })
})
```
从上面的闭包中，我们看到在闭包函数的最后，调用了  __webpack_require__("./src/index.js"); , webpack_require 看名字就知道，就是加载一个 module。整体执行过程如下：
	
     1，会有一个名为 installedModules 的对象，以 module Id 作为 key 来缓存 module
     2,  module 中 export 的数据，会挂载在 installedModules.exports 中
     3，如果 module id 在 installedModules 存在，说明已经加载过了，直接返回对应的 exports，也就是说 import 一次之后，后续都是直接拿到上一次的执行结果
     4, 执行前面 modules 挂载进行的 moudle 方法，传入三个参数：module, module.exports, __webpack_require__
     5，返回 module.exports;
     
```javascript
	// The module cache
	var installedModules = {};
 	// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}
```
加载 local.js 的时候，也就是直接调用 webpack_require
```javascript
	"./src/index.js": (function (module, __webpack_exports__, __webpack_require__) {

			"use strict";
			// local.js 直接使用 __webpack_require__ 去加载
			var _local__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/local.js");
			
			(_local__WEBPACK_IMPORTED_MODULE_0__["default"])();

			__webpack_require__.e("dynamic").then(
				__webpack_require__.bind(null, "./src/dynamic.js")).then(dynamic => {
					dynamic()
				});

		})
```

2，动态加载是怎么实现的
在前面的我们知道了，正常所有模块都是定义在 整个闭包的 modules 参数中，webpack_require 就是根据 module name 去这里读取对应的模块而已
但是对于动态加载的 js ，一开始并不存在于这个 modules 中，但是毫无疑问，为了保证能正常被读取到，动态加载的模块也是要注册到这个 modules 中， 那么它是怎么将其注册进去的呢？
```javascript
// 调用了  __webpack_require__.e
__webpack_require__.e("dynamic").then(
	__webpack_require__.bind(null, "./src/dynamic.js")).then(dynamic => {
		dynamic()
});
```
我们来看看 webpack_require.e 的实现
```javascript
	// 主要作用:
   	// 创建一个 script 标签去动态加载个 chunk js
	// 返回一个 Promise， 标示这个动态 chunk js 的加载状态
	// 设置 installedChunks = [resolve, reject, promise]
	// 这里 Promise 会在 动态 js 加载执行完毕后，才会变成 resolve 状态
	__webpack_require__.e = function requireEnsure(chunkId) {
		var promises = [];
		// installedChunks 保存了所有 chunk 的加载状态
		var installedChunkData = installedChunks[chunkId];
		if (installedChunkData !== 0) { 

			// 如果在 installedChunks 已存在，但是不为 0 ，表示正在加载中 
			if (installedChunkData) {
				promises.push(installedChunkData[2]);
			} else {
				// 定义一个 Promise 标示加载状态
				// installedChunks = [resolve, reject, promise]
				var promise = new Promise(function (resolve, reject) {
					installedChunkData = installedChunks[chunkId] = [resolve, reject];
				});
				promises.push(installedChunkData[2] = promise);

				// 下面就是创建一个 script 去加载，省略...
				// start chunk loading
			}
		}
		return Promise.all(promises);
	};
```
复制代码
那么，回到我们上面的问题，动态的 chunk 是怎么注册到 modules 中的呢？
我们看看  dynamic.js 中的代码
```javascript
// 调用了一个全局的 jsonp 数组的 push 
(window["jsonp"] = window["jsonp"] || []).push([["dynamic"], {
  "./src/dynamic.js": (function (module, __webpack_exports__, __webpack_require__) {
    // 省略
  })
}])
```
这个 jsonp 数组，在前面我们提到的整个必包函数中有定义
代码如下，它干了这么一件事情：
1，挟持 jsonp 数组的 push 方法
2，动态记载的 chunk js 调用 push 时，将之前调用 webpack_require.e 生成的 promise 设置为 resolve 状态，然后将 chunk 注入到 modules 中

```javascript
var jsonpArray = window["jsonp"] = window["jsonp"] || [];
	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
	// 挟持了 push 方法，动态加载的 js，调用的是下面的 webpackJsonpCallback 方法
	jsonpArray.push = webpackJsonpCallback;
	jsonpArray = jsonpArray.slice();
	for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
	var parentJsonpFunction = oldJsonpFunction;

	function webpackJsonpCallback(data) {
		var chunkIds = data[0];
		var moreModules = data[1];

		var moduleId, chunkId, i = 0, resolves = [];
		for (; i < chunkIds.length; i++) {
			chunkId = chunkIds[i];
			if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {1`
				// Promise 的 resolve
				resolves.push(installedChunks[chunkId][0]);
			}
			// 标示该 chunk 已经加载过了
			installedChunks[chunkId] = 0;
		}
		for (moduleId in moreModules) {
			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
				// 将 chunk 注册到 modules 中
				modules[moduleId] = moreModules[moduleId];
			}
		}
		if (parentJsonpFunction) parentJsonpFunction(data);

		while (resolves.length) {
			// 执行 将 __webpack_require__.e 的 Promise 置为 resolve
			resolves.shift()();
		}

	};
```

整个加载过程

3，webpack output.jsonpFunction 的作用
其实就是之前动态加载时，jsonp 这个数组变量的名字
当你的应用存在多个 webpack 打包的 js 文件在运行时（例如微前端场景），如果这个数组变量名称一致，那么在动态加载 chunk 的时候，就会出现错乱