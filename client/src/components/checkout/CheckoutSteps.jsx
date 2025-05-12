import React from 'react';
import { FiMapPin, FiClock, FiCreditCard, FiPackage } from 'react-icons/fi';

export function CheckoutSteps({ currentStep }) {
  const steps = [
    { id: 1, name: '配送方式', icon: FiMapPin },
    { id: 2, name: '配送時間', icon: FiClock },
    { id: 3, name: '付款方式', icon: FiCreditCard },
    { id: 4, name: '確認訂單', icon: FiPackage },
  ];

  return (
    <div className="flex justify-between items-center mb-8 overflow-x-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* 步驟項目 */}
          <div className={`flex flex-col items-center ${currentStep >= step.id ? 'text-[#5a6440]' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= step.id ? 'bg-[#5a6440] text-white' : 'bg-gray-200 text-gray-500'}`}>
              <step.icon />
            </div>
            <span className="text-sm">{step.name}</span>
          </div>

          {/* 步驟連接線，最後一個步驟不需要 */}
          {index < steps.length - 1 && (
            <div className={`flex-grow border-t-2 mx-2 ${currentStep > step.id ? 'border-[#5a6440]' : 'border-gray-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
