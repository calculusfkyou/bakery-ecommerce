import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { addOrder } from '../utils/orderUtils';

// 引入拆分後的組件
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import { DeliveryMethod } from '../components/checkout/DeliveryMethod';
import { DeliveryTime } from '../components/checkout/DeliveryTime';
import { PaymentMethod } from '../components/checkout/PaymentMethod';
import { OrderConfirmation } from '../components/checkout/OrderConfirmation';
import { OrderSummary } from '../components/checkout/OrderSummary';

export default function CheckoutPage() {
  const navigate = useNavigate();

  // 結帳步驟狀態
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // 配送資訊狀態
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' 或 'pickup'

  // 自取資訊
  const [pickupInfo, setPickupInfo] = useState({
    name: '',
    phone: '',
    email: '',
    store: '',
  });

  // 日期與時間選擇
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  // 支付方式
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [creditCardInfo, setCreditCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });

  // 發票資訊
  const [invoiceType, setInvoiceType] = useState('personal');
  const [invoiceInfo, setInvoiceInfo] = useState({
    carrier: '',
    companyName: '',
    companyId: '',
  });

  // 備註
  const [orderNotes, setOrderNotes] = useState('');

  // 用戶和地址資訊
  const [user, setUser] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // 優惠碼相關
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // 店舖自取地點列表
  const storeLocations = [
    { id: 1, name: '台北信義門市', address: '台北市信義區信義路5段7號' },
    { id: 2, name: '台北忠孝門市', address: '台北市大安區忠孝東路四段299號' },
    { id: 3, name: '台北西門門市', address: '台北市萬華區西寧南路70號' },
  ];

  // 載入購物車資料
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (savedCart.length === 0) {
      // 如果購物車是空的，返回購物車頁面
      navigate('/cart');
      return;
    }

    setCartItems(savedCart);

    // 計算總價
    const newTotalPrice = savedCart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    setTotalPrice(newTotalPrice);

    // 生成可選配送日期
    generateAvailableDates();
  }, [navigate]);

  // 載入用戶資訊
  useEffect(() => {
    // 模擬從 API 獲取用戶資訊
    const fetchUserData = () => {
      // 這裡應該改為實際的 API 請求
      const mockUser = {
        id: '123',
        name: '王小明',
        email: 'wang@example.com',
        phone: '0912345678'
      };

      setUser(mockUser);

      // 模擬獲取用戶地址
      const mockAddresses = [
        {
          id: '1',
          nickname: '家',
          recipient: '王小明',
          phone: '0912345678',
          city: '台北市',
          district: '大安區',
          address: '忠孝東路四段2號5樓',
          isDefault: true
        },
        {
          id: '2',
          nickname: '公司',
          recipient: '王小明',
          phone: '0923456789',
          city: '台北市',
          district: '信義區',
          address: '松仁路100號',
          isDefault: false
        }
      ];

      setUserAddresses(mockAddresses);

      // 自動選擇預設地址
      const defaultAddress = mockAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (mockAddresses.length > 0) {
        setSelectedAddressId(mockAddresses[0].id);
      }
    };

    fetchUserData();
  }, []);

  // 生成可用的配送日期
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    // 檢查是否有需要提前預訂的商品，獲取最長的預訂時間
    let maxAdvanceDays = 1; // 默認至少提前 1 天

    cartItems.forEach(item => {
      if (item.customOptions && item.customOptions.advance_days) {
        maxAdvanceDays = Math.max(maxAdvanceDays, item.customOptions.advance_days);
      }
    });

    // 從（今天 + 最大提前天數）開始，提供 14 天可選日期
    for (let i = maxAdvanceDays; i < maxAdvanceDays + 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      // 格式化日期：YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];

      // 日期顯示格式：MM/DD (星期幾)
      const displayDate = `${date.getMonth() + 1}/${date.getDate()} (${getWeekdayName(date.getDay())})`;

      dates.push({ value: formattedDate, label: displayDate });
    }

    setAvailableDates(dates);

    // 如果有日期可選，默認選第一個日期
    if (dates.length > 0) {
      setDeliveryDate(dates[0].value);
      // 設置選定日期的可用時間段
      setAvailableTimesByDate(dates[0].value);
    }
  };

  // 根據選擇的日期設置可用時間段
  const setAvailableTimesByDate = (selectedDate) => {
    // 時間段示例，實際應用中可能需要從後端獲取
    const timeSlots = [
      { value: '09:00-11:00', label: '09:00 - 11:00' },
      { value: '11:00-13:00', label: '11:00 - 13:00' },
      { value: '13:00-15:00', label: '13:00 - 15:00' },
      { value: '15:00-17:00', label: '15:00 - 17:00' },
      { value: '17:00-19:00', label: '17:00 - 19:00' }
    ];

    // 如果是當天或明天，可能需要根據當前時間過濾可用時段
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);
    const isToday = today.toDateString() === selectedDateObj.toDateString();
    const isTomorrow =
      new Date(today.setDate(today.getDate() + 1)).toDateString() ===
      selectedDateObj.toDateString();

    // 根據當前時間過濾可用時段
    let availableTimes = timeSlots;

    if (isToday) {
      const currentHour = new Date().getHours();
      // 假設每個時段需要至少提前 2 小時預訂
      availableTimes = timeSlots.filter(slot => {
        const slotStartHour = parseInt(slot.value.split('-')[0].split(':')[0], 10);
        return slotStartHour - currentHour >= 2;
      });
    }

    setAvailableTimes(availableTimes);

    // 如果有可用時間段，默認選第一個
    if (availableTimes.length > 0) {
      setDeliveryTime(availableTimes[0].value);
    } else {
      setDeliveryTime('');
    }
  };

  // 獲取星期幾的中文名稱
  const getWeekdayName = (day) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return weekdays[day];
  };

  // 處理配送方式變更
  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
  };

  // 處理自取資訊變更
  const handlePickupInfoChange = (e) => {
    const { name, value } = e.target;
    setPickupInfo({ ...pickupInfo, [name]: value });
  };

  // 處理日期變更
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDeliveryDate(selectedDate);
    setAvailableTimesByDate(selectedDate);
  };

  // 處理時間變更
  const handleTimeChange = (e) => {
    setDeliveryTime(e.target.value);
  };

  // 處理支付方式變更
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // 處理信用卡資訊變更
  const handleCreditCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCreditCardInfo({ ...creditCardInfo, [name]: value });
  };

  // 處理發票類型變更
  const handleInvoiceTypeChange = (type) => {
    setInvoiceType(type);
  };

  // 處理發票資訊變更
  const handleInvoiceInfoChange = (e) => {
    const { name, value } = e.target;
    setInvoiceInfo({ ...invoiceInfo, [name]: value });
  };

  // 處理訂單備註變更
  const handleOrderNotesChange = (e) => {
    setOrderNotes(e.target.value);
  };

  // 處理新增地址
  const handleAddNewAddress = () => {
    // 導航到地址管理頁面或開啟地址表單模態框
    alert('導航到地址管理頁面或開啟地址表單');
    // 實際實現可能是:
    // navigate('/profile/addresses/new');
    // 或
    // setShowAddressForm(true);
  };

  // 處理套用優惠碼
  const handleApplyPromoCode = () => {
    // 模擬驗證優惠碼
    if (!promoCode.trim()) {
      setPromoError('請輸入優惠碼');
      return;
    }

    // 這裡應該改為實際的 API 請求來驗證優惠碼
    if (promoCode.toLowerCase() === 'welcome10') {
      // 10% 折扣
      setPromoDiscount(totalPrice * 0.1);
      setPromoError('');
    } else if (promoCode.toLowerCase() === 'bakery100') {
      // 固定折扣 100 元
      setPromoDiscount(Math.min(100, totalPrice)); // 不超過訂單總額
      setPromoError('');
    } else {
      setPromoError('無效的優惠碼');
      setPromoDiscount(0);
    }
  };

  // 提交訂單
  const handleSubmitOrder = () => {
    // 創建訂單對象
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // 取得選定的地址
    const selectedAddress = userAddresses.find(addr => addr.id === selectedAddressId);

    // 根據配送方式獲取對應的配送信息
    const deliveryData = deliveryMethod === 'delivery'
      ? {
          deliveryMethod,
          deliveryInfo: {
            name: selectedAddress?.recipient || '',
            phone: selectedAddress?.phone || '',
            address: `${selectedAddress?.city || ''}${selectedAddress?.district || ''}${selectedAddress?.address || ''}`,
          },
          pickupInfo: null
        }
      : { deliveryMethod, deliveryInfo: null, pickupInfo };

    // 獲取對應的店鋪信息（如果是自取）
    const store = deliveryMethod === 'pickup' && pickupInfo.store
      ? storeLocations.find(s => s.id.toString() === pickupInfo.store.toString())
      : null;

    // 根據支付方式顯示對應文本
    const paymentText =
      paymentMethod === 'credit_card' ? '信用卡付款' :
        paymentMethod === 'line_pay' ? 'LINE Pay' :
          '貨到付款';

    // 構建訂單對象
    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      date: formattedDate,
      status: '處理中',
      totalAmount: totalPrice - promoDiscount, // 扣除優惠折扣
      paymentMethod: paymentText,
      ...deliveryData,
      deliveryDate,
      deliveryTime,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        size: item.customOptions?.size || '',
        flavor: item.customOptions?.flavor || '',
        decoration: item.customOptions?.decoration || '',
        message: item.customOptions?.message || '',
        quantity: item.quantity,
        price: item.price
      })),
      store,
      invoiceType,
      invoiceInfo,
      promoCode: promoDiscount > 0 ? promoCode : null,
      promoDiscount: promoDiscount
    };

    // 保存訂單到 localStorage
    addOrder(newOrder);

    // 保存最後一個訂單ID，用於成功頁面顯示
    localStorage.setItem('lastOrderId', orderId);

    // 清空購物車
    localStorage.removeItem('cart');

    // 導航到訂單完成頁面
    navigate('/order-success');
  };

  // 檢查當前步驟是否已填寫完成
  const isStepComplete = (step) => {
    switch (step) {
      case 1: // 配送方式和資訊
        if (deliveryMethod === 'delivery') {
          return selectedAddressId !== '';
        } else {
          return pickupInfo.name && pickupInfo.phone && pickupInfo.email && pickupInfo.store;
        }
      case 2: // 配送日期和時間
        return deliveryDate && deliveryTime;
      case 3: // 支付方式
        if (paymentMethod === 'credit_card') {
          return creditCardInfo.number && creditCardInfo.name && creditCardInfo.expiry && creditCardInfo.cvc;
        }
        return true;
      default:
        return false;
    }
  };

  // 進行到下一步
  const handleNextStep = () => {
    if (isStepComplete(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('請填寫所有必填欄位');
    }
  };

  // 返回上一步
  const handlePreviousStep = (step) => {
    if (step) {
      setCurrentStep(step);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">結帳流程</h1>

        {/* 步驟導覽 */}
        <CheckoutSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：結帳步驟 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* 步驟 1：配送方式 */}
              {currentStep === 1 && (
                <DeliveryMethod
                  user={user}
                  deliveryMethod={deliveryMethod}
                  handleDeliveryMethodChange={handleDeliveryMethodChange}
                  userAddresses={userAddresses}
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                  onAddNewAddress={handleAddNewAddress}
                  pickupInfo={pickupInfo}
                  handlePickupInfoChange={handlePickupInfoChange}
                  storeLocations={storeLocations}
                  handleNextStep={handleNextStep}
                />
              )}

              {/* 步驟 2：配送時間 */}
              {currentStep === 2 && (
                <DeliveryTime
                  deliveryMethod={deliveryMethod}
                  deliveryDate={deliveryDate}
                  handleDateChange={handleDateChange}
                  deliveryTime={deliveryTime}
                  handleTimeChange={handleTimeChange}
                  availableDates={availableDates}
                  availableTimes={availableTimes}
                  handlePreviousStep={handlePreviousStep}
                  handleNextStep={handleNextStep}
                />
              )}

              {/* 步驟 3：付款方式 */}
              {currentStep === 3 && (
                <PaymentMethod
                  deliveryMethod={deliveryMethod}
                  paymentMethod={paymentMethod}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  creditCardInfo={creditCardInfo}
                  handleCreditCardInfoChange={handleCreditCardInfoChange}
                  invoiceType={invoiceType}
                  handleInvoiceTypeChange={handleInvoiceTypeChange}
                  invoiceInfo={invoiceInfo}
                  handleInvoiceInfoChange={handleInvoiceInfoChange}
                  orderNotes={orderNotes}
                  handleOrderNotesChange={handleOrderNotesChange}
                  handlePreviousStep={handlePreviousStep}
                  handleNextStep={handleNextStep}
                />
              )}

              {/* 步驟 4：確認訂單 */}
              {currentStep === 4 && (
                <OrderConfirmation
                  user={user}
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  deliveryMethod={deliveryMethod}
                  userAddresses={userAddresses}
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                  onAddNewAddress={handleAddNewAddress}
                  pickupInfo={pickupInfo}
                  storeLocations={storeLocations}
                  deliveryDate={deliveryDate}
                  deliveryTime={deliveryTime}
                  availableDates={availableDates}
                  availableTimes={availableTimes}
                  paymentMethod={paymentMethod}
                  invoiceType={invoiceType}
                  invoiceInfo={invoiceInfo}
                  orderNotes={orderNotes}
                  handlePreviousStep={handlePreviousStep}
                  handleSubmitOrder={handleSubmitOrder}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  promoDiscount={promoDiscount}
                  onApplyPromoCode={handleApplyPromoCode}
                  promoError={promoError}
                />
              )}
            </div>
          </div>

          {/* 右側：訂單摘要 */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              totalPrice={totalPrice}
              deliveryMethod={deliveryMethod}
              promoDiscount={promoDiscount}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
