# js基础

## js的内存机制

## [js引擎、运行时和堆栈调用](https://www.oschina.net/translate/how-does-javascript-actually-work-part-1)

- **栈内存**：先进后出
- **堆内存**：引用型数据会在堆内存中开辟一个空间，并且将一个16进制的地址存储到栈内存的变量中。函数也是引用类型，字符串的形式保存在堆内存中

**V8引擎主要包括两个组件**
- Memory Heap 内存堆 - 内存分配发生的地方
- Call Stack 调用栈堆 - 代码执行时栈帧存放的位置

**Runtime 运行时**
> 我们有引擎，但是在实际的运行过程中，情况复杂的多，例如在web中，有浏览器提供的web api等。

**Call Stack 调用栈**
> js是单线程，所以我们也就只有一个调用栈。栈中的每个入口都被称之为栈帧。调用栈的大小是有限制的，超过限制就会发生调用栈溢出，特别是在递归。

## 基础数据类型

**js中基本类型包装对象：**

- String
- Number
- BigInt
- Boolean
- Symbol

**基础类型：**
1.string
2.number
3.bigint
4.boolean
5.null
6.undefined
7.symbol

### js中数字的编码

js中的数字都是浮点类型，都采用了IEEE754编码方式

64位编码中（从右到左），0-51位为分数（M），52-62位为指数（N），63位为标志位(Q) 。number = (-1)^Q * M * 2 ^ (1023-N)
64位编码中（从右到左），0-22位为分数（M），23-30位为指数（N），31位为标志位(Q) 。number = (-1)^Q * M * 2 ^ (127-N)

## js中的强制类型转换

- 隐式
- 显示

### 抽象操作

- ToString：非字符串到字符串的强制类型转换。null->"null", undefined->"undefined", true->"true", 普通对象则调用toString方法。toJSON方法可以修改JSON序列化结果，需要返回一个JSON安全值，再对该值调用JSON.stringify()得到字符串。
- ToNumber：冲非数字转化到数字操作。true->1, false->0, undefined->NaN, null->0。抽象操作toPrimitive首先检查是否有valueOf方法，有且返回基本类型，就用该值进行强制类型转换。否则用toString的值进行强制类型转换。否则产生TypeError错误。
- ToBoolean：从非boolean转化为boolean的抽象操作。undefined,null,false,+0,-0,NaN,""的转化结果为假值，其余转化均为真值。
- ToPrimitive: 传入hint是string，则先调用toString方法，返回的是基础值，则返回，否则调用valueOf方法，返回基础值则调用，否则抛出TypeError错误，如果hint传入的是Number或者空，则先调用valueOf之后调用string，复杂对象同Number转换过程，除了Date对象，会直接调用toString。

### ～运算符

> js中在执行位运算符之前，会先将操作数转化为int32类型的数据。

### 宽松相等与严格相等（==与===）

> 宽松相等会进行隐式的强制类型转换。

- NaN不等于NaN
- +0等于-0
- 字符串和数字比较，会将字符串转化为数字
- 数字和boolean比较，会将boolean转化为数字
- boolean和字符串比较，会全部转化为数字比较(特殊的是false等于'')
- null == undefined, 两者会转化为假阳(false positive)结果，且只有这两个转化出假阳。
- 对象和非对象之间的转换执行X==ToPrimitive(Y)操作。


### js类型判断

- typeof 判断
- 鸭子类型检测，检测是否存在相应的方法
- instanceof检测原型链
- Object.prototype.toString检测(更改Symbol.toStringTag属性的值也可以更改结果，也并非绝对安全)
