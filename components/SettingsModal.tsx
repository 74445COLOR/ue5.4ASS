import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Save, AlertTriangle } from 'lucide-react';
import { AppSettings, DEFAULT_SETTINGS, AIProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);

  // Reset local state when modal opens with new props
  useEffect(() => {
    if (isOpen) setSettings(currentSettings);
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  const handleChange = (field: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-souls-900 border border-souls-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-souls-700 flex items-center justify-between bg-souls-800/50">
          <div className="flex items-center gap-3">
            <SettingsIcon className="text-souls-gold" size={20} />
            <h2 className="text-lg font-bold text-gray-100">架构师设置 (Configuration)</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* UE Version Section */}
          <section>
            <label className="block text-sm font-medium text-souls-gold mb-3">
              Unreal Engine 版本
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['5.0', '5.1', '5.2', '5.3', '5.4', '5.5'].map((v) => (
                <button
                  key={v}
                  onClick={() => handleChange('ueVersion', v)}
                  className={`px-3 py-2 rounded-md text-sm font-mono transition-all ${
                    settings.ueVersion === v
                      ? 'bg-souls-gold text-black font-bold shadow-lg'
                      : 'bg-souls-800 text-gray-400 hover:bg-souls-700 hover:text-white'
                  }`}
                >
                  UE {v}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * AI 将根据所选版本动态调整生成的 API 和 Build 依赖。
            </p>
          </section>

          {/* AI Provider Section */}
          <section className="space-y-4 pt-4 border-t border-souls-800">
            <label className="block text-sm font-medium text-souls-gold">
              AI 模型核心 (Core Intelligence)
            </label>
            
            <div className="flex gap-4 p-1 bg-souls-800 rounded-lg">
              <button
                onClick={() => handleChange('provider', 'gemini')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.provider === 'gemini'
                    ? 'bg-souls-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Google Gemini
              </button>
              <button
                onClick={() => handleChange('provider', 'custom')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.provider === 'custom'
                    ? 'bg-souls-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Custom / OpenAI
              </button>
            </div>

            {settings.provider === 'gemini' ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                   <label className="block text-xs text-gray-400 mb-1">Gemini API Key (Optional if using env)</label>
                   <input 
                     type="password" 
                     value={settings.geminiApiKey}
                     onChange={(e) => handleChange('geminiApiKey', e.target.value)}
                     placeholder="通过设置此 Key 覆盖默认配置"
                     className="w-full bg-black border border-souls-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-souls-gold outline-none"
                   />
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-souls-800">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-200">启用联网搜索 (Grounding)</span>
                    <span className="text-xs text-gray-500">允许 AI 搜索最新的 UE 文档和论坛</span>
                  </div>
                  <button 
                    onClick={() => handleChange('useSearch', !settings.useSearch)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.useSearch ? 'bg-souls-gold' : 'bg-souls-700'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${settings.useSearch ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                 <div className="p-3 bg-amber-900/20 border border-amber-900/50 rounded flex gap-2 items-start">
                    <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-200/80">
                      此模式允许接入 DeepSeek, ChatGPT 等模型。请确保服务器支持 CORS 或使用本地代理。
                    </p>
                 </div>
                 <div>
                   <label className="block text-xs text-gray-400 mb-1">API Key</label>
                   <input 
                     type="password" 
                     value={settings.customApiKey}
                     onChange={(e) => handleChange('customApiKey', e.target.value)}
                     placeholder="sk-..."
                     className="w-full bg-black border border-souls-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-souls-gold outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-xs text-gray-400 mb-1">Base URL</label>
                   <input 
                     type="text" 
                     value={settings.customBaseUrl}
                     onChange={(e) => handleChange('customBaseUrl', e.target.value)}
                     placeholder="https://api.openai.com/v1"
                     className="w-full bg-black border border-souls-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-souls-gold outline-none font-mono"
                   />
                 </div>
                 <div>
                   <label className="block text-xs text-gray-400 mb-1">Model Name</label>
                   <input 
                     type="text" 
                     value={settings.customModelName}
                     onChange={(e) => handleChange('customModelName', e.target.value)}
                     placeholder="gpt-4o"
                     className="w-full bg-black border border-souls-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-souls-gold outline-none font-mono"
                   />
                 </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-souls-800 bg-souls-900 flex justify-end">
          <button
            onClick={() => onSave(settings)}
            className="flex items-center gap-2 px-6 py-2 bg-souls-gold hover:bg-souls-flame text-black font-bold rounded-lg transition-all transform active:scale-95"
          >
            <Save size={18} />
            应用配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;