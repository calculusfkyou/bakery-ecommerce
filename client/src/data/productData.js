// 從 ProductsPage.jsx 移出的商品資料
// 推薦產品
// 修改推薦產品，加上價格屬性
export const recommendedDrinksData = [
  { id: 101, name: "招牌可頌", price: "$45", category: "經典系列", image: "/assets/Logo.png", popular: true, new: false, status: "in_stock" },
  { id: 102, name: "法式巧克力可頌", price: "$55", category: "經典系列", image: "/assets/Logo.png", popular: true, new: false, status: "in_stock" },
  { id: 103, name: "全麥雜糧麵包", price: "$55", category: "經典系列", image: "/assets/Logo.png", popular: false, new: true, status: "in_stock" },
  { id: 104, name: "提拉米蘇", price: "$120", category: "特製蛋糕", image: "/assets/Logo.png", popular: true, new: false, status: "in_stock" },
  { id: 105, name: "焦糖奶油可頌", price: "$50", category: "經典系列", image: "/assets/Logo.png", popular: false, new: true, status: "limited_stock" },
];

// 經典系列麵包
export const classicDrinksData = [
  {
    id: 201,
    name: "原味可頌",
    description: "使用頂級法國奶油製作",
    price: "$45",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、奶油、糖、鹽、酵母",
    allergens: "麩質、奶製品",
    freshness: "當日新鮮製作，建議當天食用",
    status: "in_stock"
  },
  {
    id: 202,
    name: "巧克力可頌",
    description: "加入比利時進口巧克力",
    price: "$55",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、奶油、巧克力、糖、鹽、酵母",
    allergens: "麩質、奶製品、可能含有堅果",
    freshness: "當日新鮮製作，建議當天食用",
    status: "in_stock"
  },
  {
    id: 203,
    name: "杏仁可頌",
    description: "表面鋪滿香脆杏仁片",
    price: "$60",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、奶油、杏仁、糖、鹽、酵母",
    allergens: "麩質、奶製品、堅果",
    freshness: "當日新鮮製作，建議當天食用",
    status: "in_stock"
  },
  {
    id: 204,
    name: "法國長棍麵包",
    description: "正宗法式配方，外酥內軟",
    price: "$40",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、水、鹽、酵母",
    allergens: "麩質",
    freshness: "當日新鮮製作，建議當天食用",
    status: "in_stock"
  },
  {
    id: 205,
    name: "歐式核桃麵包",
    description: "添加滿滿核桃，風味獨特",
    price: "$65",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、核桃、糖、奶油、鹽、酵母",
    allergens: "麩質、奶製品、堅果",
    freshness: "當日新鮮製作，保存期2天",
    status: "in_stock"
  },
  {
    id: 206,
    name: "全麥雜糧麵包",
    description: "健康營養的全麥選擇",
    price: "$55",
    image: "/assets/Logo.png",
    ingredients: "全麥麵粉、雜糧、蜂蜜、奶油、鹽、酵母",
    allergens: "麩質、奶製品",
    freshness: "當日新鮮製作，保存期2天",
    status: "limited_stock"
  },
];

// 特製蛋糕 (可客製化)
export const specialDrinksData = [
  {
    id: 301,
    name: "草莓鮮奶蛋糕",
    price: "6吋 $580 / 8吋 $780",
    description: "新鮮草莓與鮮奶油的完美結合",
    image: "/assets/Logo.png",
    ingredients: "雞蛋、鮮奶油、草莓、麵粉、糖",
    allergens: "麩質、蛋、奶製品",
    freshness: "冷藏保存3天",
    status: "pre_order",
    customizable: true,
    customOptions: {
      sizes: ["6吋", "8吋", "10吋"],
      flavors: ["原味", "草莓", "巧克力"],
      decorations: ["水果裝飾", "巧克力裝飾", "鮮花裝飾(可食用)"],
      message: true,
      messageMaxLength: 30,
      advance_days: 3 // 需提前預訂天數
    }
  },
  {
    id: 302,
    name: "巧克力慕斯蛋糕",
    price: "6吋 $620 / 8吋 $820",
    description: "濃郁可可風味，口感絲滑",
    image: "/assets/Logo.png",
    ingredients: "巧克力、鮮奶油、雞蛋、吉利丁、糖",
    allergens: "蛋、奶製品",
    freshness: "冷藏保存2天",
    status: "pre_order",
    customizable: true,
    customOptions: {
      sizes: ["6吋", "8吋", "10吋"],
      flavors: ["黑巧克力", "白巧克力", "榛果巧克力"],
      decorations: ["巧克力碎片", "巧克力捲", "金箔"],
      message: true,
      messageMaxLength: 30,
      advance_days: 2
    }
  },
  {
    id: 303,
    name: "檸檬乳酪蛋糕",
    price: "6吋 $580 / 8吋 $780",
    description: "清新檸檬風味，搭配濃郁乳酪",
    image: "/assets/Logo.png",
    ingredients: "奶油乳酪、雞蛋、檸檬汁、檸檬皮、糖、餅乾底",
    allergens: "麩質、蛋、奶製品",
    freshness: "冷藏保存3天",
    status: "pre_order",
    customizable: true,
    customOptions: {
      sizes: ["6吋", "8吋"],
      flavors: ["原味", "加量檸檬風味"],
      decorations: ["檸檬片", "藍莓裝飾", "簡約設計"],
      message: true,
      messageMaxLength: 30,
      advance_days: 2
    }
  },
  {
    id: 304,
    name: "荔枝玫瑰蛋糕",
    price: "6吋 $650",
    description: "季節限定，玫瑰花瓣與荔枝果香的獨特結合",
    image: "/assets/Logo.png",
    ingredients: "雞蛋、鮮奶油、荔枝、玫瑰精華、糖、麵粉",
    allergens: "麩質、蛋、奶製品",
    freshness: "冷藏保存2天",
    status: "limited_stock",
    customizable: true,
    customOptions: {
      sizes: ["6吋"],
      flavors: ["原味"],
      decorations: ["玫瑰花瓣", "荔枝果肉", "金箔點綴"],
      message: true,
      messageMaxLength: 20,
      advance_days: 3
    }
  },
  {
    id: 305,
    name: "巴斯克乳酪蛋糕",
    price: "6吋 $600 / 8吋 $800",
    description: "獨特焦香表面，濃郁綿密的乳酪內餡",
    image: "/assets/Logo.png",
    ingredients: "奶油乳酪、雞蛋、鮮奶油、糖",
    allergens: "蛋、奶製品",
    freshness: "冷藏保存3天",
    status: "in_stock",
    customizable: true,  // 改為 true
    customOptions: {     // 添加客製化選項
      sizes: ["6吋", "8吋"],
      flavors: ["原味", "抹茶風味", "焦糖風味"],
      decorations: ["簡約設計", "水果裝飾", "金箔點綴"],
      message: true,
      messageMaxLength: 30,
      advance_days: 1
    }
  },
];

// 其他甜點
export const mixDrinksData = [
  {
    id: 401,
    name: "超級鳳梨酥",
    description: "酥脆外皮包裹濃郁內餡",
    price: "6入 $180",
    image: "/assets/Logo.png",
    ingredients: "麵粉、奶油、鳳梨、糖",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "保存期7天"
  },
  {
    id: 402,
    name: "法式瑪德蓮",
    description: "經典貝殼造型小蛋糕",
    price: "6入 $160",
    image: "/assets/Logo.png",
    ingredients: "麵粉、雞蛋、奶油、糖",
    allergens: "麩質、蛋、奶製品",
    status: "in_stock",
    freshness: "保存期3天"
  },
  {
    id: 403,
    name: "肉桂捲",
    description: "北歐風格甜點，濃郁肉桂香",
    price: "$70",
    image: "/assets/Logo.png",
    ingredients: "麵粉、奶油、肉桂、糖、核桃",
    allergens: "麩質、奶製品、堅果",
    status: "in_stock",
    freshness: "當日新鮮製作，建議當天食用"
  },
  {
    id: 404,
    name: "蘋果派",
    description: "酥脆派皮與新鮮蘋果",
    price: "8吋 $300",
    image: "/assets/Logo.png",
    ingredients: "麵粉、奶油、蘋果、肉桂、糖",
    allergens: "麩質、奶製品",
    status: "pre_order",
    freshness: "保存期2天"
  },
  {
    id: 405,
    name: "抹茶司康",
    description: "英式下午茶點心",
    price: "$60",
    image: "/assets/Logo.png",
    ingredients: "麵粉、抹茶粉、奶油、糖",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "當日新鮮製作，保存期2天"
  },
  {
    id: 406,
    name: "焦糖餅乾",
    description: "香酥可口零食",
    price: "10入 $120",
    image: "/assets/Logo.png",
    ingredients: "麵粉、奶油、糖",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "保存期10天"
  },
  {
    id: 407,
    name: "藍莓馬芬",
    description: "美式經典早餐",
    price: "$65",
    image: "/assets/Logo.png",
    ingredients: "麵粉、雞蛋、奶油、糖、藍莓",
    allergens: "麩質、蛋、奶製品",
    status: "in_stock",
    freshness: "當日新鮮製作，保存期2天"
  },
  {
    id: 408,
    name: "檸檬塔",
    description: "法式經典甜點",
    price: "$80",
    image: "/assets/Logo.png",
    ingredients: "麵粉、奶油、雞蛋、檸檬汁、糖",
    allergens: "麩質、蛋、奶製品",
    status: "in_stock",
    freshness: "冷藏保存3天"
  },
  {
    id: 409,
    name: "巧克力餅乾",
    description: "經典美式軟餅乾",
    price: "6入 $150",
    image: "/assets/Logo.png",
    ingredients: "麵粉、巧克力、奶油、糖",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "保存期7天"
  },
  {
    id: 410,
    name: "北海道牛奶麵包",
    description: "濃郁奶香軟麵包",
    price: "$50",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、牛奶、奶油、糖、鹽、酵母",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "當日新鮮製作，保存期1天"
  },
  {
    id: 411,
    name: "紅豆麵包",
    description: "傳統台式麵包",
    price: "$45",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、紅豆餡、奶油、糖、鹽、酵母",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "當日新鮮製作，保存期1天"
  },
  {
    id: 412,
    name: "葡萄乾小麵包",
    description: "經典早餐小餐包",
    price: "5入 $100",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、葡萄乾、奶油、糖、鹽、酵母",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "當日新鮮製作，保存期2天"
  },
  {
    id: 413,
    name: "奶油吐司",
    description: "柔軟鬆厚早餐麵包",
    price: "一條 $120",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、牛奶、奶油、糖、鹽、酵母",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "保存期3天"
  },
  {
    id: 414,
    name: "起士貝果",
    description: "紐約風格早餐",
    price: "$60",
    image: "/assets/Logo.png",
    ingredients: "高筋麵粉、起司、蜂蜜、鹽、酵母",
    allergens: "麩質、奶製品",
    status: "in_stock",
    freshness: "當日新鮮製作，保存期1天"
  },
  {
    id: 415,
    name: "核果酥餅",
    description: "多種堅果混合",
    price: "8入 $180",
    image: "/assets/Logo.png",
    ingredients: "麵粉、奶油、核桃、杏仁、腰果、糖",
    allergens: "麩質、奶製品、堅果",
    status: "limited_stock",
    freshness: "保存期7天"
  },
];
