import React from 'react';
import { DrinkCard } from './DrinkCard';

export function SpecialSection({ specialDrinksData }) {
  return (
    <section id="special" className="mb-16 pt-8 scroll-mt-20">
      {/* 自定義標題區塊，使用麵包色 */}
      <div className="mb-6">
        <div className="bg-[#f7f5f0] border-l-4 border-[#5a6440] px-4 py-3 rounded-r-md">
          <h2 className="text-2xl font-bold text-[#5a6440]">特製蛋糕</h2>
          <p className="text-sm text-[#5a6440]/80 mt-1">期間限定！？</p>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#5a6440] to-[#f7f5f0] mt-1 rounded-full"></div>
      </div>

      <p className="text-center text-[#5a6440] font-medium text-lg mb-8">『 為每一個特別時刻，帶來甜蜜的幸福滋味 』</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {specialDrinksData.map(drink => (
          <DrinkCard key={drink.id} {...drink} />
        ))}
      </div>
    </section>
  );
}
