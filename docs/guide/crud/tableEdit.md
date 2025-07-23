# 表格编辑

表格编辑功能允许用户直接在表格中编辑数据，支持行编辑、单元格编辑和自由编辑等多种模式，以及多种触发方式。

## 基础配置
通过 editConfig 配置表格的编辑模式和触发方式。 </br>
编辑模式下，默认渲染`input`组件，需要通过包裹一层 `form` 对象才能自定义配置编辑组件。

```js
options: {
  editConfig: {
    // 编辑模式：row(行编辑)、cell(单元格编辑)、free(自由编辑)、dialog(弹窗编辑)
    mode: 'row',
    // 触发方式：manual(手动)、click(单击)、dblclick(双击)
    trigger: 'manual',
    // 编辑按钮触发
    edit: true,
  },
  renderColumns: [
    {
      prop: 'name',
      label: '姓名',
      form: { // 自定义编辑组件配置
        comp: {
          name: 'el-select',
          options: [
            {
              label: '选项1',
              value: '选项1',
            }
          ]
        },
      }
    }
  ]
}
```


## 自由编辑

### 全局自由编辑

`mode: free` 自由编辑 </br>
自由编辑模式下，所有可编辑的单元格始终处于编辑状态。

<ClientOnly>
<common-code-format>
  <crud-tableEdit-free slot="source"></crud-tableEdit-free>
  
<<< @/docs/.vuepress/components/crud/tableEdit/free.vue
</common-code-format>
</ClientOnly>

### 单列自由编辑

`isEdit` 设置单列自由编辑 </br>

<ClientOnly>
<common-code-format>
  <crud-tableEdit-freeColumn slot="source"></crud-tableEdit-freeColumn>
  
<<< @/docs/.vuepress/components/crud/tableEdit/freeColumn.vue
</common-code-format>
</ClientOnly>


## 行编辑

### 手动触发 - 操作列

通过操作列编辑按钮 `edit`触发编辑状态。

```js
editConfig: {
  mode: "row",
  trigger: "manual",
  edit: {} // 操作列按钮配置
}
```

#### 事件处理

`@edit(done, scope)` 点击编辑触发，参数`done(params)`，可设置编辑后的行数据 </br>
`@save(done, scope, unLoading)` 点击保存触发，参数`done(params)`，可设置保存后的行数据 </br>
`@cancel(done, scope)` 点击取消触发 </br>

<ClientOnly>
<common-code-format>
  <crud-tableEdit-rowAction slot="source"></crud-tableEdit-rowAction>
  
<<< @/docs/.vuepress/components/crud/tableEdit/rowAction.vue
</common-code-format>
</ClientOnly>

### 手动触发 - 批量编辑

通过批量编辑按钮 `batch` 触发编辑状态。

```js
editConfig: {
  mode: "row",
  trigger: "manual",
  batch: {
    isSelect: true, // 是否批量编辑选中项，搭配selection使用
  } // 批量操作按钮配置
}
```

#### 事件处理

`@batchEdit(done, rows)` 点击批量编辑触发，参数`done(rows)`，可传递需要编辑的行，默认编辑所有行 </br>
`@batchSave(done, rows)` 点击批量保存触发，参数`done(rows)`，可传递需要保存的行，默认保存所有编辑行 </br>
`@batchCancel(done, rows)` 点击批量取消触发，参数`done(rows)`，可传递需要取消的行，默认取消所有编辑行 </br>

<ClientOnly>
<common-code-format>
  <crud-tableEdit-rowBatch slot="source"></crud-tableEdit-rowBatch>
  
<<< @/docs/.vuepress/components/crud/tableEdit/rowBatch.vue
</common-code-format>
</ClientOnly>

### 手动触发 - 调用方法

<ClientOnly>
<common-code-format>
  <crud-tableEdit-methods slot="source"></crud-tableEdit-methods>
  
<<< @/docs/.vuepress/components/crud/tableEdit/methods.vue
</common-code-format>
</ClientOnly>


### 单击触发

点击行时触发编辑状态。

```js
editConfig: {
  mode: "row",
  trigger: "click",
}
```

#### 事件处理

`@edit(done, scope)` 点击编辑触发，参数`done(params)`，可设置编辑后的行数据 </br>
`@save(done, scope, unLoading)` 点击保存触发，参数`done(params)`，可设置保存后的行数据 </br>

<ClientOnly>
<common-code-format>
  <crud-tableEdit-rowClick slot="source"></crud-tableEdit-rowClick>
  
<<< @/docs/.vuepress/components/crud/tableEdit/rowClick.vue
</common-code-format>
</ClientOnly>


## 单元格编辑

单元格编辑模式下，点击或双击单元格时，只有该单元格进入编辑状态

```js
editConfig: {
  mode: "cell",
}
```

#### 事件处理

`@edit(done, scope, column)` 点击编辑触发，参数`done(params)`，可设置编辑后的数据 </br>
`@save(done, value, scope, column, unLoading)` 点击保存触发，参数`done(params)`，可设置保存后的数据 </br>

<ClientOnly>
<common-code-format>
  <crud-tableEdit-cellEdit slot="source"></crud-tableEdit-cellEdit>
  
<<< @/docs/.vuepress/components/crud/tableEdit/cellEdit.vue
</common-code-format>
</ClientOnly>

## 控制编辑状态

`isRowEdit` 控制行编辑状态 </br>
`isEdit` 控制列与单元格编辑状态

```js
options: {
  editConfig: {
    isRowEdit: (row) => { //控制行编辑状态
      return row.id % 2 === 0;
    }
  }
  renderColumns: [
    {
      prop: 'name',
      label: '姓名',
      isEdit: (row) => { //控制单元格编辑状态
        return row.id % 2 === 0;
      }
    }
  ]
}
```
<ClientOnly>
<common-code-format>
  <crud-tableEdit-controlEdit slot="source"></crud-tableEdit-controlEdit>
  
<<< @/docs/.vuepress/components/crud/tableEdit/controlEdit.vue
</common-code-format>
</ClientOnly>


## 新增删除操作

### 基本配置

```js
editConfig: {
  mode: 'row',
  trigger: 'manual',
  rowEdit: {
    hasPermi: ['xx'] // 可以用于设置按钮权限等
  },
  // 底部新增行按钮配置
  lastAdd: {
    type: 'last', // first(第一行新增)、last(最后一行新增)
  },
  addChild: {}, // 子级新增按钮配置
  // 新增行按钮配置
  rowAdd: {
    type: 'first', // first(第一行新增)、last(最后一行新增)
  },
  // 批量删除按钮配置
  batchDelete: {
    confirm: (rows) => `是否删除序号为${rows.map(row => row.$index + 1).join(',')}的数据？`, // 删除提示
  },
  // 删除按钮配置
  delete: {
    confirm: (scope) => `是否删除序号为${scope.$index + 1}的数据？`, // 删除提示
  },
},
```

### 事件处理

`@add` 点击新增触发，参数`done(params)`，可设置新增的行数据 </br>
`@delete` 点击删除触发 </br>
`@batchDelete` 点击批量删除触发 </br>


<ClientOnly>
<common-code-format>
  <crud-tableEdit-addDeleteBtn slot="source"></crud-tableEdit-addDeleteBtn>
  
<<< @/docs/.vuepress/components/crud/tableEdit/addDeleteBtn.vue
</common-code-format>
</ClientOnly>

## 树形数据编辑

<ClientOnly>
<common-code-format>
  <crud-tableEdit-treeEdit slot="source"></crud-tableEdit-treeEdit>
  
<<< @/docs/.vuepress/components/crud/tableEdit/treeEdit.vue
</common-code-format>
</ClientOnly>

## 弹窗编辑

### 基本配置

```js
options: {
  editConfig: {
    mode: 'dialog',
    // 编辑按钮配置
    edit: {},
    // 新增按钮配置
    add: {
      type: 'first', // first(第一行新增)、last(最后一行新增)
    },
    // 查看按钮配置
    view: {},
  },
  dialog: {}, // 自定义弹窗配置
  addForm: {}, // 新增表单配置
  editForm: {}, // 查看表单配置
  viewForm: {}, // 通用表单配置
  formOptions: {}, // 通用自定义表单配置
}
```

### 事件处理

`@add` 点击新增触发 </br>
`@edit` 点击编辑触发 </br>
`@save` 点击保存触发 </br>
`@view` 点击查看触发 </br>

<ClientOnly>
<common-code-format>
  <crud-tableEdit-dialog slot="source"></crud-tableEdit-dialog>
  
<<< @/docs/.vuepress/components/crud/tableEdit/dialog.vue
</common-code-format>
</ClientOnly>


## API

### editConfig 配置

| 参数        | 说明                             | 类型                    | 可选值                |
| ----------- | -------------------------------- | ----------------------- | --------------------- |
| mode        | 编辑模式                         | string                  | free,cell,row,dialog  |
| trigger     | 触发方式                         | string                  | manual,click,dblclick |
| edit        | 编辑按钮配置                     | object                  | -                     |
| batch       | 批量操作按钮配置，仅限`row`模式  | object                  | -                     |
| add         | 新增按钮配置                     | object                  | -                     |
| lastAdd     | 底部新增行按钮配置               | object                  | -                     |
| addChild    | 子级新增按钮配置                 | object                  | -                     |
| batchDelete | 批量删除按钮配置                 | object                  | -                     |
| delete      | 删除按钮配置                     | object                  | -                     |
| view        | 查看按钮配置，仅限`dialog`模式   | object                  | -                     |
| isRowEdit   | 控制行是否可编辑                 | function({row, $index}) | -                     |
| autofocus   | 是否自动聚焦，支持字符串(prop)   | boolean/string          | true                  |
| exclusive   | 行编辑是否互斥(同时只能编辑一行) | boolean                 | false                 |
| disabled    | 禁用编辑                         | boolean                 | false                 |

### Column 配置

| 参数              | 说明                 | 类型                            | 默认值            |
| ----------------- | -------------------- | ------------------------------- | ----------------- |
| isEdit            | 是否可编辑           | boolean/function({row, $index}) | false             |
| add               | 仅自定义新增组件     | boolean/Object                  | 默认继承form配置  |
| edit              | 仅自定义编辑组件     | boolean/Object                  | 默认继承form配置  |
| form              | 自定义编辑、新增组件 | boolean/Object                  | -                 |
| form.prop         | 编辑字段             | boolean/Object                  | 默认继承列的prop  |
| form.comp         | 编辑组件             | object                          | el-input          |
| form.render       | 编辑组件渲染函数     | function                        | -                 |
| form.validateProp | 编辑组件验证字段     | string                          | 默认继承form.prop |

### slots

| 插槽名        | 说明                 | 默认值       |
| ------------- | -------------------- | ------------ |
| `{prop}-form` | 自定义编辑、新增组件 | -            |
| `{prop}-add`  | 仅自定义新增组件     | 默认继承form |
| `{prop}-edit` | 仅自定义编辑组件     | 默认继承form |


### Events


| 事件名            | 说明                              | 参数                            |
| ----------------- | --------------------------------- | ------------------------------- |
| @add              | 点击新增按钮时                    | done(params), scope             |
| @edit             | 点击编辑按钮时                    | done(params), scope             |
| @save             | 点击保存按钮时                    | done(params), scope, unLoading  |
| @cancel           | 点击取消按钮时                    | done(params), scope             |
| @delete           | 点击删除按钮时                    | done, scope, unLoading          |
| @view             | 点击查看按钮时，仅限`dialog`模式  | done, scope                     |
| @batchEdit        | 点击批量编辑按钮时，仅限`row`模式 | done(rows), rows                |
| @batchSave        | 点击批量保存按钮时，仅限`row`模式 | done(rows), rows, unLoading     |
| @batchCancel      | 点击批量取消按钮时，仅限`row`模式 | done(rows)                      |
| @batchDelete      | 点击批量删除按钮时，仅限`row`模式 | done, rows, unLoading           |
| @editStatusChange | 编辑状态变化时触发                | {mode, rowKey, row, prop, type} |

### Methods

| 方法名         | 说明                                      | 参数                                                        | 返回值 |
| -------------- | ----------------------------------------- | ----------------------------------------------------------- | ------ |
| setRowEdit     | 设置行编辑状态                            | (rows: object/array, options: {type: string, prop: string}) | -      |
| setBatchEdit   | 批量设置行编辑状态，不传rows则设置所有行  | (type: string, rows: object/array)                          | -      |
| setCellEdit    | 设置单元格编辑状态                        | (row: object, prop: string)                                 | -      |
| addRow         | 新增表格行, 传`parentRow`则新增当前行子级 | (params: object, type: first/last, parentRow: object)       | -      |
| clearAllEdit   | 清除所有编辑状态                          | -                                                           | -      |
| getEditingRows | 获取所有编辑状态的行                      | -                                                           | array  |

### options 配置

| 参数         | 说明                    | 类型                    | 默认值             |
| ------------ | ----------------------- | ----------------------- | ------------------ |
| freeEdit     | 快捷自由编辑模式        | boolean                 | false              |
| cellEdit     | 快捷单元格编辑模式      | boolean                 | false              |
| rowEdit      | 快捷行编辑模式          | boolean                 | false              |
| batchEdit    | 快捷批量编辑模式        | boolean                 | false              |
| batchRowEdit | 快捷行编辑+批量编辑模式 | boolean                 | false              |
| isRowEdit    | 控制行是否可编辑的函数  | function({row, $index}) | -                  |
| addForm      | 新增表单配置            | Object                  | {}                 |
| editForm     | 编辑表单配置            | Object                  | {}                 |
| viewForm     | 查看表单配置            | Object                  | {viewType: "form"} |
| formOptions  | 通用表单配置            | Object                  | {}                 |
| dialog       | 弹窗配置                | Object                  | {}                 |