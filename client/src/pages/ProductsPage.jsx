import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductSidebar } from '../components/products/ProductSidebar';

// 引入拆分後的元件
import { RecommendedSection } from '../components/products/RecommendedSection';
import { ClassicSection } from '../components/products/ClassicSection';
import { SpecialSection } from '../components/products/SpecialSection';
import { MixSection } from '../components/products/MixSection';
import { MenuSection } from '../components/products/MenuSection';


// 飲品資料
// 假設的飲品資料 (您需要替換成真實資料和圖片路徑)
// 推薦產品
export const recommendedDrinksData = [
  { id: 101, name: "招牌可頌", category: "經典系列", image: "/assets/Logo.png", popular: true, new: false, status: "in_stock" },
  { id: 102, name: "法式巧克力可頌", category: "經典系列", image: "/assets/Logo.png", popular: true, new: false, status: "in_stock" },
  { id: 103, name: "全麥雜糧麵包", category: "經典系列", image: "/assets/Logo.png", popular: false, new: true, status: "in_stock" },
  { id: 104, name: "提拉米蘇", category: "特製蛋糕", image: "/assets/Logo.png", popular: true, new: false, status: "in_stock" },
  { id: 105, name: "焦糖奶油可頌", category: "經典系列", image: "/assets/Logo.png", popular: false, new: true, status: "limited_stock" },
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

export default function ProductsPage() {
  const location = useLocation();

  // 篩選相關狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // 合併所有產品資料以便統一篩選
  const allProducts = useMemo(() => {
    const categorizedProducts = [
      ...recommendedDrinksData.map(p => ({ ...p, sectionType: 'recommended' })),
      ...classicDrinksData.map(p => ({ ...p, sectionType: 'classic', category: '經典系列' })),
      ...specialDrinksData.map(p => ({ ...p, sectionType: 'special', category: '特製蛋糕' })),
      ...mixDrinksData.map(p => ({ ...p, sectionType: 'mix', category: '其他甜點' }))
    ];
    return categorizedProducts;
  }, []);

  // 提取所有可能的過濾選項
  const filterOptions = useMemo(() => {
    const categories = [...new Set(allProducts.map(p => p.category))];

    const allAllergens = allProducts.flatMap(p =>
      p.allergens ? p.allergens.split('、') : []
    );
    const allergens = [...new Set(allAllergens)];

    // 提取所有價格並轉換為數字用於確定範圍
    const prices = allProducts.map(p => {
      const priceStr = p.price?.toString() || '';
      const match = priceStr.match(/\$(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });

    const minPrice = Math.min(...prices.filter(p => p > 0));
    const maxPrice = Math.max(...prices);

    return {
      categories,
      allergens,
      priceRange: { min: minPrice, max: maxPrice }
    };
  }, [allProducts]);

  // 篩選後的產品
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // 關鍵字搜尋
      const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!nameMatch) return false;

      // 分類篩選
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // 價格篩選
      const priceStr = product.price?.toString() || '';
      const priceMatch = priceStr.match(/\$(\d+)/);
      const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;
      if (price < priceRange.min || price > priceRange.max) {
        return false;
      }

      // 成分/過敏原篩選 (如果選擇了「無麩質」，則排除含有麩質的產品)
      if (selectedAllergens.length > 0) {
        const productAllergens = product.allergens ? product.allergens.split('、') : [];
        for (const allergen of selectedAllergens) {
          // 如果選擇了"無XXX"，但產品含有XXX，則排除
          if (allergen.startsWith('無') && productAllergens.includes(allergen.substring(1))) {
            return false;
          }
        }
      }

      // 特色篩選
      if (selectedFeatures.length > 0) {
        let match = false;
        for (const feature of selectedFeatures) {
          if (
            (feature === '新品' && product.new) ||
            (feature === '熱銷' && product.popular) ||
            (feature === '限量' && product.status === 'limited_stock') ||
            (feature === '預訂' && product.status === 'pre_order')
          ) {
            match = true;
            break;
          }
        }
        if (!match) return false;
      }

      return true;
    });
  }, [allProducts, searchTerm, selectedCategories, priceRange, selectedAllergens, selectedFeatures]);

  // 按照分類分組的篩選後產品
  const categorizedFilteredProducts = useMemo(() => {
    return {
      recommended: filteredProducts.filter(p => p.sectionType === 'recommended'),
      classic: filteredProducts.filter(p => p.sectionType === 'classic'),
      special: filteredProducts.filter(p => p.sectionType === 'special'),
      mix: filteredProducts.filter(p => p.sectionType === 'mix')
    };
  }, [filteredProducts]);

  // 處理錨點滾動
  useEffect(() => {
    if (location.hash) {
      // 延遲一下以確保頁面完全渲染
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* 主體內容區 */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex">
        {/* 左側邊欄 - 含篩選功能 */}
        <ProductSidebar
          filterOptions={filterOptions}
          searchTerm={searchTerm}
          selectedCategories={selectedCategories}
          priceRange={priceRange}
          selectedAllergens={selectedAllergens}
          selectedFeatures={selectedFeatures}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategories}
          onPriceRangeChange={setPriceRange}
          onAllergensChange={setSelectedAllergens}
          onFeaturesChange={setSelectedFeatures}
        />

        {/* 右側主要內容區 */}
        <main className="flex-grow md:ml-64 pl-6">
          {/* 篩選結果摘要 - 當有篩選條件時顯示 */}
          {(searchTerm || selectedCategories.length > 0 || selectedAllergens.length > 0 || selectedFeatures.length > 0) && (
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-2">篩選結果</h2>
              <p className="text-gray-600">
                找到 {filteredProducts.length} 項符合條件的商品
              </p>
              {searchTerm && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2 text-sm text-gray-500">關鍵字:</span>
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded">{searchTerm}</span>
                </div>
              )}
              {/* 顯示其他已選篩選條件 */}
            </div>
          )}

          {/* 推薦產品區塊 */}
          {categorizedFilteredProducts.recommended.length > 0 && (
            <>
              <RecommendedSection recommendedDrinksData={categorizedFilteredProducts.recommended} />
              <hr className="my-12 border-gray-300" />
            </>
          )}

          {/* 經典系列區塊 */}
          {categorizedFilteredProducts.classic.length > 0 && (
            <>
              <ClassicSection classicDrinksData={categorizedFilteredProducts.classic} />
              <hr className="my-12 border-gray-300" />
            </>
          )}

          {/* SPECIAL 區塊 */}
          {categorizedFilteredProducts.special.length > 0 && (
            <>
              <SpecialSection specialDrinksData={categorizedFilteredProducts.special} />
              <hr className="my-12 border-gray-300" />
            </>
          )}

          {/* 特調系列區塊 */}
          {categorizedFilteredProducts.mix.length > 0 && (
            <>
              <MixSection mixDrinksData={categorizedFilteredProducts.mix} />
              <hr className="my-12 border-gray-300" />
            </>
          )}

          {/* 當沒有篩選結果時顯示提示訊息 */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-700">沒有找到符合條件的商品</h3>
              <p className="mt-4 text-gray-500">請嘗試調整篩選條件</p>
              <button
                className="mt-6 px-4 py-2 bg-[#5a6440] text-white rounded hover:bg-opacity-90"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategories([]);
                  setPriceRange(filterOptions.priceRange);
                  setSelectedAllergens([]);
                  setSelectedFeatures([]);
                }}
              >
                清除所有篩選
              </button>
            </div>
          )}

          {/* 菜單區塊 - 始終顯示 */}
          <MenuSection />
        </main>
      </div> {/* End container */}

      <Footer />
    </div>
  );
}
