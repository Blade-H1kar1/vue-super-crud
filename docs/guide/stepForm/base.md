# 基本使用

## 基本使用

步骤表单组件（`sc-step-form`）是一个多步骤表单组件，支持分步填写、验证和提交表单数据。

### 基础配置

<ClientOnly>
<common-code-format>
  <stepForm-base slot="source"></stepForm-base>
                  
  <<< @/docs/.vuepress/components/stepForm/base.vue
</common-code-format>
</ClientOnly>


### 扁平模式

通过设置 `flattenMode` 属性开启扁平模式，在扁平模式下：
- 所有步骤的数据将合并到同一个对象中
- 可以通过 `fields` 属性指定当前步骤关联的字段

<ClientOnly>
<common-code-format>
  <stepForm-flatten slot="source"></stepForm-flatten>
              
  <<< @/docs/.vuepress/components/stepForm/flatten.vue
</common-code-format>
</ClientOnly>


### 自定义功能

1. **自定义底部按钮**
   - 步骤表单支持自定义底部按钮
   - 可以通过插槽完全覆盖或在原有基础上增加内容

<ClientOnly>
<common-code-format>
  <stepForm-navigation slot="source"></stepForm-navigation>
          
  <<< @/docs/.vuepress/components/stepForm/navigation.vue
</common-code-format>
</ClientOnly>


2. **自定义内容**
   - 支持自定义标题和表单内容
   - 可以通过插槽完全覆盖或在原有基础上增加内容

<ClientOnly>
<common-code-format>
  <stepForm-content slot="source"></stepForm-content>
      
  <<< @/docs/.vuepress/components/stepForm/content.vue
</common-code-format>
</ClientOnly>

3. **自定义表单字段**
   - 通过 `form-{stepIndex}-{slotName}` 插槽来自定义表单字段

<ClientOnly>
<common-code-format>
  <stepForm-field slot="source"></stepForm-field>
      
  <<< @/docs/.vuepress/components/stepForm/field.vue
</common-code-format>
</ClientOnly>


### 动态步骤

可以根据条件动态显示或隐藏步骤，通过设置步骤的 condition 属性实现

<ClientOnly>
<common-code-format>
  <stepForm-condition slot="source"></stepForm-condition>
  
  <<< @/docs/.vuepress/components/stepForm/condition.vue
</common-code-format>
</ClientOnly>

### 自定义校验函数

可以通过 `customValidator` 属性设置自定义校验函数，对步骤数据进行更复杂的校验。

自定义校验函数接收两个参数：
- `resolve`: 校验成功时调用的函数
- `stepIndex`: 当前步骤的索引

<ClientOnly>
<common-code-format>
  <stepForm-customValidatorExample slot="source"></stepForm-customValidatorExample>
  
  <<< @/docs/.vuepress/components/stepForm/customValidatorExample.vue
</common-code-format>
</ClientOnly>

### 事件处理

步骤表单提供了丰富的事件，用于处理表单的各种状态变化。

<ClientOnly>
<common-code-format>
  <stepForm-events slot="source"></stepForm-events>
  
  <<< @/docs/.vuepress/components/stepForm/events.vue
</common-code-format>
</ClientOnly>

## API 文档

### StepForm 属性

| 参数            | 说明                             | 类型       | 默认值 |
| --------------- | -------------------------------- | ---------- | ------ |
| value / v-model | 表单数据对象                     | `object`   | {}     |
| steps           | 步骤配置数组                     | `array`    | []     |
| showStep        | 是否显示步骤指示器               | `boolean`  | true   |
| showFooter      | 是否显示底部按钮                 | `boolean`  | true   |
| showSubmit      | 是否在最后一步显示提交按钮       | `boolean`  | true   |
| flattenMode     | 是否将所有步骤数据合并到同一对象 | `boolean`  | false  |
| allowDirect     | 是否允许直接点击步骤指示器跳转   | `boolean`  | true   |
| customValidator | 自定义校验函数                   | `function` | null   |

### Step 配置项

| 参数        | 说明                 | 类型       | 默认值 |
| ----------- | -------------------- | ---------- | ------ |
| title       | 步骤标题             | `string`   | -      |
| description | 步骤描述             | `string`   | -      |
| prop        | 步骤数据对象的key    | `string`   | -      |
| columns     | 表单列配置           | `array`    | []     |
| formOptions | 表单组件配置         | `object`   | {}     |
| prevText    | 上一步按钮文本       | `string`   | 上一步 |
| nextText    | 下一步按钮文本       | `string`   | 下一步 |
| submitText  | 提交按钮文本         | `string`   | 提交   |
| condition   | 步骤条件函数         | `function` | -      |
| fields      | 扁平模式下关联的字段 | `array`    | []     |

### Events

| 事件名      | 说明           | 回调参数                                   |
| ----------- | -------------- | ------------------------------------------ |
| step-change | 步骤变化时触发 | { from: number, to: number, step: object } |
| submit      | 表单提交时触发 | formData: object                           |

### Slots

| 插槽名                          | 说明                       | 作用域参数                                                                             |
| ------------------------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| step-title-[index]              | 自定义步骤标题             | { currentStep, stepConfig, formData, updateFormData, validate }                        |
| step-title-[index]-[position]   | 在步骤标题周围添加内容     | { currentStep, stepConfig, formData, updateFormData, validate }                        |
| step-content-[index]            | 自定义步骤表单内容         | { currentStep, stepConfig, formData, updateFormData, validate }                        |
| step-content-[index]-[position] | 在步骤表单周围添加内容     | { currentStep, stepConfig, formData, updateFormData, validate }                        |
| form-[index]-[slotName]         | 自定义表单字段插槽         | { row, $index, ... } + { currentStep, stepConfig, formData, updateFormData, validate } |
| step-footer-[index]             | 自定义步骤导航按钮         | { currentStep, totalSteps, prev, next, submit, loading }                               |
| step-footer-[index]-[position]  | 在步骤导航按钮周围添加内容 | { currentStep, totalSteps, prev, next, submit, loading }                               |

> 注：`[position]` 可以是 `top`、`bottom`、`left`、`right`

### Methods

| 方法名   | 说明                                 | 参数                | 返回值             |
| -------- | ------------------------------------ | ------------------- | ------------------ |
| goToStep | 跳转到指定步骤                       | stepIndex: number   | `boolean`          |
| validate | 校验表单，可以校验指定步骤或所有步骤 | [stepIndex]: number | `Promise<boolean>` |
| prev     | 跳转到上一步                         | -                   | -                  |
| next     | 验证并跳转到下一步                   | -                   | -                  |
| submit   | 验证并提交表单                       | -                   | -                  |