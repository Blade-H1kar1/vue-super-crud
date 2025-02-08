// 定义转换器接口
const createTransformer = (config) => {
  return {
    // 转换器类型
    type: config.type,

    // 验证器
    validators: {
      input: config.validateInput || (() => true),
      output: config.validateOutput || (() => true),
    },

    // 转换函数
    transformers: {
      input: config.input,
      output: config.output,
    },

    // 错误处理
    errorHandlers: {
      input:
        config.onInputError ||
        ((err) => {
          console.error(err);
          return null;
        }),
      output:
        config.onOutputError ||
        ((err) => {
          console.error(err);
          return null;
        }),
    },

    // 中间件支持
    middlewares: config.middlewares || [],
  };
};

// 转换器注册中心
const TransformerRegistry = {
  transformers: new Map(),

  // 注册转换器
  register(type, config) {
    this.transformers.set(type, createTransformer(config));
  },

  // 获取转换器
  get(type) {
    return this.transformers.get(type);
  },

  // 执行转换
  transform(type, value, direction = "input", context = {}) {
    const transformer = this.get(type);
    if (!transformer) {
      throw new Error(`未找到转换器: ${type}`);
    }

    try {
      // 执行中间件
      const middlewareChain = transformer.middlewares.reduce(
        (value, middleware) => middleware(value, context),
        value
      );

      // 验证
      const isValid = transformer.validators[direction](middlewareChain);
      if (!isValid) {
        throw new Error("数据验证失败");
      }

      // 转换
      return transformer.transformers[direction](middlewareChain, context);
    } catch (error) {
      return transformer.errorHandlers[direction](error);
    }
  },
};
