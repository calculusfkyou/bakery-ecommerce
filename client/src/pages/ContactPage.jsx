import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import ContactHeader from '../components/contact/ContactHeader';
import ContactFormSection from '../components/contact/ContactFormSection';

export default function ContactPage() {
  const pageBgColor = 'bg-white'; // 頁面主要背景色 (近似值)

  return (
    <div className={`flex flex-col min-h-screen ${pageBgColor}`}>
      <Navbar />

      <main className="flex-grow w-full">
        <ContactHeader />
        <ContactFormSection />
      </main>

      <Footer />
    </div>
  );
}
