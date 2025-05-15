import { recommendedDrinksData, classicDrinksData, specialDrinksData, mixDrinksData } from '../data/productData';

// 初始化 localStorage 中的商品數據
const initializeProducts = () => {
  // 檢查是否已經初始化
  if (!localStorage.getItem('products')) {
    // 合併所有商品類別
    const allProducts = [
      ...recommendedDrinksData.map(p => ({ ...p, isActive: true, sectionType: 'recommended' })),
      ...classicDrinksData.map(p => ({ ...p, isActive: true, sectionType: 'classic', category: '經典系列' })),
      ...specialDrinksData.map(p => ({ ...p, isActive: true, sectionType: 'special', category: '特製蛋糕' })),
      ...mixDrinksData.map(p => ({ ...p, isActive: true, sectionType: 'mix', category: '其他甜點' }))
    ];
    localStorage.setItem('products', JSON.stringify(allProducts));
  }
};

// 獲取所有商品 (包括已下架商品) - 管理員使用
export const getAllProductsAdmin = async () => {
  initializeProducts();
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  return products;
};

// 獲取所有上架中的商品 - 前台顯示使用
export const getAllProducts = async () => {
  initializeProducts();
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  return products.filter(p => p.isActive);
};

// 按分類獲取上架中的商品
export const getProductsByCategory = async (category) => {
  const products = await getAllProducts();
  return products.filter(p => p.category === category);
};

// 按分類類型獲取上架中的商品
export const getProductsBySectionType = async (sectionType) => {
  const products = await getAllProducts();
  return products.filter(p => p.sectionType === sectionType);
};

// 獲取單一商品
export const getProductById = async (id) => {
  const products = await getAllProductsAdmin();
  const product = products.find(p => p.id === parseInt(id));
  return product || null;
};

// 新增商品
export const createProduct = async (productData) => {
  const products = await getAllProductsAdmin();

  // 生成新的ID (簡單的自增ID策略)
  const maxId = Math.max(...products.map(p => p.id), 0);
  const newProduct = {
    ...productData,
    id: maxId + 1,
    isActive: true
  };

  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  return newProduct;
};

// 更新商品
export const updateProduct = async (id, productData) => {
  const products = await getAllProductsAdmin();
  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    throw new Error('商品不存在');
  }

  products[index] = { ...products[index], ...productData };
  localStorage.setItem('products', JSON.stringify(products));
  return products[index];
};

// 刪除商品
export const deleteProduct = async (id) => {
  const products = await getAllProductsAdmin();
  const filteredProducts = products.filter(p => p.id !== parseInt(id));

  if (filteredProducts.length === products.length) {
    throw new Error('商品不存在');
  }

  localStorage.setItem('products', JSON.stringify(filteredProducts));
  return true;
};

// 上架/下架商品
export const toggleProductStatus = async (id) => {
  const products = await getAllProductsAdmin();
  const index = products.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    throw new Error('商品不存在');
  }

  products[index].isActive = !products[index].isActive;
  localStorage.setItem('products', JSON.stringify(products));
  return products[index];
};

// 分類商品數據的輔助函數
export const getCategorizedProducts = async () => {
  const products = await getAllProducts();

  return {
    recommended: products.filter(p => p.sectionType === 'recommended'),
    classic: products.filter(p => p.sectionType === 'classic'),
    special: products.filter(p => p.sectionType === 'special'),
    mix: products.filter(p => p.sectionType === 'mix')
  };
};

export const saveProduct = async (productData) => {
  // 如果商品有 ID，則更新現有商品；否則創建新商品
  if (productData.id && typeof productData.id !== 'undefined') {
    return await updateProduct(productData.id, productData);
  } else {
    return await createProduct(productData);
  }
};
