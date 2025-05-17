import React, { useState, useEffect } from 'react';
import { FiSave, FiGlobe, FiPhone, FiMail, FiMapPin, FiClock,
         FiDollarSign, FiInstagram, FiFacebook, FiTwitter, FiSettings } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import authAxios from '../../utils/authAxios';

export default function AdminSettingsPage() {
  // 設定分類
  const [activeTab, setActiveTab] = useState('general');

  // 設定資料
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      siteDescription: '',
      logo: '',
      favicon: '',
    },
    contact: {
      email: '',
      phone: '',
      address: '',
      businessHours: '',
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
    shipping: {
      freeShippingThreshold: 0,
      standardShippingFee: 0,
      shippingNote: '',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // 載入設定
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // 在實際情境中，這裡會使用 authAxios.get('/settings') 從 API 獲取資料
        // 這裡先使用模擬資料
        const mockResponse = {
          general: {
            siteName: '匠心工作坊',
            siteDescription: '提供各種新鮮手工烘焙點心的專業烘焙坊',
            logo: 'https://example.com/logo.png',
            favicon: 'https://example.com/favicon.ico',
          },
          contact: {
            email: 'contact@sweetbakery.com',
            phone: '02-1234-5678',
            address: '台北市信義區信義路五段7號',
            businessHours: '週一至週五 9:00-18:00，週六至週日 10:00-17:00',
          },
          social: {
            facebook: 'https://facebook.com/sweetbakery',
            instagram: 'https://instagram.com/sweetbakery',
            twitter: 'https://twitter.com/sweetbakery',
          },
          shipping: {
            freeShippingThreshold: 1000,
            standardShippingFee: 100,
            shippingNote: '離島地區需另計運費',
          },
          seo: {
            metaTitle: '匠心麵包坊 | 專業手工烘焙甜點',
            metaDescription: '提供各種手工製作的新鮮烘焙點心，蛋糕，麵包，餅乾等甜點',
            keywords: '烘焙,蛋糕,麵包,手工,甜點',
          }
        };

        // 模擬 API 延遲
        setTimeout(() => {
          setSettings(mockResponse);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('獲取設定失敗:', error);
        setError('載入設定資料時發生錯誤，請稍後再試');
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 處理設定變更
  const handleChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };

  // 處理設定儲存
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      // 在實際情境中，這裡會使用 authAxios.put('/settings', settings) 來儲存資料
      // 這裡先模擬成功儲存
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('儲存設定失敗:', error);
      setError('儲存設定時發生錯誤，請稍後再試');
    } finally {
      setSaving(false);
    }
  };

  // Tab 標籤設定
  const tabs = [
    { id: 'general', name: '一般設定', icon: FiSettings },
    { id: 'contact', name: '聯絡資訊', icon: FiPhone },
    { id: 'social', name: '社群媒體', icon: FiFacebook },
    { id: 'shipping', name: '配送設定', icon: FiMapPin },
    { id: 'seo', name: 'SEO 設定', icon: FiGlobe }
  ];

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">網站設定</h2>
        <button
          onClick={handleSave}
          disabled={loading || saving}
          className={`px-4 py-2 rounded flex items-center ${saving || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#5a6440] hover:bg-[#4a5332]'} text-white`}
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              儲存中...
            </>
          ) : (
            <>
              <FiSave className="mr-2" /> 儲存設定
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
          設定已成功儲存！
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-[#5a6440]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-600">載入設定中...</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* 側邊標籤欄 */}
          <div className="md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul>
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left ${
                        activeTab === tab.id
                          ? 'bg-[#5a6440] text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className={`mr-2 ${activeTab === tab.id ? 'text-white' : 'text-[#5a6440]'}`} />
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 設定內容 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              {/* 一般設定 */}
              {activeTab === 'general' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">一般設定</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        網站名稱
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        網站簡介
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                        rows="3"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        網站 Logo URL
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={settings.general.logo}
                          onChange={(e) => handleChange('general', 'logo', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        />
                        <button className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200">
                          上傳
                        </button>
                      </div>
                      {settings.general.logo && (
                        <div className="mt-2">
                          <img
                            src={settings.general.logo}
                            alt="Logo Preview"
                            className="h-12 object-contain"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/200x80?text=Logo+Preview'}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        網站 Favicon URL
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={settings.general.favicon}
                          onChange={(e) => handleChange('general', 'favicon', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        />
                        <button className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200">
                          上傳
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 聯絡資訊 */}
              {activeTab === 'contact' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">聯絡資訊</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiMail className="inline mr-1" /> 電子郵件
                      </label>
                      <input
                        type="email"
                        value={settings.contact.email}
                        onChange={(e) => handleChange('contact', 'email', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiPhone className="inline mr-1" /> 電話號碼
                      </label>
                      <input
                        type="tel"
                        value={settings.contact.phone}
                        onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiMapPin className="inline mr-1" /> 地址
                      </label>
                      <input
                        type="text"
                        value={settings.contact.address}
                        onChange={(e) => handleChange('contact', 'address', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiClock className="inline mr-1" /> 營業時間
                      </label>
                      <textarea
                        value={settings.contact.businessHours}
                        onChange={(e) => handleChange('contact', 'businessHours', e.target.value)}
                        rows="3"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        placeholder="例如：週一至週五 9:00-18:00，週六至週日 10:00-17:00"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* 社群媒體 */}
              {activeTab === 'social' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">社群媒體連結</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiFacebook className="inline mr-1 text-blue-600" /> Facebook 連結
                      </label>
                      <input
                        type="url"
                        value={settings.social.facebook}
                        onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiInstagram className="inline mr-1 text-pink-600" /> Instagram 連結
                      </label>
                      <input
                        type="url"
                        value={settings.social.instagram}
                        onChange={(e) => handleChange('social', 'instagram', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        placeholder="https://instagram.com/youraccount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiTwitter className="inline mr-1 text-blue-400" /> Twitter 連結
                      </label>
                      <input
                        type="url"
                        value={settings.social.twitter}
                        onChange={(e) => handleChange('social', 'twitter', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        placeholder="https://twitter.com/youraccount"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-600">
                        提示: 社群媒體連結將顯示在網站頁尾及聯絡我們頁面。如不需使用，請留空。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 配送設定 */}
              {activeTab === 'shipping' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">配送設定</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiDollarSign className="inline mr-1" /> 免運金額門檻 (NT$)
                      </label>
                      <input
                        type="number"
                        value={settings.shipping.freeShippingThreshold}
                        onChange={(e) => handleChange('shipping', 'freeShippingThreshold', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        min="0"
                        step="1"
                      />
                      <p className="mt-1 text-sm text-gray-500">設為 0 表示無免運優惠</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiDollarSign className="inline mr-1" /> 標準運費 (NT$)
                      </label>
                      <input
                        type="number"
                        value={settings.shipping.standardShippingFee}
                        onChange={(e) => handleChange('shipping', 'standardShippingFee', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        min="0"
                        step="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        配送備註
                      </label>
                      <textarea
                        value={settings.shipping.shippingNote}
                        onChange={(e) => handleChange('shipping', 'shippingNote', e.target.value)}
                        rows="3"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        placeholder="例如：離島地區需另計運費"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO 設定 */}
              {activeTab === 'seo' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">SEO 設定</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta 標題
                      </label>
                      <input
                        type="text"
                        value={settings.seo.metaTitle}
                        onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-500">建議長度不超過 60 個字元</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta 描述
                      </label>
                      <textarea
                        value={settings.seo.metaDescription}
                        onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)}
                        rows="3"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                      ></textarea>
                      <p className="mt-1 text-sm text-gray-500">建議長度不超過 160 個字元</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        關鍵字
                      </label>
                      <input
                        type="text"
                        value={settings.seo.keywords}
                        onChange={(e) => handleChange('seo', 'keywords', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a6440] focus:border-transparent"
                        placeholder="用逗號分隔關鍵字，例如：蛋糕,麵包,甜點"
                      />
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-md">
                      <p className="text-sm text-yellow-700">
                        提示: 優化的 SEO 設定有助於提高網站在搜尋引擎中的排名。請使用相關且具描述性的關鍵字。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
