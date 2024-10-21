# 数据字典

## 配置全局字典请求api

```js
Vue.use(superCrud, {
    // 配置全局通用字典请求
    dict: { 
      request: (key, done) => {
          axios.get('/api/dict/'+key).then(res => {
            done(res.data);
          }).catch(() => {
              done([]);
          });
      },
      label: "label",  // 数据字典中label字段的属性名
      value: "value", // 数据字典中value字段的属性名
      color: "color", // 数据字典中color字段的属性名
      children: 'children', // 数据字典中children字段的属性名
      noRepeat: true, //并发请求是否去重
      uniqueTime: 0, //请求去重的时间
      cache: true, //是否缓存
    },
    
    // 配置其他全局请求
    template: {
      dict: {
        getList: (item) => ({
          request: (key, done, param) => {
            axios.get("api/getList").then((res) => {
              done(res.data);
            }).catch(() => {
              done([]);
            });
          },
          label: "name",
          value: "id",
        }),
        getList2: (item) => ({
          request: (key, done, param) => { ... },
          label: "name",
          value: "id",
        }),
      }
    }
  })

```

## 在配置中使用

`dict` 接收通用字典请求key，比如`gender`，通用字典请求就会接收这个key作为请求参数</br>
`dict` 接收一个匹配其他请求字典配置，`{ key: "getList", params: { ...请求参数  } }`</br> 
`dict` 接收完整的字典配置覆盖全局配置，`{ request: ()=> {},... }`</br>

`scope.dict` 包含字典的所有参数，字典请求结束后会将数据返回到`scope.dict.options`中

<common-code-format>
  <crud-dict-base slot="source"></crud-dict-base>
  
<<< @/docs/.vuepress/components/crud/dict/base.vue
</common-code-format>

## 在页面中使用

`this.$scDicts.get(["gender"...])` 在created 中调用获取字典数据 </br> 
`this.$scDicts.dictsData.gender` 字典数据绑定的全局响应式变量

<common-code-format>
  <crud-dict-page slot="source"></crud-dict-page>
  
<<< @/docs/.vuepress/components/crud/dict/page.vue
</common-code-format>


## 搭配字典组件使用

`el-select`,`el-cascader`,`el-checkbox`,`el-radio`,`el-switch` 这5个element组件已重新指向内部封装的字典组件，自动接收字典数据options </br> 
`sc-value-format`格式化字典数据，除了label、value，还可以接受字典color属性，渲染不同颜色的标签 </br> 
`sc-cascade-format`格式化级联字典数据

<common-code-format>
  <crud-dict-comp slot="source"></crud-dict-comp>
  
<<< @/docs/.vuepress/components/crud/dict/comp.vue
</common-code-format>