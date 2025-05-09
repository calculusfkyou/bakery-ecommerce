import React from 'react';
import { DrinkCard } from './DrinkCard';

export function ClassicSection({ classicDrinksData }) {
  return (
    <section id="classic" className="mb-16 pt-8 scroll-mt-20">
      {/* 自定義標題區塊，使用麵包色 */}
      <div className="mb-6">
        <div className="bg-[#f7f5f0] border-l-4 border-[#5a6440] px-4 py-3 rounded-r-md">
          <h2 className="text-2xl font-bold text-[#5a6440]">經典系列</h2>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#5a6440] to-[#f7f5f0] mt-1 rounded-full"></div>
      </div>

      <p className="text-center text-[#5a6440] font-medium text-lg mb-8">『 以精湛工藝，為您呈現最道地的歐式風味 』</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {classicDrinksData.map(drink => (
          <DrinkCard key={drink.id} {...drink} />
        ))}
      </div>
    </section>
  );
}
