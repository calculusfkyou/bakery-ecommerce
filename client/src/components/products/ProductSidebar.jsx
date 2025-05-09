import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

// 側邊欄項目資料
const sidebarItems = [
  { name: "定番推薦", href: "#recommended" },
  { name: "經典系列", href: "#classic" },
  { name: "特製蛋糕", href: "#special" },
  { name: "其他甜點", href: "#mix" },
  { name: "菜單 MENU", href: "#menu"},
];

export function ProductSidebar({
  filterOptions,
  searchTerm,
  selectedCategories,
  priceRange,
  selectedAllergens,
  selectedFeatures,
  onSearchChange,
  onCategoryChange,
  onPriceRangeChange,
  onAllergensChange,
  onFeaturesChange
}) {
  // 獲取當前 URL 的 hash (錨點)
  const [currentHash, setCurrentHash] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const filterContentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // 監聽 hash 變化，用於更新選中項
  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    // 初始設置
    updateHash();

    // 添加事件監聽器
    window.addEventListener('hashchange', updateHash);

    // 清理函數
    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  // 測量篩選內容的高度，用於動畫
  useEffect(() => {
    if (filterContentRef.current) {
      setContentHeight(filterContentRef.current.scrollHeight);
    }
  }, [filterOptions, selectedCategories, selectedAllergens, selectedFeatures]);

  // 處理篩選功能的各種事件處理器
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleAllergenChange = (allergen) => {
    if (selectedAllergens.includes(allergen)) {
      onAllergensChange(selectedAllergens.filter(a => a !== allergen));
    } else {
      onAllergensChange([...selectedAllergens, allergen]);
    }
  };

  const handleFeatureChange = (feature) => {
    if (selectedFeatures.includes(feature)) {
      onFeaturesChange(selectedFeatures.filter(f => f !== feature));
    } else {
      onFeaturesChange([...selectedFeatures, feature]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange([]);
    onPriceRangeChange(filterOptions?.priceRange || { min: 0, max: 1000 });
    onAllergensChange([]);
    onFeaturesChange([]);
  };

  // 選項列表
  const allergenOptions = [
    { id: 'no-gluten', label: '無麩質', value: '無麩質' },
    { id: 'no-nuts', label: '無堅果', value: '無堅果' },
    { id: 'no-dairy', label: '無奶製品', value: '無奶製品' },
    { id: 'no-eggs', label: '無蛋', value: '無蛋' }
  ];

  const featureOptions = [
    { id: 'new', label: '新品', value: '新品' },
    { id: 'popular', label: '熱銷', value: '熱銷' },
    { id: 'limited', label: '限量', value: '限量' },
    { id: 'preorder', label: '預訂', value: '預訂' }
  ];

  return (
    <aside className="w-72 bg-white rounded-r-lg shadow-md py-6 px-6 hidden md:block fixed left-0 top-20 h-[calc(100vh-80px)] overflow-y-auto z-10">
      {/* 搜尋框 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜尋產品..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* 篩選區塊 - 加入過渡動畫 */}
      <div className="mb-6 border border-gray-200 rounded-md bg-white overflow-hidden">
        <div
          className="flex justify-between items-center p-4 cursor-pointer border-b border-gray-200"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          <h3 className="font-medium text-gray-800">篩選條件</h3>
          <span>{isFilterExpanded ? '−' : '+'}</span>
        </div>

        {/* 使用 CSS transition 和 maxHeight 實現平滑展開/收合 */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: isFilterExpanded ? `${contentHeight}px` : '0px' }}
        >
          <div ref={filterContentRef} className="p-4">
            {/* 分類篩選 */}
            <div className="mb-5">
              <h4 className="font-medium text-sm text-gray-700 mb-2">分類</h4>
              {filterOptions?.categories?.map(category => (
                <div key={category} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2 h-4 w-4 text-[#5a6440] focus:ring-[#5a6440]"
                  />
                  <label htmlFor={`category-${category}`} className="text-sm text-gray-700">{category}</label>
                </div>
              ))}
            </div>

            {/* 價格範圍篩選 */}
            <div className="mb-5">
              <h4 className="font-medium text-sm text-gray-700 mb-2">價格範圍</h4>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-500">最低</label>
                  <label className="text-xs text-gray-500">最高</label>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    value={priceRange?.min}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                    className="w-[45%] py-1 px-2 border border-gray-300 rounded text-sm"
                  />
                  <span className="mx-1">-</span>
                  <input
                    type="number"
                    value={priceRange?.max}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                    className="w-[45%] py-1 px-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 過敏原篩選 */}
            <div className="mb-5">
              <h4 className="font-medium text-sm text-gray-700 mb-2">成分篩選</h4>
              {allergenOptions.map(option => (
                <div key={option.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={selectedAllergens.includes(option.value)}
                    onChange={() => handleAllergenChange(option.value)}
                    className="mr-2 h-4 w-4 text-[#5a6440] focus:ring-[#5a6440]"
                  />
                  <label htmlFor={option.id} className="text-sm text-gray-700">{option.label}</label>
                </div>
              ))}
            </div>

            {/* 特色篩選 */}
            <div className="mb-5">
              <h4 className="font-medium text-sm text-gray-700 mb-2">特色</h4>
              {featureOptions.map(option => (
                <div key={option.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={selectedFeatures.includes(option.value)}
                    onChange={() => handleFeatureChange(option.value)}
                    className="mr-2 h-4 w-4 text-[#5a6440] focus:ring-[#5a6440]"
                  />
                  <label htmlFor={option.id} className="text-sm text-gray-700">{option.label}</label>
                </div>
              ))}
            </div>

            {/* 清除篩選 */}
            <button
              onClick={clearAllFilters}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              清除所有篩選
            </button>
          </div>
        </div>
      </div>

      {/* 導航選單 */}
      <div className="border border-gray-200 rounded-md bg-white">
        <h3 className="font-medium text-gray-800 px-4 py-3 border-b border-gray-200">快速導覽</h3>
        <nav className="space-y-0">
          {sidebarItems.map((item, index) => (
            <div
              key={item.name}
              className={`border-b border-gray-200 ${index === sidebarItems.length - 1 ? '' : ''}`}
            >
              <a
                href={item.href}
                className={`block py-3 px-4 text-sm transition-colors ${
                  currentHash === item.href
                    ? 'text-[#5a6440] font-medium bg-gray-50' // 活躍狀態樣式 (綠色文字)
                    : 'text-gray-700 hover:text-[#5a6440]' // 非活躍狀態樣式
                }`}
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
