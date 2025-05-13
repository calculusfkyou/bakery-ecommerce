import React from 'react';
import { FiClock } from 'react-icons/fi';

export function DeliveryTime({
  deliveryMethod,
  deliveryDate,
  handleDateChange,
  deliveryTime,
  handleTimeChange,
  availableDates,
  availableTimes,
  handlePreviousStep,
  handleNextStep
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">選擇{deliveryMethod === 'delivery' ? '配送' : '取貨'}時間</h2>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">日期 *</label>
          <select
            value={deliveryDate}
            onChange={handleDateChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
            required
          >
            <option value="">請選擇日期</option>
            {availableDates.map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">時間 *</label>
          <select
            value={deliveryTime}
            onChange={handleTimeChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
            required
            disabled={!deliveryDate}
          >
            <option value="">請選擇時間</option>
            {availableTimes.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>

        {/* 提醒事項 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiClock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                請注意：部分商品需提前預訂，我們已為您考慮最佳配送時間。
                {deliveryMethod === 'delivery' ? '配送時間可能會因交通狀況有所調整。' : '請在選定的時間內到店取貨，逾時未取將視為放棄訂單。'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => handlePreviousStep()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          返回上一步
        </button>
        <button
          onClick={handleNextStep}
          className="bg-[#5a6440] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition duration-200"
        >
          下一步：選擇付款方式
        </button>
      </div>
    </div>
  );
}
