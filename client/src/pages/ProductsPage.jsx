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

// 引入商品服務
import { getAllProducts, getCategorizedProducts } from '../services/productService';

export default function ProductsPage() {
  const location = useLocation();

  // 商品資料狀態
  const [products, setProducts] = useState([]);
  const [categorizedProducts, setCategorizedProducts] = useState({
    recommended: [],
    classic: [],
    special: [],
    mix: []
  });
  const [loading, setLoading] = useState(true);

  // 篩選相關狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // 載入商品資料
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts);

        // 獲取分類後的商品
        const categorized = await getCategorizedProducts();
        setCategorizedProducts(categorized);
      } catch (error) {
        console.error('載入商品失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 提取所有可能的過濾選項
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

    const allAllergens = products.flatMap(p =>
      p.allergens ? p.allergens.split('、') : []
    );
    const allergens = [...new Set(allAllergens)];

    // 提取所有價格並轉換為數字用於確定範圍
    const prices = products.map(p => {
      const priceStr = p.price?.toString() || '';
      const match = priceStr.match(/\$(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });

    const minPrice = Math.min(...prices.filter(p => p > 0)) || 0;
    const maxPrice = Math.max(...prices) || 1000;

    return {
      categories,
      allergens,
      priceRange: { min: minPrice, max: maxPrice }
    };
  }, [products]);

  // 篩選後的產品
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
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

      // 成分/過敏原篩選
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
  }, [products, searchTerm, selectedCategories, priceRange, selectedAllergens, selectedFeatures]);

  // 按照分類分組的篩選後產品
  const categorizedFilteredProducts = useMemo(() => {
    return {
      recommended: filteredProducts.filter(p => p.sectionType === 'recommended'),
      classic: filteredProducts.filter(p => p.sectionType === 'classic'),
      special: filteredProducts.filter(p => p.sectionType === 'special'),
      mix: filteredProducts.filter(p => p.sectionType === 'mix')
    };
  }, [filteredProducts]);

  // 處理錨點滾動 (保留原有功能)
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a6440]"></div>
          <p className="ml-3 text-[#5a6440]">載入商品中...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // 其餘UI部分不變，只用新的資料來源
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
      </div>

      <Footer />
    </div>
  );
}
