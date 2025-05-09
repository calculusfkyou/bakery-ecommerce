import React from 'react';

export function MenuSection() {
  return (
    <div id="menu" className="mb-16 pt-8 scroll-mt-20">
      {/* 自定義標題區塊，使用麵包色 */}
      <div className="mb-6">
        <div className="bg-[#f7f5f0] border-l-4 border-[#5a6440] px-4 py-3 rounded-r-md">
          <h2 className="text-2xl font-bold text-[#5a6440]">菜單 MENU</h2>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#5a6440] to-[#f7f5f0] mt-1 rounded-full"></div>
      </div>

      <p className="text-center text-[#5a6440] font-medium text-lg mb-8">『 完整價目表與商品資訊，方便您的選購 』</p>

      <div className="max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-center">
          <img
            src="/assets/products/menu.jpg"
            alt="完整菜單"
            className="w-full h-auto"
          />
        </div>
        <div className="bg-[#f7f5f0] p-4 text-center">
          <a
            href="/assets/products/menu.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[#5a6440] hover:underline font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            查看原始尺寸
          </a>
        </div>
      </div>
    </div>
  );
}
