// 存储管理

export class StateStorageManager {
  constructor(options = {}) {
    this.storageKey = options.storageKey || "appStateOptions";
    this.storageType = options.storageType || "local";
    this.useRouteKey = options.useRouteKey !== false; // 默认为 true
    this.defaultCacheKey = options.defaultCacheKey || "default";
  }

  // 获取存储对象
  getStorage() {
    return this.storageType === "local" ? localStorage : sessionStorage;
  }

  // 获取缓存键
  getCacheKey(route) {
    if (!this.useRouteKey) {
      return this.defaultCacheKey;
    }

    if (!route || !route.path) {
      return this.defaultCacheKey;
    }

    // 去掉结尾的 /数字 或 数字
    return route.path.replace(/\/?\d+$/, "");
  }

  // 获取存储数据
  getStorageData() {
    const storage = this.getStorage();
    const data = storage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  // 保存存储数据
  setStorageData(data) {
    const storage = this.getStorage();

    storage.setItem(this.storageKey, JSON.stringify(data));
  }

  // 保存状态：支持路由级别和组件级别存储
  save(value, valueOrRoute = null, route = null) {
    let stateKey, actualValue, actualRoute;

    // 判断参数模式
    if (
      arguments.length === 1 ||
      (arguments.length === 2 && valueOrRoute && valueOrRoute.path)
    ) {
      // 模式1: save(value) 或 save(value, route) - 路由级别共享配置
      stateKey = null;
      actualValue = value;
      actualRoute = valueOrRoute;
    } else {
      // 模式2: save(stateKey, value) 或 save(stateKey, value, route) - 组件级别独立配置
      stateKey = value;
      actualValue = valueOrRoute;
      actualRoute = route;
    }

    const cacheKey = this.getCacheKey(actualRoute);
    let cacheData = this.getStorageData();

    // 确保缓存键对应的对象存在
    if (!cacheData[cacheKey]) {
      cacheData[cacheKey] = {};
    }

    if (stateKey) {
      // 组件级别存储：保存到对应缓存键下的状态键
      cacheData[cacheKey][stateKey] = actualValue;
    } else {
      // 路由级别存储：直接保存到缓存键下的默认位置
      cacheData[cacheKey]["__default__"] = actualValue;
    }

    this.setStorageData(cacheData);
  }

  // 恢复状态
  restore(stateKey = null, route = null) {
    // 判断参数模式
    if (
      arguments.length === 0 ||
      (arguments.length === 1 && stateKey && stateKey.path)
    ) {
      // 模式1: restore() 或 restore(route) - 路由级别共享配置
      route = stateKey;
      stateKey = null;
    }

    const cacheKey = this.getCacheKey(route);
    const cacheData = this.getStorageData();

    if (!cacheData[cacheKey]) return null;

    if (stateKey) {
      // 组件级别恢复
      return cacheData[cacheKey][stateKey] || null;
    } else {
      // 路由级别恢复
      return cacheData[cacheKey]["__default__"] || null;
    }
  }

  // 清除特定状态
  clear(stateKey = null, route = null) {
    // 判断参数模式
    if (
      arguments.length === 0 ||
      (arguments.length === 1 && stateKey && stateKey.path)
    ) {
      // 模式1: clear() 或 clear(route) - 清除路由级别共享配置
      route = stateKey;
      stateKey = null;
    }

    const cacheKey = this.getCacheKey(route);
    let cacheData = this.getStorageData();

    if (!cacheData[cacheKey]) return;

    const targetKey = stateKey || "__default__";

    if (cacheData[cacheKey][targetKey]) {
      delete cacheData[cacheKey][targetKey];

      // 如果缓存键下没有其他状态了，删除整个缓存键
      if (Object.keys(cacheData[cacheKey]).length === 0) {
        delete cacheData[cacheKey];
      }

      this.setStorageData(cacheData);
    }
  }

  // 清除所有状态
  clearAll() {
    const storage = this.getStorage();
    storage.removeItem(this.storageKey);
  }

  // 重置特定缓存键下的所有状态
  resetCacheKey(route = null) {
    const cacheKey = this.getCacheKey(route);
    let cacheData = this.getStorageData();

    if (cacheData[cacheKey]) {
      delete cacheData[cacheKey];
      this.setStorageData(cacheData);
    }
  }

  // 获取特定缓存键下的所有状态
  getAllStates(route = null) {
    const cacheKey = this.getCacheKey(route);
    const cacheData = this.getStorageData();

    return cacheData[cacheKey] || {};
  }

  // 检查是否存在特定状态
  hasState(stateKey = null, route = null) {
    // 判断参数模式
    if (
      arguments.length === 0 ||
      (arguments.length === 1 && stateKey && stateKey.path)
    ) {
      // 模式1: hasState() 或 hasState(route) - 检查路由级别共享配置
      route = stateKey;
      stateKey = null;
    }

    const cacheKey = this.getCacheKey(route);
    const cacheData = this.getStorageData();

    if (!cacheData[cacheKey]) return false;

    const targetKey = stateKey || "__default__";
    return !!cacheData[cacheKey][targetKey];
  }
}
