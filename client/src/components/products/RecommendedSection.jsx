import React from 'react';
import { SectionTitle } from './SectionTitle';

export function RecommendedSection({ recommendedDrinksData }) {
  return (
    <section id="recommended" className="mb-16 scroll-mt-20">
      {/* 自定義標題區塊，使用麵包色 */}
      <div className="mb-6">
        <div className="bg-[#f7f5f0] border-l-4 border-[#5a6440] px-4 py-3 rounded-r-md">
          <h2 className="text-2xl font-bold text-[#5a6440]">定番推薦</h2>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#5a6440] to-[#f7f5f0] mt-1 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-7">
          <div className="relative group overflow-hidden rounded-lg shadow-md">
            <img
              src={recommendedDrinksData[0].image}
              alt={recommendedDrinksData[0].name}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#5a6440] to-transparent p-3">
              <p className="text-white text-lg font-semibold">{`1. ${recommendedDrinksData[0].name}`}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 grid-rows-2 gap-4">
          {recommendedDrinksData.slice(1).map((drink, index) => (
            <div key={drink.id} className="relative group overflow-hidden rounded-lg shadow-md">
              <img
                src={drink.image}
                alt={drink.name}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#5a6440] to-transparent p-2">
                <p className="text-white text-sm font-semibold">{`${index + 2}. ${drink.name}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
