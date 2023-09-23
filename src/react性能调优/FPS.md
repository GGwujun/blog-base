## FPS的计算

### 流畅动画的标准

FPS 表示的是每秒钟画面更新次数。我们平时所看到的连续画面都是由一幅幅静止画面组成的，每幅画面称为一帧，FPS 是描述“帧”变化速度的物理量

流畅度是对 FPS 的视觉反馈，理论上FPS 值越高，视觉呈现越流畅。目前大多数设备的屏幕刷新率为 60 次/秒，所以通常来讲 FPS 为 60 时效果最好，也就是每帧的消耗时间为 16.67ms

1 帧的时长约 16ms，除去系统上下文切换开销，每一帧中只留给我们 10ms 左右的程序处理时间，如果一段脚本的处理时间超过 10ms，那么这一帧就可以被认定为丢失，如果处理时间超过 26ms，可以认定连续两帧丢失，依次类推。我们不能容忍页面中多次出现连续丢失五六帧的情况，也就是说必须想办法分拆执行时间超过 80ms 的代码程序，这个工作并不轻松

- 帧率能够达到 50 ～ 60 FPS 的动画将会相当流畅，让人倍感舒适；
- 帧率在 30 ～ 50 FPS 之间的动画，因各人敏感程度不同，舒适度因人而异；
- 帧率在 30 FPS 以下的动画，让人感觉到明显的卡顿和不适感；

> 当然，经常玩 FPS 游戏的朋友肯定知道，吃鸡/CSGO 等 FPS 游戏推荐使用 144HZ 刷新率的显示器，144Hz 显示器特指每秒的刷新率达到 144Hz 的显示器。相较于普通显示器每秒60的刷新速度，画面显示更加流畅。因此144Hz显示器比较适用于视角时常保持高速运动的第一人称射击游戏。
> 不过，这个只是显示器提供的高刷新率特性，对于我们 Web 动画而言，是否支持还要看浏览器，而大多数浏览器刷新率为 60 次/秒。

### 查看FPS

- 打开 Chrome 开发者工具，勾选上 Show FPS meter
- mozPaintCount,变量是 Mozilla 提供的方法，其返回的是当前文档 paint 到屏幕上的数量，通过计算单位时间 paint 数量变化，即可计算出页面的 FPS，so easy。
- 利用requestAnimationFrame，在页面重绘前，浏览器会执行传入 requestAnimationFrame 的入参函数，一般多用来实现连贯的逐帧动画。那我们基于 requestAnimationFrame 不就可以获得页面的绘制频率，计算出 FPS

```javascript
var rAF = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();
var frame = 0;
var allFrameCount = 0;
var lastTime = Date.now();
var lastFameTime = Date.now();
  
var loop = function () {
    var now = Date.now();
    var fs = (now - lastFameTime);
    var fps = Math.round(1000 / fs);
  
    lastFameTime = now;
    // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
    allFrameCount++;
    frame++;
  
    if (now > 1000 + lastTime) {
        var fps = Math.round((frame * 1000) / (now - lastTime));
        console.log(`${new Date()} 1S内 FPS：`, fps);
        frame = 0;
        lastTime = now;
    };
    rAF(loop);
}
loop();
```

