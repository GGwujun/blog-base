# webpack

- 平时开发过程中会遇到各种各样的问题，有时候会花费较多时间，webpack更新也很快，webpack5马上上线，网上资料很多都已过时，所以此系列会长期更新，提供最新的webpack配置
- 提供对webpack的主流程的感性认识，知道能做什么，不能做什么，在遇到问题的时候我可以快速选择合适的工具，设计方案
- 按照资源模块划分，专题提供demo，直至实践，遇到问题可以快速调试demo
- 学习webpack最好的办法就是自己动手配置，说实话webpack的官方文档真不咋地，可以尝试性去看源码，通过实践去学习，提升自己对架构的认识



### 入口

#### webpack

我们通过 `npm run webpack --config xx.js ...` 命令来启动webpack，其实最终执行文件如下：

`node_modules\webpack\bin\webpack.js`

- 判断是否安装了webpack-cli和webpack-command
- 如果一个都没有安装，则会推荐你安装webpack-cli
- 如果已经安装了一个，那么就使用此webpack命令行工具做不同的逻辑处理
- 如果两个都安装了，就输出警告信息（只允许安装一种cli工具）并退出执行

#### webpack-cli

优先使用`webpack-cli`分析，具体可以去看下[源码](https://github.com/webpack/webpack-cli/blob/next/lib/utils/compiler.js)，非常简单，做的几件事：

- 引入了细节更加丰富，更具定制性的命令行工具包 command-line-args
- 分析命令参数，对各个参数进行转换，统一组成新的编译配置项
- 引用`webpack` ，利用这些参数对源代码进行编译和构建

接下来就是真正的webpack编译的开始

### 直击应用

- [Bable](./webpack-01-babel/README.md)
- [webpack中的modules](./webpack-02-modules/README.md)
- [webpack中的模块拆分](./webpack-03-splitChunks/README.md)
- [webpack中打包js综合运用](./webpack-04-js/README.md)
- [webpack中打包css](./webpack-05-css/README.md)

本文章会长期更新，在学习的过程中👏提意见，一起探讨。

