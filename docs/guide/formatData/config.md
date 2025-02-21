# 格式化配置文档

## 通用配置项

| 配置项      | 类型           | 默认值 | 说明                                                                            |
| ----------- | -------------- | ------ | ------------------------------------------------------------------------------- |
| type        | String         | -      | 格式化类型，可选值见下方预设格式化类型                                          |
| formatValue | Boolean/String | false  | 是否保存格式化后的值。为 true 时存储在 `${prop}` 中，为字符串时存储在指定字段中 |
| input       | Function       | -      | 格式化函数                                                                      |
| output      | Function       | -      | 反格式化函数                                                                    |

## 预设格式化类型

### strToArr（字符串转数组）
将字符串转换为数组。

**数据转换：**
```javascript
"前端,Vue,React" -> ["前端", "Vue", "React"]
```

| 配置项    | 类型   | 默认值 | 说明   |
| --------- | ------ | ------ | ------ |
| separator | String | ","    | 分隔符 |

### multiPropToArr（多字段转数组）
将多个字段的值合并为数组。

**数据转换：**
```javascript
{
  province: "浙江",
  city: "杭州",
  district: "西湖"
} -> ["浙江", "杭州", "西湖"]
```

| 配置项    | 类型    | 默认值 | 说明                       |
| --------- | ------- | ------ | -------------------------- |
| multiProp | Array   | -      | 需要合并的字段名数组       |
| isObject  | Boolean | false  | 是否包裹在字段prop的对象中 |

### numberFormat（数字格式化）
对数字进行格式化处理。

**数据转换：**
```javascript
1234.56 -> "¥1,234.56" // thousandth: true, prefix: "¥", precision: 2
1234.5678 -> "¥1234.57" // precision: 2, round: true, prefix: "¥"
1234 -> "1,234.00" // toFixed: true, precision: 2
```

| 配置项     | 类型    | 默认值    | 说明             |
| ---------- | ------- | --------- | ---------------- |
| precision  | Number  | undefined | 精度（小数位数） |
| round      | Boolean | true      | 是否四舍五入     |
| toFixed    | Boolean | false     | 是否固定小数位数 |
| thousandth | Boolean | false     | 是否显示千分位   |
| prefix     | String  | ""        | 前缀             |
| suffix     | String  | ""        | 后缀             |
| keepZero   | Boolean | false     | 是否保留末尾0    |

### dateFormat（日期格式化）
对日期进行格式化处理。

**数据转换：**
```javascript
"2024-03-20" -> "2024年03月20日" // valueFormat: "YYYY年MM月DD日"
1710921600000 -> "2024年03月20日" 
new Date() -> "2024年03月20日"
```

| 配置项       | 类型   | 默认值       | 说明     |
| ------------ | ------ | ------------ | -------- |
| valueFormat  | String | "YYYY-MM-DD" | 值格式   |
| outputFormat | String | null         | 输出格式 |
| outputType   | String | "string"     | 输出类型 |

### weekFormat（周格式化）
对周数据进行格式化处理。

**数据转换：**
```javascript
"2024-03-20" -> ["2024-03-18", "2024-03-24"] // outputType: array
"2024-03-20" -> "2024-03-18 ~ 2024-03-24" // outputType: string
```

| 配置项      | 类型    | 默认值       | 说明                      |
| ----------- | ------- | ------------ | ------------------------- |
| valueFormat | String  | "YYYY-MM-DD" | 日期格式                  |
| weekStart   | Number  | 0            | 周起始日（0-6）           |
| includeTime | Boolean | false        | 是否包含时间              |
| separator   | String  | " ~ "        | 日期分隔符                |
| outputType  | String  | "array"      | 输出类型：array 或 string |

### inputFormat（输入格式化）
对输入内容进行格式化处理。

**数据转换：**
```javascript
"abc123中文" -> "123" // type: number
"abc123中文" -> "abc" // type: letter
"abc123中文" -> "中文" // type: chinese
"abc@123.com!" -> "abc@123.com" // type: email
```

| 配置项    | 类型   | 默认值    | 说明                                                                      |
| --------- | ------ | --------- | ------------------------------------------------------------------------- |
| inputType      | String | "number"  | 格式化类型：number/phone/decimal/letter/chinese/letterNumber/email/custom |
| pattern   | String | -         | 自定义正则                                          |
| maxLength | Number | undefined | 最大长度                                                                  |
| decimal   | Number | undefined | 小数位数（type为decimal时使用）                                           |

### percentFormat（百分比格式化）
对百分比数据进行格式化处理。

**数据转换：**
```javascript
0.1234 -> "12.34%"
0.1 -> "10.00%" // precision: 2
```

| 配置项     | 类型    | 默认值 | 说明           |
| ---------- | ------- | ------ | -------------- |
| precision  | Number  | 2      | 小数位数       |
| multiplier | Number  | 100    | 乘数因子       |
| addSymbol  | Boolean | true   | 是否添加百分号 |

### fileSizeFormat（文件大小格式化）
对文件大小进行格式化处理。

**数据转换：**
```javascript
1024 -> "1 KB"
1234567 -> "1.18 MB"
1234567890 -> "1.15 GB"
```

| 配置项    | 类型   | 默认值                        | 说明     |
| --------- | ------ | ----------------------------- | -------- |
| units     | Array  | ["B", "KB", "MB", "GB", "TB"] | 单位数组 |
| precision | Number | 2                             | 小数位数 |