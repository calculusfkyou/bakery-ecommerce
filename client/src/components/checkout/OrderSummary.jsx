// 修改 OrderSummary 組件以展示優惠碼折扣

export function OrderSummary({ cartItems, totalPrice, deliveryMethod, promoDiscount = 0 }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="font-semibold text-lg mb-4 text-[#5a6440]">訂單摘要</h2>

      <div className="divide-y divide-gray-200">
        {cartItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="py-3 flex items-center">
            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {item.customOptions?.size && `${item.customOptions.size} | `}
                {item.customOptions?.flavor && `${item.customOptions.flavor}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#5a6440]">${item.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500">x {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">商品小計</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">運費</span>
          <span>{deliveryMethod === 'delivery' ? '$0.00' : '免費'}</span>
        </div>

        {/* 顯示優惠折扣 */}
        {promoDiscount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>優惠折扣</span>
            <span>-${promoDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold">訂單總計</span>
          <span className="font-bold text-lg text-[#5a6440]">${(totalPrice - promoDiscount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
