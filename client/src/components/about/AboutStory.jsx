import React from 'react';

export function AboutStory() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-[#5a6440]">品牌故事</h2>
          <div className="w-24 h-1 bg-[#5a6440] mx-auto mt-3"></div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pl-8">
            <img
              src="/assets/Logo.png"
              alt="匠心烘焙坊品牌故事"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <div className="prose prose-lg max-w-none">
              <p className="mb-4">
                匠心烘焙坊的創始人林先生，出身於家族烘焙世家，從小耳濡目染各種歐式麵包的製作工藝。大學畢業後，他遠赴法國深造烘焙藝術，並在巴黎知名烘焙坊累積豐富經驗，尤其專精於可頌的製作技術。
              </p>
              <p className="mb-4">
                2018年，懷抱著「將正宗歐式麵包帶入台灣日常」的熱情，林先生回台與志同道合的夥伴創立了匠心烘焙坊。品牌名稱「匠心」，寓意著對烘焙工藝的執著追求與專注精神。
              </p>
              <p>
                從最初的小型工坊到現今多家分店的經營規模，匠心烘焙坊始終堅持手工製作，嚴選頂級原料，每天清晨便開始揉製麵糰、層疊奶油，只為了呈現最新鮮、最道地的烘焙美味給每位顧客。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
