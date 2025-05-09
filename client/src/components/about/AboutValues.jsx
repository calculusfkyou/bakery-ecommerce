import React from 'react';

export function AboutValues() {
  const values = [
    {
      icon: "🌾",
      title: "品質至上",
      description: "堅持使用歐洲頂級麵粉與台灣在地食材，嚴選高品質原料，不添加人工色素與香精"
    },
    {
      icon: "🥖",
      title: "健康純淨",
      description: "採用天然發酵工法，減少添加物使用，重視營養均衡與健康烘焙理念"
    },
    {
      icon: "✨",
      title: "創新傳統",
      description: "傳承歐式烘焙工藝精髓，融入台灣在地風味，不斷研發創新產品與口味"
    },
    {
      icon: "👨‍🍳",
      title: "匠心製作",
      description: "專業烘焙師傅手工製作，每一款產品都經過嚴格品管，確保品質一致與優質口感"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-[#5a6440]">品牌理念</h2>
          <div className="w-24 h-1 bg-[#5a6440] mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-[#5a6440]">{value.title}</h3>
              <p className="text-gray-700">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
