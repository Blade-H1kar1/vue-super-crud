# 问题合集

## 1. render函数渲染中ref实例绑定问题

### 问题

在使用render函数渲染时，如果参数接收了h函数，this.$refs.input组件实例绑定会丢失。

```js
// 此时this.$refs.input为undefined

render: (h, scope) => {
  return <el-input ref="input" v-model={scope.row.gender} ></el-input>;
},
```

### 解决方案

1. 忽略h函数，使用render函数渲染

```js
render: (...args) => {
  const { row } = args[1];
  return <el-input ref="input" v-model={row.gender}></el-input>;
},
```

2. 使用ref函数获取组件实例

```js
render: (h, scope) => {
  return (
    <el-input
      ref={(el) => {
        console.log(el, "el");
      }}
      v-model={scope.row.gender}
    ></el-input>
  );
},
```



