// provinceData.js - 省份数据
export const provinceData = [
  { value: "11", label: "北京市" },
  { value: "12", label: "天津市" },
  { value: "13", label: "河北省" },
  { value: "31", label: "上海市" },
  { value: "32", label: "江苏省" },
  { value: "33", label: "浙江省" },
];

// cityData.js - 城市数据（按省份代码分组）
export const cityData = {
  "11": [
    // 北京市
    { value: "1101", label: "北京市" },
  ],
  "12": [
    // 天津市
    { value: "1201", label: "天津市" },
  ],
  "13": [
    // 河北省
    { value: "1301", label: "石家庄市" },
    { value: "1302", label: "唐山市" },
    { value: "1303", label: "秦皇岛市" },
    { value: "1304", label: "邯郸市" },
    { value: "1305", label: "邢台市" },
    { value: "1306", label: "保定市" },
    { value: "1307", label: "张家口市" },
    { value: "1308", label: "承德市" },
    { value: "1309", label: "沧州市" },
    { value: "1310", label: "廊坊市" },
    { value: "1311", label: "衡水市" },
  ],
  "31": [
    // 上海市
    { value: "3101", label: "上海市" },
  ],
  "32": [
    // 江苏省
    { value: "3201", label: "南京市" },
    { value: "3202", label: "无锡市" },
    { value: "3203", label: "徐州市" },
    { value: "3204", label: "常州市" },
    { value: "3205", label: "苏州市" },
    { value: "3206", label: "南通市" },
    { value: "3207", label: "连云港市" },
    { value: "3208", label: "淮安市" },
    { value: "3209", label: "盐城市" },
    { value: "3210", label: "扬州市" },
    { value: "3211", label: "镇江市" },
    { value: "3212", label: "泰州市" },
    { value: "3213", label: "宿迁市" },
  ],
  "33": [
    // 浙江省
    { value: "3301", label: "杭州市" },
    { value: "3302", label: "宁波市" },
    { value: "3303", label: "温州市" },
    { value: "3304", label: "嘉兴市" },
    { value: "3305", label: "湖州市" },
    { value: "3306", label: "绍兴市" },
    { value: "3307", label: "金华市" },
    { value: "3308", label: "衢州市" },
    { value: "3309", label: "舟山市" },
    { value: "3310", label: "台州市" },
    { value: "3311", label: "丽水市" },
  ],
  "44": [
    // 广东省
    { value: "4401", label: "广州市" },
    { value: "4402", label: "韶关市" },
    { value: "4403", label: "深圳市" },
    { value: "4404", label: "珠海市" },
    { value: "4405", label: "汕头市" },
    { value: "4406", label: "佛山市" },
    { value: "4407", label: "江门市" },
    { value: "4408", label: "湛江市" },
    { value: "4409", label: "茂名市" },
    { value: "4412", label: "肇庆市" },
    { value: "4413", label: "惠州市" },
    { value: "4414", label: "梅州市" },
    { value: "4415", label: "汕尾市" },
    { value: "4416", label: "河源市" },
    { value: "4417", label: "阳江市" },
    { value: "4418", label: "清远市" },
    { value: "4419", label: "东莞市" },
    { value: "4420", label: "中山市" },
    { value: "4451", label: "潮州市" },
    { value: "4452", label: "揭阳市" },
    { value: "4453", label: "云浮市" },
  ],
  "50": [
    // 重庆市
    { value: "5001", label: "重庆市" },
  ],
  "51": [
    // 四川省
    { value: "5101", label: "成都市" },
    { value: "5103", label: "自贡市" },
    { value: "5104", label: "攀枝花市" },
    { value: "5105", label: "泸州市" },
    { value: "5106", label: "德阳市" },
    { value: "5107", label: "绵阳市" },
    { value: "5108", label: "广元市" },
    { value: "5109", label: "遂宁市" },
    { value: "5110", label: "内江市" },
    { value: "5111", label: "乐山市" },
    { value: "5113", label: "南充市" },
    { value: "5114", label: "眉山市" },
    { value: "5115", label: "宜宾市" },
    { value: "5116", label: "广安市" },
    { value: "5117", label: "达州市" },
    { value: "5118", label: "雅安市" },
    { value: "5119", label: "巴中市" },
    { value: "5120", label: "资阳市" },
  ],
};

export const cityTreeData = [
  {
    value: "浙江",
    label: "浙江",
    children: [
      {
        value: "杭州",
        label: "杭州",
        children: [
          {
            value: "西湖区",
            label: "西湖区",
          },
          {
            value: "滨江区",
            label: "滨江区",
          },
        ],
      },
      {
        value: "宁波",
        label: "宁波",
        children: [
          {
            value: "海曙区",
            label: "海曙区",
          },
          {
            value: "江北区",
            label: "江北区",
          },
        ],
      },
    ],
  },
  {
    value: "江苏",
    label: "江苏",
    children: [
      {
        value: "南京",
        label: "南京",
        children: [
          {
            value: "玄武区",
            label: "玄武区",
          },
          {
            value: "秦淮区",
            label: "秦淮区",
          },
        ],
      },
      {
        value: "苏州",
        label: "苏州",
      },
    ],
  },
];

// 模拟API请求函数
export const mockApi = {
  // 获取所有省份
  getProvinces() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("getProvinces---", provinceData);
        resolve({
          code: 200,
          data: provinceData,
          message: "success",
        });
      }, 100);
    });
  },

  // 根据省份代码获取城市
  getCities(provinceCode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cities = cityData[provinceCode];
        console.log("cities---", cities, "code---", provinceCode);

        if (cities) {
          resolve({
            code: 200,
            data: cities,
            message: "success",
          });
        } else {
          resolve({
            code: 200,
            data: [],
            message: "no data",
          });
        }
      }, 100);
    });
  },

  getList({ pageNum, pageSize }) {
    return new Promise((resolve) => {
      const total = 23;
      const start = (pageNum - 1) * pageSize;

      // 模拟数据生成
      const mockData = [];
      const cities = ["北京", "上海", "广州"];
      for (let i = 0; i < pageSize; i++) {
        const index = start + i;
        if (index >= total) break;
        const age = Math.floor(Math.random() * 20) + 20;
        mockData.push({
          id: index + 1,
          name: `用户${index + 1}`,
          gender: Math.random() > 0.5 ? "男" : "女",
          age: age,
          is30: age > 30 ? "是" : "否",
          city: cities[Math.floor(Math.random() * cities.length)],
        });
      }

      setTimeout(() => {
        resolve({
          data: mockData,
          total,
        });
      }, 300);
    });
  },
  // 生成更多测试数据

  // 模拟API请求函数
  getDynamicData({ pageNum = 1, pageSize = 10 }) {
    const generateMockData = (count) => {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push({
          materialCode: `M${String(i + 1).padStart(3, "0")}`,
          materialName: `产品${i + 1}`,
          materialSpec: `规格${i + 1}`,
          quantityGradeName: String.fromCharCode(65 + (i % 26)), // A-Z循环
          firstChildren: [
            {
              id: "S001",
              name: "供应商1",
              price: 100 + i * 10,
              secondChildren: [
                {
                  sort: 1,
                  productUnitPrice: 100 + i * 10,
                  priceFollow: i % 2 === 0 ? "Y" : "N",
                  priceDifference: i % 2 === 0 ? -10 : 10,
                  pricePercentageChange: i % 2 === 0 ? 0.1 : -0.1,
                },
                {
                  sort: 2,
                  productUnitPrice: 90 + i * 10,
                  priceFollow: i % 2 === 0 ? "N" : "Y",
                  priceDifference: i % 2 === 0 ? 5 : -5,
                  pricePercentageChange: 0.05,
                },
              ],
            },
            {
              id: "S002",
              name: "供应商2",
              price: 90 + i * 10,
              secondChildren: [
                {
                  sort: 1,
                  productUnitPrice: 95 + i * 10,
                  priceFollow: "Y",
                  priceDifference: -5,
                  pricePercentageChange: 0.05,
                },
                {
                  sort: 2,
                  productUnitPrice: 92 + i * 10,
                  priceFollow: "Y",
                  priceDifference: -3,
                  pricePercentageChange: 0.03,
                },
              ],
            },
            {
              id: "S003",
              name: "供应商3",
              price: 80 + i * 10,
            },
          ],
        });
      }
      return result;
    };

    // 扩展数据集
    const allData = generateMockData(50);
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (pageNum - 1) * pageSize;
        const end = start + pageSize;

        resolve({
          total: allData.length,
          data: allData.slice(start, end),
        });
      }, 300);
    });
  },
};
