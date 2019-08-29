## Vue的elementUI实现自定义主题

- [安装element-ui]
```
npm i element-ui -S
```
- [安装sass-loader，node-sass]

因为node-sass经常发生安装失败的情况，在这里记录下node-sass的安装。[node-sass 安装失败的原因及解决办法](https://segmentfault.com/a/1190000010984731?utm_source=tag-newest)

```
npm i sass-loader node-sass -D
```
在这里说一下，不需要配置webpack.base.conf.js文件,vue-loader会根据不同类型文件来配置相应loader来打包我们的样式文件（感兴趣的可看下vue-loader的核心代码）
- [改变element样式变量]

1.在src的common文件下建立element-theme.scss文件（名字可以自定义），写入如下代码：
```css
/* 改变主题色变量 */
$--color-primary: #f97e34;

$--color-text-primary: #333;

/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-ui/lib/theme-chalk/fonts';

/* 表格 */
$--table-border-color: #ede8df;
$--table-header-background-color: #f7f6f3;
$--table-row-hover-background-color: transparent;

/* 链接 */
$--link-font-size: 12px;
```
2.在入口文件main.js中引入上面的文件即可
```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import '@/common/element-theme.scss';

Vue.use(ElementUI, { size: 'small' });
```

## 表单验证
ElementUI 的表单验证基于 [`async-validator`](https://github.com/yiminghe/async-validator)，但 `async-validator` 是一个主要针对对象验证而不是表单验证的库，导致 `ElForm` 的验证使用不方便。 

因此`/src/utils/validator.js`提供常用的字符串验证方法，避免出现重复的验证代码。

### 优先使用预置的验证
`async-validate` 提供了一些[预置的验证方法](https://github.com/yiminghe/async-validator/#type)，如果能满足情况应优先使用，常用的有：
- 必填
    - 字符串：`{ required: true }`
    - 对象（值为对象的选择框）：`{ required: true, type: 'object' }`
    - 数字（值为数据的选择框）：`{ required: true, type: 'number' }`
    - 数组（多选）：`{ required: true, type: 'array' }`
- `url`：`{ type: 'url' }`
- `email`：`{ type: 'email' }`
- 长度：字符串或数组通过 `min`, `max`, `len`限制长度，如 `{ max: 3, min: 1 }`、 `{ type: 'array', max: 5 }`

### 验证函数
验证函数接收1至2个参数，第一个参数为字符串待验证值，第二个参数为可选配置或参数，函数根据验证结果返回布尔值。

#### isDigits
验证字符串是否为数字（或者正整数)
```js
// utils > validator.js
export const isDigits = value => /^\d+$/.test(value);
```
``` js
isDigits('001'); // => true
isDigits('123'); // => true
```

#### isInteger
验证字符串是否是整数
``` js
isInteger('001'); // => true
isInteger('-111'); // => true
```

#### isFloat
验证字符串是否是数字，接收第二个参数`{ precision }`，`precision` 为小数点后最大允许位数。
``` js
isFloat('1'); // => true
isFloat('1.111'); // => true
isFloat('01.111'); // => true
isFloat('01.111'); // => true
isFloat('1', { precision: 2 }); // => true
isFloat('1.1', { precision: 2 }); // => true
isFloat('1.11', { precision: 2 }); // => true
isFloat('1.111', { precision: 2 }); // => false
```

#### isAlpha
验证字符串是否是字母
``` js
isAlpha('AAA'); // => true
isAlpha('aaa'); // => true
```

#### isAlphanumeric
验证字符串是否是字母或数字
``` js
isAlphanumeric('AA'); // => true
isAlphanumeric('A1'); // => true
isAlphanumeric('a1'); // => true
```

#### isGt / isGte / isLt / isLte
验证大小，接收第二个参数作为比较值
- `isGt`： 大于
- `isGte`： 大于或等于
- `isLt`： 小于
- `isLte`： 小于或等于

这些函数内部直接使用运算符的比较，当两个参数都为字符串时，执行字符串比较；都为数字时，执行数字比较。 **若期望的结果是数字比较，由于待验证值是字符串，因此第二个参数必须要传数字，让他隐式转换。**
``` js
isGt('12', 11); // => true
isGt('101', '11'); // => false
```

#### isCommaSeparatedEmail
验证字符串是否是逗号分隔的多个Email
``` js
isCommaSeparatedEmail('abc@aa.com'); // => true
isCommaSeparatedEmail('abc@aa.com,abe@aa.com'); // => true
isCommaSeparatedEmail('"$%,*"@1.com,"$%,*"@2.com'); // => true
```

#### isPhone
验证字符串是否是手机。
::: warning
目前后端没有统一的手机验证方式，严格程度都不一样，先用个最简单的规则：以1开头共11位
:::

### 自定义验证创建函数
`createValidator` 可以用来创建自定义验证函数，接受一个验证函数和一个可选的错误信息，返回一个 `async-validator` 的自定义函数。

`createValidator(action(value)[, message])`
- `action`：验证函数接受待验证值，返回布尔值。可以是同步函数，也可以是返回`Promise`的函数
- `message`：可选参数，验证错误时的消息；省略时使用 `rule` 中的 `message`
- 返回`validator(rule, value, callback)`

::: demo FormValidation-CreateValidate
<<< @/docs/.vuepress/components/FormValidation/CreateValidate.vue
:::

`createValidator` 创建的自定义验证函数，只有在待验证值存在值时才验证，否则直接通过。必填验证建议直接使用 `async-validator` 预置的验证方法，通过必填验证再继续接下来的验证。

存在多个验证方法是可以分布验证，也可以合并验证
``` js
// 分步
const rule = [
  { required: true, message: 'required', trigger: 'blur' },
  { validator: createValidator(isInteger), message: 'integer', trigger: 'blur' },
  { validator: createValidator(v => isGt(v, 10)), message: '> 10', trigger: 'blur' },
  { validator: createValidator(v => isLte(v, 20)), message: '< 20', trigger: 'blur' },
];

// 合并
const rule = [
  { required: true, message: 'required', trigger: 'blur' },
  { validator: createValidator(v => isInteger(v) && isGt(v, 10) && isLte(v, 20)), message: 'invalid', trigger: 'blur' },
];
```
