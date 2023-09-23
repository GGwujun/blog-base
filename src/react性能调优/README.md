## react优化性能

### 导学篇

- [fps概念](./FPS.md)
- [Performance](./PERFORMACE.md) 
- [React应用优化实践](./REACT.md)

想要优化，需要懂得你所使用的开发语言的渲染原理，它决定着性能优化的方法，只有在了解原理之后，才能完全理解为什么这样做可以优化性能。正所谓：知其然，然后知其所以然

相信你会先看完上面的三篇文章的



### 上车

- 打开[GoogleChrome的demo](https://googlechrome.github.io/devtools-samples/jank/)

- 使用谷歌浏览器无痕模式打开要性能测试的页面，对于react项目（在链接后加上?react_perf ）
- 开始优化性能之旅

### 开车

车已给你，怎么开？来试试吧。科目一理论基础，到这一步我觉得你应该已经过了

科目二，小试牛刀

科目三？

科目四？再回归到理论，消化成自己的知识

##### 操作提示：

- 我们可以按照[Performance](./PERFORMACE.md) 中的步骤，点击**Add**增加蓝色♦️的按钮，让屏幕中的♦️不断增多，直到你感觉有些卡了，然后就打开performace面板，尽情的找出卡的原因。试着自己给出优化方案

- demo中还有一个**Optimize**按钮后你会发现不怎么卡了，如果你在上一步自己找到了优化方法，那就可以去对比下[GoogleChrome给出的优化方案](https://github.com/GoogleChrome/devtools-samples/blob/4818abc9dbcdb954d0eb9b70879f4ea18756451f/jank/app.js#L62)

现在还有一个现成的**豪车**，[pc web直播](http://git.tanzk.cn/frontend/teaching/tz-live.git)，强烈推荐切换到fix_type_ts分支，全新的ts系列。自己可以拉下来跑跑，作为试炼场

直播项目里还存在很多问题，有些问题至今还没有解决，就是说最悲哀的是发现了问题，但是不知道如何解决？希望可以有人一起参与，问题后期总结好了再贴吧。

**这篇文章和我就是你的免费的教练**

### 参考文章

[Chrome运行时性能瓶颈分析](https://mp.weixin.qq.com/s?__biz=MzAwNDcyNjI3OA==&mid=2650842562&idx=1&sn=d439f74be99d670b26ffb84966f90ebb&chksm=80d38eabb7a407bdb28f28a907ecc23e24e100a4ee986879692655ca949d35950abd8858b2a7&mpshare=1&scene=23&srcid=%23rd)

[使用Chrome Performance对页面进行分析优化](http://callmedadaxin.github.io/2018/09/29/optimize-react-app-with-chrome-devtools/)

[性能为何至关重要](https://developers.google.com/web/fundamentals/performance/why-performance-matters/)

