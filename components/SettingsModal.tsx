import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Save, AlertTriangle, Key, Link, Box, Search, Cpu } from 'lucide-react';
import { AppSettings, AIProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);
  const [animateShow, setAnimateShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setSettings(currentSettings);
        // Trigger animation in next frame
        requestAnimationFrame(() => setAnimateShow(true));
    } else {
        setAnimateShow(false);
    }
  }, [isOpen, currentSettings]);

  if (!isOpen && !animateShow) return null;

  const handleChange = (field: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle backdrop click to close (optional, but good UX)
  const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${animateShow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleBackdropClick}
    >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Modal Card */}
      <div className={`relative w-full max-w-xl bg-souls-900 border border-souls-700/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${animateShow ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-souls-800 flex items-center justify-between bg-gradient-to-r from-souls-900 to-souls-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-souls-800 rounded-lg border border-souls-700 shadow-inner">
                <SettingsIcon className="text-souls-gold animate-spin-slow" size={22} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-100 tracking-wide">系统配置</h2>
                <p className="text-[10px] text-souls-muted font-mono tracking-widest uppercase">System Configuration</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="group p-2 hover:bg-souls-800 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* UE Version Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Box size={16} className="text-souls-gold" />
                <label className="text-sm font-bold text-gray-200 tracking-wide">
                  TARGET ENGINE VERSION
                </label>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['5.0', '5.1', '5.2', '5.3', '5.4', '5.5'].map((v) => (
                <button
                  key={v}
                  onClick={() => handleChange('ueVersion', v)}
                  className={`relative px-2 py-2.5 rounded-lg text-sm font-mono transition-all duration-200 border ${
                    settings.ueVersion === v
                      ? 'bg-souls-gold text-black font-bold border-souls-gold shadow-[0_0_15px_rgba(202,138,4,0.3)] scale-105 z-10'
                      : 'bg-souls-800/50 text-gray-400 border-souls-700 hover:border-souls-500 hover:text-gray-200 hover:bg-souls-800'
                  }`}
                >
                  <span className="text-[10px] opacity-50 block sm:inline mr-1">UE</span>
                  {v}
                  {settings.ueVersion === v && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* AI Provider Section */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <Cpu size={16} className="text-souls-gold" />
                <label className="text-sm font-bold text-gray-200 tracking-wide">
                  INTELLIGENCE CORE
                </label>
            </div>
            
            {/* Segmented Control */}
            <div className="flex p-1.5 bg-black rounded-xl border border-souls-800 relative shadow-inner">
              <div 
                className={`absolute top-1.5 bottom-1.5 rounded-lg bg-souls-700 transition-all duration-300 ease-out shadow-lg border border-souls-600 ${settings.provider === 'gemini' ? 'left-1.5 w-[calc(50%-0.375rem)]' : 'left-[50%] w-[calc(50%-0.375rem)]'}`} 
              />
              <button
                onClick={() => handleChange('provider', 'gemini')}
                className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 flex items-center justify-center gap-2 ${
                  settings.provider === 'gemini' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span>Google Gemini</span>
                {settings.provider === 'gemini' && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]" />}
              </button>
              <button
                onClick={() => handleChange('provider', 'custom')}
                className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 flex items-center justify-center gap-2 ${
                  settings.provider === 'custom' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span>Custom API</span>
                {settings.provider === 'custom' && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(96,165,250,0.5)]" />}
              </button>
            </div>

            <div className="bg-souls-800/30 rounded-xl border border-souls-700/50 p-5 space-y-5 transition-all duration-300">
            {settings.provider === 'gemini' ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="group">
                   <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        <Key size={12} /> API Key <span className="text-souls-muted font-normal text-[10px] ml-auto normal-case opacity-0 group-hover:opacity-100 transition-opacity">Overwrites default env key</span>
                   </label>
                   <div className="relative">
                        <input 
                            type="password" 
                            value={settings.geminiApiKey}
                            onChange={(e) => handleChange('geminiApiKey', e.target.value)}
                            placeholder="Leave empty to use system default"
                            className="w-full bg-black/50 border border-souls-700 rounded-lg pl-4 pr-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-souls-gold/20 focus:border-souls-gold transition-all outline-none placeholder:text-gray-700"
                        />
                   </div>
                </div>

                <div 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-black/60 to-souls-800/20 rounded-lg border border-souls-700 group hover:border-souls-600 transition-colors cursor-pointer" 
                  onClick={() => handleChange('useSearch', !settings.useSearch)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full transition-colors duration-300 ${settings.useSearch ? 'bg-souls-gold/20 text-souls-gold' : 'bg-souls-800 text-gray-600'}`}>
                        <Search size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-sm font-medium transition-colors ${settings.useSearch ? 'text-white' : 'text-gray-400'}`}>Search Grounding</span>
                        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">允许 AI 联网搜索最新的 UE 文档和论坛</span>
                    </div>
                  </div>
                  
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.useSearch ? 'bg-souls-gold' : 'bg-souls-800'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 cubic-bezier(0.4, 0.0, 0.2, 1) ${settings.useSearch ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                 <div className="p-3 bg-amber-900/10 border border-amber-900/30 rounded-lg flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-200/70 leading-relaxed">
                      OpenAI 兼容模式。支持 DeepSeek, Claude (via proxy) 等。请确保接口支持 CORS。
                    </p>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="group">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                <Key size={12} /> API Key
                        </label>
                        <input 
                            type="password" 
                            value={settings.customApiKey}
                            onChange={(e) => handleChange('customApiKey', e.target.value)}
                            placeholder="sk-..."
                            className="w-full bg-black/50 border border-souls-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-souls-gold/20 focus:border-souls-gold transition-all outline-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                    <Link size={12} /> Base URL
                            </label>
                            <input 
                                type="text" 
                                value={settings.customBaseUrl}
                                onChange={(e) => handleChange('customBaseUrl', e.target.value)}
                                placeholder="https://api.openai.com/v1"
                                className="w-full bg-black/50 border border-souls-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-souls-gold/20 focus:border-souls-gold transition-all outline-none font-mono text-xs"
                            />
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                    <Cpu size={12} /> Model Name
                            </label>
                            <input 
                                type="text" 
                                value={settings.customModelName}
                                onChange={(e) => handleChange('customModelName', e.target.value)}
                                placeholder="gpt-4o"
                                className="w-full bg-black/50 border border-souls-700 rounded-lg px-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-souls-gold/20 focus:border-souls-gold transition-all outline-none font-mono text-xs"
                            />
                        </div>
                    </div>
                 </div>
              </div>
            )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-souls-800 bg-souls-900/80 backdrop-blur flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onSave(settings)}
            className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-souls-gold to-souls-flame hover:to-amber-400 text-black font-bold rounded-lg shadow-lg shadow-amber-900/20 hover:shadow-amber-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
          >
            <Save size={18} />
            确认保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;