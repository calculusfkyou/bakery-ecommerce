import React from 'react';

export function AboutIntro() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-[#5a6440]">匠心烘焙，每一口都是幸福</h2>
          <div className="w-24 h-1 bg-[#5a6440] mx-auto mt-3"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <img
              src="/assets/Logo.png"
              alt="匠心烘焙坊品牌介紹"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              「匠心烘焙坊」於2018年在台灣成立，以「品質至上，手工精製」為核心理念。我們相信一款好的麵包，應該兼具傳統烘焙工藝與創新風味的完美結合。
            </p>
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              每一款麵包，尤其是我們的招牌可頌，都由專業烘焙師傅精心製作，選用頂級的歐洲奶油與台灣在地食材，層層堆疊出酥脆口感與濃郁香氣。我們的客製化蛋糕則融合藝術與美味，為每個特別時刻增添甜蜜。
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              從日常早餐到重要慶典，匠心烘焙坊致力於為每位顧客提供純正、天然的烘焙美食體驗，讓生活中的每一刻都能品嚐到幸福的滋味。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
