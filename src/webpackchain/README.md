# 前端工程化：webpack-chain

<style>.markdown-body{word-break:break-word;line-height:1.75;font-weight:400;font-size:15px;overflow-x:hidden;color:#333}.markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4,.markdown-body h5,.markdown-body h6{line-height:1.5;margin-top:35px;margin-bottom:10px;padding-bottom:5px}.markdown-body h1{font-size:30px;margin-bottom:5px}.markdown-body h2{padding-bottom:12px;font-size:24px;border-bottom:1px solid #ececec}.markdown-body h3{font-size:18px;padding-bottom:0}.markdown-body h4{font-size:16px}.markdown-body h5{font-size:15px}.markdown-body h6{margin-top:5px}.markdown-body p{line-height:inherit;margin-top:22px;margin-bottom:22px}.markdown-body img{max-width:100%}.markdown-body hr{border:none;border-top:1px solid #ddd;margin-top:32px;margin-bottom:32px}.markdown-body code{word-break:break-word;border-radius:2px;overflow-x:auto;background-color:#fff5f5;color:#ff502c;font-size:.87em;padding:.065em .4em}.markdown-body code,.markdown-body pre{font-family:Menlo,Monaco,Consolas,Courier New,monospace}.markdown-body pre{overflow:auto;position:relative;line-height:1.75}.markdown-body pre>code{font-size:12px;padding:15px 12px;margin:0;word-break:normal;display:block;overflow-x:auto;color:#333;background:#f8f8f8}.markdown-body a{text-decoration:none;color:#0269c8;border-bottom:1px solid #d1e9ff}.markdown-body a:active,.markdown-body a:hover{color:#275b8c}.markdown-body table{display:inline-block!important;font-size:12px;width:auto;max-width:100%;overflow:auto;border:1px solid #f6f6f6}.markdown-body thead{background:#f6f6f6;color:#000;text-align:left}.markdown-body tr:nth-child(2n){background-color:#fcfcfc}.markdown-body td,.markdown-body th{padding:12px 7px;line-height:24px}.markdown-body td{min-width:120px}.markdown-body blockquote{color:#666;padding:1px 23px;margin:22px 0;border-left:4px solid #cbcbcb;background-color:#f8f8f8}.markdown-body blockquote:after{display:block;content:""}.markdown-body blockquote>p{margin:10px 0}.markdown-body ol,.markdown-body ul{padding-left:28px}.markdown-body ol li,.markdown-body ul li{margin-bottom:0;list-style:inherit}.markdown-body ol li .task-list-item,.markdown-body ul li .task-list-item{list-style:none}.markdown-body ol li .task-list-item ol,.markdown-body ol li .task-list-item ul,.markdown-body ul li .task-list-item ol,.markdown-body ul li .task-list-item ul{margin-top:0}.markdown-body ol ol,.markdown-body ol ul,.markdown-body ul ol,.markdown-body ul ul{margin-top:3px}.markdown-body ol li{padding-left:6px}.markdown-body .contains-task-list{padding-left:0}.markdown-body .task-list-item{list-style:none}@media (max-width:720px){.markdown-body h1{font-size:24px}.markdown-body h2{font-size:20px}.markdown-body h3{font-size:18px}}</style>

[webpack-chain](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fneutrinojs%2Fwebpack-chain "https://github.com/neutrinojs/webpack-chain") 是什么？`通过链式的方式修改webpack的配置`。

一些列出本人常用的使用 webpack-chain 的方式修改 webpack 配置. 整个文件为：

```
//vue.config.js
module.exports={
  chainWebpack:(webpackConfig)=>{

  }
}

复制代码
```

## [#](#_1%E3%80%81%E4%BF%AE%E6%94%B9entry%E5%92%8Coutput "#_1%E3%80%81%E4%BF%AE%E6%94%B9entry%E5%92%8Coutput") 1、修改 entry 和 output

```
chainWebpack: config => {
  config.entryPoints.clear() // 会把默认的入口清空
  config.entry('main').add('./src/main.js')//新增入口
  config.entry('routes').add('./src/app-routes.js')//新增入口

   config.output
        .path("dist")
        .filename("[name].[chunkhash].js")
        .chunkFilename("chunks/[name].[chunkhash].js")
        .libraryTarget("umd")
        .library();
}

// 其余的output配置
config.output
  .auxiliaryComment(auxiliaryComment)
  .chunkFilename(chunkFilename)
  .chunkLoadTimeout(chunkLoadTimeout)
  .crossOriginLoading(crossOriginLoading)
  .devtoolFallbackModuleFilenameTemplate(devtoolFallbackModuleFilenameTemplate)
  .devtoolLineToLine(devtoolLineToLine)
  .devtoolModuleFilenameTemplate(devtoolModuleFilenameTemplate)
  .filename(filename)
  .hashFunction(hashFunction)
  .hashDigest(hashDigest)
  .hashDigestLength(hashDigestLength)
  .hashSalt(hashSalt)
  .hotUpdateChunkFilename(hotUpdateChunkFilename)
  .hotUpdateFunction(hotUpdateFunction)
  .hotUpdateMainFilename(hotUpdateMainFilename)
  .jsonpFunction(jsonpFunction)
  .library(library)
  .libraryExport(libraryExport)
  .libraryTarget(libraryTarget)
  .path(path)
  .pathinfo(pathinfo)
  .publicPath(publicPath)
  .sourceMapFilename(sourceMapFilename)
  .sourcePrefix(sourcePrefix)
  .strictModuleExceptionHandling(strictModuleExceptionHandling)
  .umdNamedDefine(umdNamedDefine)

复制代码
```

## [#](#_2%E3%80%81%E8%AE%BE%E7%BD%AE%E5%88%AB%E5%90%8Dalias "#_2%E3%80%81%E8%AE%BE%E7%BD%AE%E5%88%AB%E5%90%8Dalias") 2、设置别名 alias

```
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: true,
    chainWebpack: (config)=>{
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'))
            .set('layout',resolve('src/layout'))
            .set('base',resolve('src/base'))
            .set('static',resolve('src/static'))
            .delete('base') // 删掉指定的别名
            // .clear()  会把所有别名都删掉
    }
}

复制代码
```

## [#](#_3%E3%80%81%E4%BF%AE%E6%94%B9%E4%BB%A3%E7%90%86proxy "#_3%E3%80%81%E4%BF%AE%E6%94%B9%E4%BB%A3%E7%90%86proxy") 3、修改代理 proxy

devServe 的配置，请见[这里](https://link.juejin.cn?target=https%3A%2F%2Fwww.webpackjs.com%2Fconfiguration%2Fdev-server%2F "https://www.webpackjs.com/configuration/dev-server/")

```
  chainWebpack: config => {
    config.devServer.port(8888)
      .open(true)
      .proxy({'/dev': {
                 target: 'http://123.57.153.106:8080/',
                 changeOrigin: true,
                 pathRewrite: {
                   '^/dev': ''
                 }
               }
           })
  }
// chain其他队proxy的配置
config.devServer
  .bonjour(bonjour)
  .clientLogLevel(clientLogLevel)
  .color(color)
  .compress(compress)
  .contentBase(contentBase)
  .disableHostCheck(disableHostCheck)
  .filename(filename)
  .headers(headers)
  .historyApiFallback(historyApiFallback)
  .host(host)
  .hot(hot)
  .hotOnly(hotOnly)
  .https(https)
  .inline(inline)
  .info(info)
  .lazy(lazy)
  .noInfo(noInfo)
  .open(open)
  .openPage(openPage)
  .overlay(overlay)
  .pfx(pfx)
  .pfxPassphrase(pfxPassphrase)
  .port(port)
  .progress(progress)
  .proxy(proxy)
  .public(public)
  .publicPath(publicPath)
  .quiet(quiet)
  .setup(setup)
  .socket(socket)
  .staticOptions(staticOptions)
  .stats(stats)
  .stdin(stdin)
  .useLocalIp(useLocalIp)
  .watchContentBase(watchContentBase)
  .watchOptions(watchOptions)

复制代码
```

## [#](#_4%E3%80%81%E6%B7%BB%E5%8A%A0%E6%8F%92%E4%BB%B6%E5%8F%8A%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6%E5%8F%82%E6%95%B0 "#_4%E3%80%81%E6%B7%BB%E5%8A%A0%E6%8F%92%E4%BB%B6%E5%8F%8A%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6%E5%8F%82%E6%95%B0") 4、添加插件及修改插件参数

插件相关配置请见[这里](https://link.juejin.cn?target=https%3A%2F%2Fwww.webpackjs.com%2Fconfiguration%2Fplugins%2F%23plugins "https://www.webpackjs.com/configuration/plugins/#plugins")

**添加插件**

```
// 添加API
config
  .plugin(name)
  .use(WebpackPlugin, args)

// 一个例子
const fileManager = require("filemanager-webpack-plugin");
...
//注意：use部分，不能使用new的方式创建插件实例
webpackConfig.plugin("zip").use(fileManager, [
    {
      onEnd: {
        archive: [
          {
            source: "dist",
            destination: zipName
          }
        ]
      }
    }
  ]);

复制代码
```

**修改插件参数**

```
// 可以使用tap方式，修改插件参数
config
  .plugin(name)
  .tap(args => newArgs)

// 一个例子
config
  .plugin('env')
  //使用tag修改参数
  .tap(args => [...args, 'SECRET_KEY']);

复制代码
```

## [#](#_5%E3%80%81%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6%E5%88%9D%E5%A7%8B%E5%8C%96%E5%8F%8A%E7%A7%BB%E9%99%A4%E6%8F%92%E4%BB%B6 "#_5%E3%80%81%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6%E5%88%9D%E5%A7%8B%E5%8C%96%E5%8F%8A%E7%A7%BB%E9%99%A4%E6%8F%92%E4%BB%B6") 5、修改插件初始化及移除插件

**修改插件初始化**

```
config
  .plugin(name)
  .init((Plugin, args) => new Plugin(...args));

复制代码
```

**移除插件**

```
 chainWebpack: config => {
		config.plugins.delete('prefetch')
		// 移除 preload 插件
		config.plugins.delete('preload');
	}

复制代码
```

## [#](#_6%E3%80%81%E5%9C%A8xx%E6%8F%92%E4%BB%B6%E5%89%8D%E8%B0%83%E7%94%A8-%E5%9C%A8xx%E6%8F%92%E4%BB%B6%E4%B9%8B%E5%90%8E%E8%B0%83%E7%94%A8 "#_6%E3%80%81%E5%9C%A8xx%E6%8F%92%E4%BB%B6%E5%89%8D%E8%B0%83%E7%94%A8-%E5%9C%A8xx%E6%8F%92%E4%BB%B6%E4%B9%8B%E5%90%8E%E8%B0%83%E7%94%A8") 6、在 xx 插件前调用/在 xx 插件之后调用

有时候需要 xx 插件在 aa 插件`之前`调用。

```
config
  .plugin(name)
    .before(otherName)

// 一个例子：ScriptExtWebpackPlugin插件在HtmlWebpackTemplate插件前调用

config
  .plugin('html-template')
    .use(HtmlWebpackTemplate)
    .end()
  .plugin('script-ext')
    .use(ScriptExtWebpackPlugin)
    .before('html-template');

复制代码
```

有时候需要 xx 插件在 aa 插件`之后`调用。

```
config
  .plugin(name)
    .after(otherName)

// 一个例子html-template在script-ext之后调用

config
  .plugin('html-template')
    .after('script-ext')
    .use(HtmlWebpackTemplate)
    .end()
  .plugin('script-ext')
    .use(ScriptExtWebpackPlugin);

复制代码
```

## [#](#_7%E3%80%81performance-%E6%80%A7%E8%83%BD "#_7%E3%80%81performance-%E6%80%A7%E8%83%BD") 7、performance 性能

配置请见 webpack 参数:[performance](https://link.juejin.cn?target=https%3A%2F%2Fwww.webpackjs.com%2Fconfiguration%2Fperformance%2F%23performance "https://www.webpackjs.com/configuration/performance/#performance")

```
config.performance
  .hints(hints)//false | "error" | "warning"。打开/关闭提示
  .maxEntrypointSize(maxEntrypointSize)//入口起点表示针对指定的入口，对于所有资源，要充分利用初始加载时(initial load time)期间。此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示。默认值是：250000
  .maxAssetSize(maxAssetSize)//资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积，控制 webpack 何时生成性能提示。默认值是：250000
  .assetFilter(assetFilter)//此属性允许 webpack 控制用于计算性能提示的文件

复制代码
```

## [#](#_8%E3%80%81%E4%BB%A3%E7%A0%81%E5%88%86%E5%89%B2%E5%8F%8A%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96-optimizations "#_8%E3%80%81%E4%BB%A3%E7%A0%81%E5%88%86%E5%89%B2%E5%8F%8A%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96-optimizations") 8、代码分割及性能优化 optimizations

- [optimizations 配置介绍](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Foptimization%2F "https://webpack.js.org/configuration/optimization/")
- [代码分割配置](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fplugins%2Fsplit-chunks-plugin%2F "https://webpack.js.org/plugins/split-chunks-plugin/")
- [代码分割 splitChunk 中文介绍](https://juejin.cn/post/6844903614759043079 "https://juejin.cn/post/6844903614759043079")

```
config.optimization
  .concatenateModules(concatenateModules)
  .flagIncludedChunks(flagIncludedChunks)
  .mergeDuplicateChunks(mergeDuplicateChunks)
  .minimize(minimize) //boolean，默认为true,是否开启压缩
  .namedChunks(namedChunks)
  .namedModules(namedModules)
  .nodeEnv(nodeEnv)
  .noEmitOnErrors(noEmitOnErrors)
  .occurrenceOrder(occurrenceOrder)
  .portableRecords(portableRecords)
  .providedExports(providedExports)
  .removeAvailableModules(removeAvailableModules)
  .removeEmptyChunks(removeEmptyChunks)
  .runtimeChunk(runtimeChunk)
  .sideEffects(sideEffects)
  .splitChunks(splitChunks)//object:代码分割。默认情况下，webpack v4 +为动态导入的模块提供了开箱即用的新通用块策略。
  .usedExports(usedExports)

//举个例子

config.optimization.splitChunks({
     chunks: "async", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
     minSize: 30000, // 最小尺寸，30000
     minChunks: 1, // 最小 chunk ，默认1
     maxAsyncRequests: 5, // 最大异步请求数， 默认5
     maxInitialRequests : 3, // 最大初始化请求书，默认3
     automaticNameDelimiter: '~',// 打包分隔符
     name: function(){}, // 打包后的名称，此选项可接收 function
     cacheGroups:{ // 这里开始设置缓存的 chunks
         priority: 0, // 缓存组优先级
         vendor: { // key 为entry中定义的 入口名称
             chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async)
             test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
             name: "vendor", // 要缓存的 分隔出来的 chunk 名称
             minSize: 30000,
             minChunks: 1,
             enforce: true,
             maxAsyncRequests: 5, // 最大异步请求数， 默认1
             maxInitialRequests : 3, // 最大初始化请求书，默认1
             reuseExistingChunk: true // 可设置是否重用该chunk
         }
     }
});

复制代码
```

## [#](#_9%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BB%A3%E7%A0%81%E5%8E%8B%E7%BC%A9%E5%B7%A5%E5%85%B7 "#_9%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BB%A3%E7%A0%81%E5%8E%8B%E7%BC%A9%E5%B7%A5%E5%85%B7") 9、自定义代码压缩工具

webpack4.x 默认使用的[TerserPlugin](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fplugins%2Fterser-webpack-plugin%2F "https://webpack.js.org/plugins/terser-webpack-plugin/") 做代码压缩。

```
//使用
config.optimization.minimizer.use(WebpackPlugin,args);
//删除
config.optimization.minimizers.delete(name)

// 一个例子

config.optimization
  .minimizer('css')
  .use(OptimizeCSSAssetsPlugin, [{ cssProcessorOptions: { safe: true } }])

// Minimizer plugins can also be specified by their path, allowing the expensive require()s to be
// skipped in cases where the plugin or webpack configuration won't end up being used.
config.optimization
  .minimizer('css')
  .use(require.resolve('optimize-css-assets-webpack-plugin'), [{ cssProcessorOptions: { safe: true } }])

//是要tap修改插件参数
config.optimization
  .minimizer('css')
  .tap(args => [...args, { cssProcessorOptions: { safe: false } }])

复制代码
```

## [#](#_10%E3%80%81%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%96%B0%E7%9A%84-loader "#_10%E3%80%81%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%96%B0%E7%9A%84-loader") 10、添加一个新的 Loader

首先请先了解一下 webpack 如何配置 loader. [官网链接](https://link.juejin.cn?target=https%3A%2F%2Fwww.webpackjs.com%2Fconfiguration%2Fmodule%2F%23module-rules "https://www.webpackjs.com/configuration/module/#module-rules")

```
config.module
  .rule(name)
    .use(name)
      .loader(loader)
      .options(options)

// 一个例子

 config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end()
// 如果是非webpack-chain的话
module:{
  rules:[
    {
      test:/\.graphql$/,
      use::[
        {
          loader:"graphql-tag/loader"
        }
      ]
    }
  ]
}

复制代码
```

## [#](#_11%E3%80%81-%E4%BF%AE%E6%94%B9loader "#_11%E3%80%81-%E4%BF%AE%E6%94%B9loader") 11、 修改 Loader

```
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        })
  }
}

复制代码
```

> **注意** 对于 CSS 相关 loader 来说，我们推荐使用 `css.loaderOptions` 而不是直接链式指定 loader。这是因为每种 CSS 文件类型都有多个规则，而 css.loaderOptions 可以确保你通过一个地方影响所有的规则。

## [#](#_12%E3%80%81-%E6%9B%BF%E6%8D%A2%E4%B8%80%E4%B8%AA%E8%A7%84%E5%88%99%E9%87%8C%E7%9A%84-loader "#_12%E3%80%81-%E6%9B%BF%E6%8D%A2%E4%B8%80%E4%B8%AA%E8%A7%84%E5%88%99%E9%87%8C%E7%9A%84-loader") 12、 替换一个规则里的 Loader

```
// vue.config.js
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()

    // 添加要替换的 loader
    svgRule
      .use('vue-svg-loader')
        .loader('vue-svg-loader')
  }
}

复制代码
```

## [#](#_13%E3%80%81%E4%BD%BF%E7%94%A8when%E5%81%9A%E6%9D%A1%E4%BB%B6%E9%85%8D%E7%BD%AE "#_13%E3%80%81%E4%BD%BF%E7%94%A8when%E5%81%9A%E6%9D%A1%E4%BB%B6%E9%85%8D%E7%BD%AE") 13、使用 when 做条件配置

```
consif.when(condition,truthyFunc,falsyFunc)

// 一个例子，当构建生产包时添加minify插件，否则设置构建类型为source-map
// devtool请见：https://www.webpackjs.com/configuration/devtool/
config
  .when(process.env.NODE_ENV === 'production',
    config => config.plugin('minify').use(BabiliWebpackPlugin),
    config => config.devtool('source-map')
  );

复制代码
```

## [#](#_14%E3%80%81%E4%BD%BF%E7%94%A8tostring-%E6%9F%A5%E7%9C%8Bchain%E5%AF%B9%E5%BA%94%E7%9A%84webpack%E9%85%8D%E7%BD%AE "#_14%E3%80%81%E4%BD%BF%E7%94%A8tostring-%E6%9F%A5%E7%9C%8Bchain%E5%AF%B9%E5%BA%94%E7%9A%84webpack%E9%85%8D%E7%BD%AE") 14、使用 toString\(\)查看 chain 对应的 webpack 配置

**注意** 使用 `toString()`生成的数据，不能直接在`webpack`上使用。

```
config
  .module
    .rule('compile')
      .test(/\.js$/)
      .use('babel')
        .loader('babel-loader');

config.toString();

/*
{
  module: {
    rules: [
      /* config.module.rule('compile') */
      {
        test: /\.js$/,
        use: [
          /* config.module.rule('compile').use('babel') */
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
}
*/

复制代码
```

## [#](#%E5%8F%82%E8%80%83 "#%E5%8F%82%E8%80%83") 参考

- [Vue-cli](https://link.juejin.cn?target=https%3A%2F%2Fcli.vuejs.org%2Fzh%2Fguide%2Fwebpack.html%23%25E4%25BF%25AE%25E6%2594%25B9-loader-%25E9%2580%2589%25E9%25A1%25B9 "https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9")
- [webpack-chain](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fneutrinojs%2Fwebpack-chain%2Ftree%2Fv5 "https://github.com/neutrinojs/webpack-chain/tree/v5")

如果觉得此文对您有用欢迎来个[Star: mrgaogang.github.io](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMrGaoGang%2Fmrgaogang.github.io "https://github.com/MrGaoGang/mrgaogang.github.io")
