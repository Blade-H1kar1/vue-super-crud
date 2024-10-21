import { curry } from "lodash-es";
export default {
  methods: {
    /**
     * 批量执行前置操作，支持传入公共参数和不同的特定参数。
     * @param {Array|String} nameList - 前置操作的名称列表
     * @param {Function} done - 前置操作完成后的回调
     * @param {Object} params - 参数。
     */
    runBefore: curry(async function (nameList, done, ...rest) {
      if (typeof nameList === "string") {
        nameList = [nameList];
      }
      let response;
      const promises = nameList.map((name, index) => {
        const eventName = name;
        if (this.$listeners[eventName]) {
          // 存在事件，调用emit触发事件
          return new Promise((resolve) => {
            this.$emit(
              eventName,
              (res) => {
                res && (response = res);
                resolve();
              },
              ...rest
            );
          });
        } else {
          // 如果事件不存在，直接resolve
          return Promise.resolve();
        }
      });

      // 等待所有Promise完成
      await Promise.all(promises);

      // 所有操作完成后调用done
      done(response);
    }, 2),
    runAfter(nameList, params, functionParams) {
      if (typeof nameList === "string") {
        nameList = [nameList];
      }
      nameList.forEach((name) => {
        name = name + "After";
        if (this.$listeners[name]) {
          this.$nextTick(() => {
            if (functionParams && typeof functionParams === "function") {
              params = { ...params, ...functionParams() };
              this.$emit(name, params);
            } else {
              this.$emit(name, params);
            }
          });
        }
      });
    },
  },
};
