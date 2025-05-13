import React, { useState } from 'react';
import { FiMapPin, FiClock, FiCreditCard, FiPackage, FiCheck, FiFileText, FiEdit, FiPlus } from 'react-icons/fi';

export function OrderConfirmation({
  user,  // 新增用戶資訊參數
  cartItems,
  totalPrice,
  deliveryMethod,
  // 地址選擇相關參數
  userAddresses = [],
  selectedAddressId,
  setSelectedAddressId,
  onAddNewAddress,
  // 自取相關參數
  pickupInfo,
  storeLocations,
  // 時間相關參數
  deliveryDate,
  deliveryTime,
  availableDates,
  availableTimes,
  // 支付相關參數
  paymentMethod,
  invoiceType,
  invoiceInfo,
  orderNotes,
  // 結帳流程相關
  handlePreviousStep,
  handleSubmitOrder,
  // 優惠碼相關參數 - 新增
  promoCode = '',
  setPromoCode,
  promoDiscount = 0,
  onApplyPromoCode,
  promoError = '',
}) {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 獲取選中的地址資訊
  const selectedAddress = userAddresses.find(addr => addr.id === selectedAddressId);

  // 處理訂單提交
  const handleOrderSubmit = () => {
    if (!isTermsAccepted) {
      setSubmitError('請同意使用條款和隱私政策才能提交訂單');
      return;
    }

    if (deliveryMethod === 'delivery' && !selectedAddressId) {
      setSubmitError('請選擇配送地址');
      return;
    }

    handleSubmitOrder();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#5a6440]">確認訂單資訊</h2>
      <p className="text-gray-600 mb-6">請在下方確認您的訂單詳情，如需修改請點擊各區塊右上角的編輯按鈕。</p>

      <div className="space-y-8">
        {/* 用戶基本資訊 - 新增區塊 */}
        <section className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3">
            <h3 className="font-medium text-gray-800 flex items-center">
              用戶資訊
            </h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">姓名</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">電子郵件</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* 訂購商品區域 */}
        <section className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 flex items-center">
              <FiPackage className="mr-2 text-[#5a6440]" /> 訂購商品明細 ({cartItems.reduce((total, item) => total + item.quantity, 0)} 件)
            </h3>
            <button
              onClick={() => handlePreviousStep(3)}
              className="text-sm text-[#5a6440] hover:underline flex items-center"
            >
              <FiEdit className="mr-1" /> 編輯
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.customOptions?.size && <span className="mr-2">尺寸: {item.customOptions.size}</span>}
                    {item.customOptions?.flavor && <span className="mr-2">口味: {item.customOptions.flavor}</span>}
                    {item.customOptions?.decoration && <span>裝飾: {item.customOptions.decoration}</span>}
                  </div>
                  {item.customOptions?.message && (
                    <div className="text-sm text-gray-600 mt-1 italic">
                      「{item.customOptions.message}」
                    </div>
                  )}
                  <div className="text-sm text-[#5a6440] mt-1">
                    單價: ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <div className="font-bold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 配送/取貨資訊區域 */}
        <section className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 flex items-center">
              <FiMapPin className="mr-2 text-[#5a6440]" /> {deliveryMethod === 'delivery' ? '配送資訊' : '自取資訊'}
            </h3>
            <button
              onClick={() => handlePreviousStep(1)}
              className="text-sm text-[#5a6440] hover:underline flex items-center"
            >
              <FiEdit className="mr-1" /> 編輯
            </button>
          </div>

          <div className="p-4">
            {deliveryMethod === 'delivery' ? (
              <div>
                {selectedAddress ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">配送地址名稱</p>
                      <p className="font-medium">{selectedAddress.nickname || '未命名'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">收件人</p>
                      <p className="font-medium">{selectedAddress.recipient}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">聯絡電話</p>
                      <p className="font-medium">{selectedAddress.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">配送地址</p>
                      <p className="font-medium">{selectedAddress.city}{selectedAddress.district}{selectedAddress.address}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-500">請選擇配送地址</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">取貨人</p>
                  <p className="font-medium">{pickupInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">聯絡電話</p>
                  <p className="font-medium">{pickupInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">電子郵件</p>
                  <p className="font-medium">{pickupInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">取貨門市</p>
                  <p className="font-medium">
                    {pickupInfo.store &&
                      storeLocations.find(store => store.id.toString() === pickupInfo.store.toString())?.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {pickupInfo.store &&
                      storeLocations.find(store => store.id.toString() === pickupInfo.store.toString())?.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 配送/取貨時間區域 */}
        <section className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 flex items-center">
              <FiClock className="mr-2 text-[#5a6440]" /> {deliveryMethod === 'delivery' ? '配送時間' : '取貨時間'}
            </h3>
            <button
              onClick={() => handlePreviousStep(2)}
              className="text-sm text-[#5a6440] hover:underline flex items-center"
            >
              <FiEdit className="mr-1" /> 編輯
            </button>
          </div>

          <div className="p-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <p className="text-sm text-gray-500">日期</p>
                <p className="font-medium">
                  {availableDates.find(date => date.value === deliveryDate)?.label || deliveryDate}
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-sm text-gray-500">時間段</p>
                <p className="font-medium">
                  {availableTimes.find(time => time.value === deliveryTime)?.label || deliveryTime}
                </p>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                {deliveryMethod === 'delivery'
                  ? '我們會在指定的時間內送達，如遇特殊情況可能會提前聯絡您調整時間。'
                  : '請在指定的時間內到店取貨，商品將在指定時間前準備完畢。'}
              </p>
            </div>
          </div>
        </section>

        {/* 付款與發票資訊區域 */}
        <section className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 flex items-center">
              <FiCreditCard className="mr-2 text-[#5a6440]" /> 付款與發票資訊
            </h3>
            <button
              onClick={() => handlePreviousStep(3)}
              className="text-sm text-[#5a6440] hover:underline flex items-center"
            >
              <FiEdit className="mr-1" /> 編輯
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">付款方式</p>
                <p className="font-medium">
                  {paymentMethod === 'credit_card' && '信用卡付款'}
                  {paymentMethod === 'line_pay' && 'LINE Pay'}
                  {paymentMethod === 'cash' && (deliveryMethod === 'delivery' ? '貨到付款' : '到店付款')}
                </p>
                {paymentMethod === 'credit_card' && (
                  <p className="text-sm text-gray-500 mt-1">卡號末四碼: ****</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">發票類型</p>
                <p className="font-medium">{invoiceType === 'personal' ? '個人發票' : '公司發票'}</p>
                {invoiceType === 'personal' && invoiceInfo.carrier && (
                  <p className="text-sm text-gray-500 mt-1">載具號碼: {invoiceInfo.carrier}</p>
                )}
                {invoiceType === 'company' && (
                  <>
                    <p className="text-sm text-gray-500 mt-1">公司名稱: {invoiceInfo.companyName}</p>
                    <p className="text-sm text-gray-500">統一編號: {invoiceInfo.companyId}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 訂單備註區域 */}
        {orderNotes && (
          <section className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
              <h3 className="font-medium text-gray-800 flex items-center">
                <FiFileText className="mr-2 text-[#5a6440]" /> 訂單備註
              </h3>
              <button
                onClick={() => handlePreviousStep(3)}
                className="text-sm text-[#5a6440] hover:underline flex items-center"
              >
                <FiEdit className="mr-1" /> 編輯
              </button>
            </div>

            <div className="p-4">
              <p className="text-gray-700">{orderNotes}</p>
            </div>
          </section>
        )}

        {/* 優惠碼區域 - 新增 */}
        <section className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3">
            <h3 className="font-medium text-gray-800 flex items-center">
              <FiFileText className="mr-2 text-[#5a6440]" /> 優惠碼
            </h3>
          </div>

          <div className="p-4">
            <div className="flex items-center">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="輸入優惠碼"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-[#5a6440]"
              />
              <button
                onClick={onApplyPromoCode}
                className="px-4 py-2 bg-[#5a6440] text-white rounded-r hover:bg-opacity-90"
              >
                套用
              </button>
            </div>

            {promoError && (
              <p className="mt-2 text-sm text-red-600">{promoError}</p>
            )}

            {promoDiscount > 0 && (
              <p className="mt-2 text-sm text-green-600">優惠碼已成功套用！</p>
            )}
          </div>
        </section>

        {/* 金額合計區域 */}
        <section className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3">
            <h3 className="font-medium text-gray-800">訂單金額</h3>
          </div>

          <div className="p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">商品小計</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">運費</span>
              <span>$0.00</span>
            </div>

            {/* 優惠碼折扣顯示 - 新增 */}
            {promoDiscount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>優惠折扣</span>
                <span>-${promoDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-gray-200 mt-3">
              <span className="font-semibold text-lg">訂單總計</span>
              <span className="font-semibold text-lg text-[#5a6440]">${(totalPrice - promoDiscount).toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* 條款與隱私聲明 */}
        <div className="mt-6">
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted(!isTermsAccepted)}
              className="h-4 w-4 text-[#5a6440] focus:ring-[#5a6440] border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              我已閱讀並同意網站的<a href="#" className="text-[#5a6440] hover:underline">使用條款</a>和<a href="#" className="text-[#5a6440] hover:underline">隱私政策</a>
            </label>
          </div>
          {submitError && (
            <p className="mt-2 text-sm text-red-600">{submitError}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => handlePreviousStep(3)}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          返回上一步
        </button>
        <button
          onClick={handleOrderSubmit}
          className={`px-8 py-3 rounded-md text-white transition duration-200 ${
            isTermsAccepted
              ? 'bg-[#5a6440] hover:bg-opacity-90'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!isTermsAccepted}
        >
          <span className="flex items-center">
            <FiCheck className="mr-2" /> 確認送出訂單
          </span>
        </button>
      </div>
    </div>
  );
}
