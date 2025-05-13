import React from 'react';
import { FiCreditCard } from 'react-icons/fi';

export function PaymentMethod({
  deliveryMethod,
  paymentMethod,
  handlePaymentMethodChange,
  creditCardInfo,
  handleCreditCardInfoChange,
  invoiceType,
  handleInvoiceTypeChange,
  invoiceInfo,
  handleInvoiceInfoChange,
  orderNotes,
  handleOrderNotesChange,
  handlePreviousStep,
  handleNextStep
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">選擇付款方式</h2>

      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handlePaymentMethodChange('credit_card')}
            className={`border rounded-md p-4 flex flex-col items-center justify-center text-center ${
              paymentMethod === 'credit_card'
                ? 'border-[#5a6440] bg-[#f7f5f0]'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${
              paymentMethod === 'credit_card' ? 'bg-[#5a6440] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <FiCreditCard className="h-6 w-6" />
            </div>
            <span className={paymentMethod === 'credit_card' ? 'font-medium text-[#5a6440]' : 'text-gray-700'}>
              信用卡付款
            </span>
          </button>

          <button
            onClick={() => handlePaymentMethodChange('line_pay')}
            className={`border rounded-md p-4 flex flex-col items-center justify-center text-center ${
              paymentMethod === 'line_pay'
                ? 'border-[#5a6440] bg-[#f7f5f0]'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${
              paymentMethod === 'line_pay' ? 'bg-[#5a6440] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className="font-bold">LINE</span>
            </div>
            <span className={paymentMethod === 'line_pay' ? 'font-medium text-[#5a6440]' : 'text-gray-700'}>
              LINE Pay
            </span>
          </button>

          <button
            onClick={() => handlePaymentMethodChange('cash')}
            className={`border rounded-md p-4 flex flex-col items-center justify-center text-center ${
              paymentMethod === 'cash'
                ? 'border-[#5a6440] bg-[#f7f5f0]'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${
              paymentMethod === 'cash' ? 'bg-[#5a6440] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className="font-bold">$</span>
            </div>
            <span className={paymentMethod === 'cash' ? 'font-medium text-[#5a6440]' : 'text-gray-700'}>
              貨到付款
            </span>
          </button>
        </div>

        {/* 信用卡資訊 */}
        {paymentMethod === 'credit_card' && (
          <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">卡號 *</label>
              <input
                type="text"
                name="number"
                value={creditCardInfo.number}
                onChange={handleCreditCardInfoChange}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">持卡人姓名 *</label>
              <input
                type="text"
                name="name"
                value={creditCardInfo.name}
                onChange={handleCreditCardInfoChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">有效期限 *</label>
                <input
                  type="text"
                  name="expiry"
                  value={creditCardInfo.expiry}
                  onChange={handleCreditCardInfoChange}
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">安全碼 *</label>
                <input
                  type="text"
                  name="cvc"
                  value={creditCardInfo.cvc}
                  onChange={handleCreditCardInfoChange}
                  placeholder="CVC"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* LINE Pay 指示 */}
        {paymentMethod === 'line_pay' && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-gray-600">提交訂單後，您將被引導至 LINE Pay 付款頁面。完成付款後，訂單將立即處理。</p>
          </div>
        )}

        {/* 貨到付款提示 */}
        {paymentMethod === 'cash' && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-gray-600">
              {deliveryMethod === 'delivery'
                ? '貨到時請以現金付款給配送人員。'
                : '取貨時請在門市付款。'
              }
            </p>
          </div>
        )}

        {/* 發票資訊 */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-800 mb-3">發票資訊</h3>

          <div className="flex mb-4">
            <button
              onClick={() => handleInvoiceTypeChange('personal')}
              className={`flex-1 py-2 px-4 rounded-l-md border ${
                invoiceType === 'personal'
                  ? 'bg-[#5a6440] text-white border-[#5a6440]'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              個人發票
            </button>
            <button
              onClick={() => handleInvoiceTypeChange('company')}
              className={`flex-1 py-2 px-4 rounded-r-md border ${
                invoiceType === 'company'
                  ? 'bg-[#5a6440] text-white border-[#5a6440]'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              公司發票
            </button>
          </div>

          {invoiceType === 'personal' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">載具號碼 (選填)</label>
              <input
                type="text"
                name="carrier"
                value={invoiceInfo.carrier}
                onChange={handleInvoiceInfoChange}
                placeholder="若不填寫，將提供紙本發票"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司名稱 *</label>
                <input
                  type="text"
                  name="companyName"
                  value={invoiceInfo.companyName}
                  onChange={handleInvoiceInfoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">統一編號 *</label>
                <input
                  type="text"
                  name="companyId"
                  value={invoiceInfo.companyId}
                  onChange={handleInvoiceInfoChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* 備註 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">訂單備註 (選填)</label>
          <textarea
            value={orderNotes}
            onChange={handleOrderNotesChange}
            rows="3"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
            placeholder="如有特殊需求，請在此說明"
          ></textarea>
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
          下一步：確認訂單
        </button>
      </div>
    </div>
  );
}
