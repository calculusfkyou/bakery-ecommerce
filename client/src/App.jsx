import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home'
import ContactPage from './pages/ContactPage'; // 匯入 ContactPage
import ProductsPage from './pages/ProductsPage'; // 匯入 ProductsPage
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage'; // 匯入 OrderSuccessPage
import NewsPage from './pages/api/NewsPage'; // 匯入 NewsPage
import NewsDetailPage from './pages/api/NewsDetailPage'; // 匯入 NewsDetailPage
import LocationsPage from './pages/api/LocationsPage'; // 匯入 LocationsPage
import StoreDetailPage from './pages/api/StoreDetailPage'; // 匯入 StoreDetailPage
import AboutPage from './pages/AboutPage'; // 匯入 AboutPage
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminProductEditPage from "./pages/admin/AdminProductEditPage";

// 保護管理員路由
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  const location = useLocation();

  if (!isAuthenticated) {
    // 未登入，重定向至登入頁面並記住原來要訪問的URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // 已登入但不是管理員，重定向至首頁
    return <Navigate to="/" replace />;
  }

  // 已登入且是管理員，顯示目標組件
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} /> {/* 新增聯絡我們路由 */}
          <Route path="/products" element={<ProductsPage />} /> {/* 新增飲品介紹路由 */}
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} /> {/* 新增訂單成功頁面路由 */}
          <Route path="/news" element={<NewsPage />} /> {/* 新增新聞列表路由 */}
          <Route path="/news/:id" element={<NewsDetailPage />} /> {/* 新增新聞詳情路由 */}
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/locations/:id" element={<StoreDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* 新增註冊路由 */}
          <Route path="/login" element={<LoginPage />} /> {/* 新增登入路由 */}
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* Add other routes here */}

          {/* 管理員路由 */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedAdminRoute>
                <AdminOrdersPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/orders/:orderId"
            element={
              <ProtectedAdminRoute>
                <AdminOrderDetailPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <ProtectedAdminRoute>
                <AdminProductEditPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products/edit/:productId"
            element={
              <ProtectedAdminRoute>
                <AdminProductEditPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
