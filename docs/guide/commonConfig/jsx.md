# JSX 语法

## 内容

```jsx
render() {
  return <p>hello</p>
}
```

### 具有动态内容:

```jsx
render() {
  return <p>hello { this.message }</p>
}
```

### 单标签:

```jsx
render() {
  return <input />
}
```

### 使用组件:

```jsx
import MyComponent from './my-component'

export default {
  render() {
    return <MyComponent>hello</MyComponent>
  },
}
```

## 属性

```jsx
render() {
  return <input type="email" />
}
```

### 使用动态绑定:

```jsx
render() {
  return <input
    type="email"
    placeholder={this.placeholderText}
  />
}
```

### 绑定事件:

```jsx
render() {
  return <input onInput={this.handleInput} />
}
```

### 动态绑定事件:

```jsx
render() {
  const events = {
    "visible-change": () => {
       console.log("visible-change");
     },
  }
  return <input on={events} />
}
```


### 动态属性:

```jsx
render() {
  const props = {
    type: 'email',
    placeholder: 'Enter your email'
  }

  return <input props={props} />
}
```

### 使用扩展运算符:

```jsx
render() {
  const inputAttrs = {
    type: 'email',
    placeholder: 'Enter your email'
  }

  return <input {...{ attrs: inputAttrs }} />
}
```



## 插槽

### 命名插槽：

```jsx
render() {
  return (
    <MyComponent>
      <header slot="header">header</header>
      <footer slot="footer">footer</footer>
    </MyComponent>
  )
}
```

### 作用域插槽：

```jsx
render() {
  const scopedSlots = {
    header: () => <header>header</header>,
    footer: () => <footer>footer</footer>
  }

  return <MyComponent scopedSlots={scopedSlots} />
}
```

## 指令

```jsx
<input vModel={this.newTodoText} />
// or
<input v-model={this.newTodoText} />
```

### 使用修饰符:

```jsx
<input vModel_trim={this.newTodoText} />
```

### 带有参数：

```jsx
<input vOn:click={this.newTodoText} />
```

### 带有参数和修饰符:

```jsx
<input vOn:click_stop_prevent={this.newTodoText} />
```

### v-html:

```jsx
<p domPropsInnerHTML={html} />
```