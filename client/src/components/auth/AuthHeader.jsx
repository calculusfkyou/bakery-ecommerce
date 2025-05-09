import React from 'react';

export function AuthHeader({ title, subtitle }) {
  return (
    <div className="bg-[#F2EADC] py-16 mb-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-800">{title}</h1>
        <p className="text-xl font-serif text-gray-500 tracking-wider mt-2">{subtitle}</p>
      </div>
    </div>
  );
}
