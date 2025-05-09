import React from 'react';

export function AboutFeatures() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-[#5a6440]">產品特色</h2>
          <div className="w-24 h-1 bg-[#5a6440] mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="rounded-full bg-[#f8f4e5] w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <img src="/assets/Logo.png" alt="頂級原料" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center text-[#5a6440]">頂級原料</h3>
            <p className="text-gray-700 text-center">
              使用法國進口麵粉、紐西蘭天然奶油及比利時巧克力等世界級原料，確保每一款麵包都擁有最純正的風味。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="rounded-full bg-[#f8f4e5] w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <img src="/assets/Logo.png" alt="新鮮食材" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center text-[#5a6440]">新鮮食材</h3>
            <p className="text-gray-700 text-center">
              每日採購新鮮水果與食材，堅持自製麵包內餡與配料，不使用人工添加物，讓您品嚐到最自然的香氣與口感。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="rounded-full bg-[#f8f4e5] w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <img src="/assets/Logo.png" alt="專業烘焙" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center text-[#5a6440]">專業烘焙</h3>
            <p className="text-gray-700 text-center">
              遵循傳統歐式烘焙工藝，堅持適當的發酵時間與烘焙溫度，每一款產品都經過嚴格的品質管控，確保外酥內軟的完美口感。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
