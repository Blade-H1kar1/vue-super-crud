# 基本使用

## 使用字典+增强方法

默认字典与全局字典无需注册，直接使用即可 <br>

<ClientOnly>
<common-code-format>
  <dict-baseUse slot="source"></dict-baseUse>
  
<<< @/docs/.vuepress/components/dict/baseUse.vue
</common-code-format>
</ClientOnly>


## 字典联动

<ClientOnly>
<common-code-format>
  <dict-DictLinkage slot="source"></dict-DictLinkage>
  
<<< @/docs/.vuepress/components/dict/DictLinkage.vue
</common-code-format>
</ClientOnly>

## 局部字典+联动

字典数据不共用，需要配合现有组件使用，`local` 设置局部字典 <br>

<ClientOnly>
<common-code-format>
  <dict-localDict slot="source"></dict-localDict>
  
<<< @/docs/.vuepress/components/dict/localDict.vue
</common-code-format>
</ClientOnly>

## 字典配合组件使用

<ClientOnly>
<common-code-format>
  <dict-component slot="source"></dict-component>
  
<<< @/docs/.vuepress/components/dict/component.vue
</common-code-format>
</ClientOnly>

## 全局注册

```javascript
import superCrud from "src";

Vue.use(superCrud, {
  // 默认字典配置项
  dict: {
    request: (key) => request({
      url: '/dict/type/' + key,
      method: 'get'
    }),
    value: "value",
    label: "label",
    color: "color",
    children: "children",
  },
  // 注册全局字典模板
  template: {
    dicts: {
      userStatus: {
        request: () => request('/api/user/status'),
        transform: (data) => {
          return data.map(item => ({
            label: item.name,
            value: item.id
          }))
        }
      },
      userList: {
        request: () => request('/api/user/list'),
      }
    }
  },
});
```

全局注册的字典直接使用即可, 会通过 `$scDict[key]` 自动获取字典数据 <br>

`key` 为字典的注册名称：
- 匹配到名为key的`全局字典模板`
- 如果匹配不到名为key的`全局字典模板`，会自动将key作为`默认字典`请求函数的`参数`

```vue
<template>
  <div>
    {{ $scDict.userStatus }}
  </div>
</template>
<script>
export default {
  async created() {
    await this.$scDict.sys_normal_disable.wait();
    console.log(this.$scDict.sys_normal_disable);
  },
};
</script>
```

## 字典注册
```javascript
// 方式一：直接传入请求函数
this.$scDict.register('userStatus', request('/api/user/status'))

// 方式二：传入配置对象
this.$scDict.register('userList', {
  request: () => request('/api/user/list'),
  immediate: true,
  transform: (data) => {
    return data.map(item => ({
      label: item.name,
      value: item.id
    }))
  }
})

// 方式三：本地静态数据
this.$scDict.register('gender', {
  options: [
    { label: '男', value: 1 },
    { label: '女', value: 2 }
  ]
})

// 批量注册
this.$scDict.registerBatch({
  gender: {
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]
  },
  userStatus: () => request('/api/user/status'),
  userList: () => request('/api/user/list'),
})
```

## 动态参数

```javascript
// 参数为函数形式时监听响应式数据变化
this.$scDict.register('cityList', {
  request: (params) => request('/api/cities', params),
  params: () => ({
    provinceId: this.selectedProvince
  }),
  immediate: true  // 会立即执行 params 函数并请求数据
})

// 手动传入参数
this.$scDict.get('cityList', { provinceId: 1 })
```

## 自定义增强方法

```javascript
this.$scDict.register('countries', {
  request: mockApi.getProvinces,
  enhanceDict: {
    customFindLabel: (value, key, dictData, meta) =>
      dictData.find((item) => item.value === value)?.label,
  },
});

// 使用
this.$scDict.countries.customFindLabel(1)
```