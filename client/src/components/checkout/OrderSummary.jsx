import React from 'react';

export function OrderSummary({ cartItems, totalPrice, deliveryMethod }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-semibold mb-4">訂單摘要</h2>

      <div className="space-y-4 mb-6">
        {cartItems.slice(0, 3).map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md mr-3"
            />
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <div className="text-sm text-gray-500">
                {item.customOptions?.size && `${item.customOptions.size}`}
                {item.quantity > 1 && ` x ${item.quantity}`}
              </div>
              <div className="text-[#5a6440] mt-1">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}

        {cartItems.length > 3 && (
          <p className="text-sm text-gray-500 italic">
            以及 {cartItems.length - 3} 件其他商品...
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">商品總數：</span>
          <span>{cartItems.reduce((total, item) => total + item.quantity, 0)} 件</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">小計：</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">運費：</span>
          <span>$0.00</span>
        </div>

        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
          <span>總計：</span>
          <span className="text-lg text-[#5a6440]">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          訂單將於確認付款後處理。
          {deliveryMethod === 'delivery'
            ? '配送時間將視訂單處理速度和交通狀況而定。'
            : '請於選定的時間前往門市取貨。'
          }
        </p>
      </div>
    </div>
  );
}
