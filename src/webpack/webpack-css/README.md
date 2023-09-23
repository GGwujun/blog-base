# webpack_css_demo

### 概括

css的编译和📦其实不难，首先你得熟悉webpack的loader和plugins配置，然后了解常用的loader和plugin的作用，基本上可以搞定

### 常用loader

#### loader的原理

loader的执行顺序是从右向左，这可能是我们最熟悉的，其实不然，loader有两次执行过程，第一次pitch，然后再是normal

比如`a!b!c!module`, 正常调用顺序应该是c、b、a，但是真正调用顺序是a(pitch)、b(pitch)、c(pitch)、c、b、a， 如果其中任何一个pitching loader返回了值就相当于在它以及它右边的loader已经执行完毕。

style-loader就是利用了pitch

##### normal

从右往左

##### pitch

从左往右,只要其中一个loader的pitch函数返回了值，那么就会跳过它右边的loader的执行

##### async的loader的作用何在？

未完待续。。。

#### css-loader

> The `css-loader` interprets `@import` and `url()` like `import/require()` and will resolve them.

遇到后缀为.css的文件，webpack先用css-loader加载器去解析这个文件，遇到“@import**、**url()”等语句就将相应样式文件引入（所以如果没有css-loader，就没法解析这类语句），最后返回计算完的css

#### style-loader

> Adds CSS to the DOM by injecting a `<style>` tag

我们一般会对css文件进行处理，处理的的loader就是css-loader，style-loader的作用是把处理后的css以`<style>`标签形式插入到页面html文件中

##### 注意

它只是把处理好的css文件内容（string code）加载进html文件，以<style>标签或者<link>形式

#### file-loader

> The `file-loader` resolves `import`/`require()` on a file into a url and emits the file into the output directory.

说白了就是把你在js、jsx、.vue文件中通过import和require引入的资源单独输出到output,然后它返回的是一个资源路径

##### 







