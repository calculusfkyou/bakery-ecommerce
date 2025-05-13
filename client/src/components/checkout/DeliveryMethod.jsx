import React, { useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';

export function DeliveryMethod({
  user,
  deliveryMethod,
  handleDeliveryMethodChange,
  // 新增地址選擇相關參數
  userAddresses = [],
  selectedAddressId,
  setSelectedAddressId,
  onAddNewAddress,
  // 自取相關參數
  pickupInfo,
  handlePickupInfoChange,
  storeLocations,
  handleNextStep
}) {
  // 自動選擇預設地址
  useEffect(() => {
    if (deliveryMethod === 'delivery' && userAddresses.length > 0 && !selectedAddressId) {
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      setSelectedAddressId(defaultAddress ? defaultAddress.id : userAddresses[0].id);
    }
  }, [deliveryMethod, userAddresses, selectedAddressId, setSelectedAddressId]);

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
            <h3 className="font-medium text-gray-800 mb-2">選擇配送地址</h3>

            {userAddresses.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {userAddresses.map(address => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`border p-3 rounded-md cursor-pointer hover:border-[#5a6440] transition-colors ${selectedAddressId === address.id ? 'border-[#5a6440] bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="h-4 w-4 text-[#5a6440] focus:ring-[#5a6440]"
                        />
                        <span className="ml-2 font-medium">
                          {address.nickname && `${address.nickname} - `}{address.recipient}
                          {address.isDefault && (
                            <span className="ml-2 px-2 py-0.5 bg-[#4a5332] text-white text-xs rounded-full">預設</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="ml-6 mt-1">
                      <p className="text-gray-500">{address.phone}</p>
                      <p className="text-gray-700">{address.city}{address.district}{address.address}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={onAddNewAddress}
                  className="border border-dashed border-gray-300 p-3 rounded-md text-center hover:bg-gray-50 flex items-center justify-center"
                >
                  <FiPlus className="mr-2" /> 新增配送地址
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-yellow-700 mb-2">您尚未保存任何配送地址</p>
                <button
                  onClick={onAddNewAddress}
                  className="px-4 py-2 bg-[#5a6440] text-white rounded hover:bg-opacity-90"
                >
                  <FiPlus className="inline mr-1" /> 新增配送地址
                </button>
              </div>
            )}

            {selectedAddressId && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">已選擇的配送地址</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">收件人</p>
                    <p className="font-medium">{userAddresses.find(a => a.id === selectedAddressId)?.recipient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">聯絡電話</p>
                    <p className="font-medium">{userAddresses.find(a => a.id === selectedAddressId)?.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">配送地址</p>
                    <p className="font-medium">
                      {(() => {
                        const addr = userAddresses.find(a => a.id === selectedAddressId);
                        return addr ? `${addr.city}${addr.district}${addr.address}` : '';
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
          disabled={deliveryMethod === 'delivery' && !selectedAddressId}
        >
          下一步：選擇配送時間
        </button>
      </div>
    </div>
  );
}
