# 日志系统第一期的文档

### 痛点：

- 前端无日志，或者有日志也无持久化，导致难以对线上问题进行追溯和分析
- 就算使用了前端日志库，通常也依赖于开发人员手动记日志，不可靠
- 生产环境中未捕获的异常往往都被忽略了



### 第一期目标

首先我们需要做的是日志的收集，分不同纬度，不同等级，不同的方式去采集。收集日志信息，我们先计划直接在浏览器控制台输出。

项目的搭建采用类似于babel的[monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md)形式组织我们代码，每一个独立的模块就是一个packsge

- logger，记录日志
- 拦截某些功能行为，例如AJAX调用logger记录
- 处理日志埋点代码的babel插件



#### 埋点方式

- 手动埋点，根据业务需求（运营、产品、开发多个角度出发）在需要埋点地方手动调用埋点接口，采集埋点数据。
- 无痕埋点，



#### logger

负责日志的打印，输出核心日志api，可配置不同级别日志的打印，主动收集日志各个维度的信息，日志的格式可以思考，那种方式看起来舒服，有辨识度，比如：

```javascript
[21:59:40.677] [referrer] [url] [os] [browser] [resolution] [projectId] [moduleId] [INFO] - 这是一条info日志 会产生一个随机数： 80
```

主要支持**手动埋点**

参考项目：

- [logline](https://github.com/latel/logline)
- [log4web](https://github.com/houyhea/log4web)
- [参考文章](https://blog.csdn.net/zzh920625/article/details/75810210)



#### 全局拦截

拦截某些功能行为，例如AJAX调用logger记录

参考项目：

- [lajax](https://github.com/eshengsky/lajax)：具有自动记录的功能
- [frontend-tracker](https://github.com/Pgyer/frontend-tracker)：主要是拦截XHR，提供参考
- [neky-err](https://github.com/suguangwen/neky-err)：主要是拦截XHR，提供参考



#### babel插件

为了提高手动埋点给代码的维护成本，我们同时采用如下方式：

- 利用yaml注释的方式标记日志，可以很容易的剔除掉我们所有的日志代，码维护成本低
- 也可以利用decorator（装饰器），拦截函数或者方法

参考项目：

- [获取注释](https://github.com/jonschlinkert/esprima-extract-comments)

- [解析配置](https://github.com/nodeca/js-yaml)
- [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul)
- [babel创建自己的js语法](https://segmentfault.com/a/1190000020608635)



