import React from 'react';

export function DeliveryMethod({
  deliveryMethod,
  handleDeliveryMethodChange,
  deliveryInfo,
  handleDeliveryInfoChange,
  pickupInfo,
  handlePickupInfoChange,
  storeLocations,
  handleNextStep
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">配送方式</h2>

      <div className="mb-6">
        <div className="flex mb-4">
          <button
            onClick={() => handleDeliveryMethodChange('delivery')}
            className={`flex-1 py-3 px-4 rounded-l-md border ${
              deliveryMethod === 'delivery'
                ? 'bg-[#5a6440] text-white border-[#5a6440]'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            宅配到府
          </button>
          <button
            onClick={() => handleDeliveryMethodChange('pickup')}
            className={`flex-1 py-3 px-4 rounded-r-md border ${
              deliveryMethod === 'pickup'
                ? 'bg-[#5a6440] text-white border-[#5a6440]'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            門市自取
          </button>
        </div>

        {deliveryMethod === 'delivery' ? (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">收件人資訊</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  name="name"
                  value={deliveryInfo.name}
                  onChange={handleDeliveryInfoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話 *</label>
                <input
                  type="tel"
                  name="phone"
                  value={deliveryInfo.phone}
                  onChange={handleDeliveryInfoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件 *</label>
              <input
                type="email"
                name="email"
                value={deliveryInfo.email}
                onChange={handleDeliveryInfoChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地址 *</label>
              <input
                type="text"
                name="address"
                value={deliveryInfo.address}
                onChange={handleDeliveryInfoChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">郵遞區號 *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={deliveryInfo.postalCode}
                  onChange={handleDeliveryInfoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">縣市 *</label>
                <input
                  type="text"
                  name="city"
                  value={deliveryInfo.city}
                  onChange={handleDeliveryInfoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">自取人資訊</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  name="name"
                  value={pickupInfo.name}
                  onChange={handlePickupInfoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話 *</label>
                <input
                  type="tel"
                  name="phone"
                  value={pickupInfo.phone}
                  onChange={handlePickupInfoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件 *</label>
              <input
                type="email"
                name="email"
                value={pickupInfo.email}
                onChange={handlePickupInfoChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">選擇取貨門市 *</label>
              <select
                name="store"
                value={pickupInfo.store}
                onChange={handlePickupInfoChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                required
              >
                <option value="">請選擇門市</option>
                {storeLocations.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name} - {store.address}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleNextStep}
          className="bg-[#5a6440] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition duration-200"
        >
          下一步：選擇配送時間
        </button>
      </div>
    </div>
  );
}
