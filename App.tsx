import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Plus, Loader2, Settings as SettingsIcon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import SettingsModal from './components/SettingsModal';
import { aiService } from './services/geminiService';
import { Message, Role, AppSettings, DEFAULT_SETTINGS } from './types';

const SETTINGS_STORAGE_KEY = 'soulforge_settings';

const App: React.FC = () => {
  // --- State ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      content: `## 欢迎来到 SoulForge \n\n我是您的虚幻引擎 (Unreal Engine) 架构师。我可以为您生成魂类游戏的核心 C++ 代码、建议项目结构或解答引擎技术难题。\n\n**当前配置**: \n- 默认引擎版本: **UE 5.4**\n- 默认模型: **Gemini 2.5 Flash** (支持联网搜索)\n\n请点击右上角设置图标修改引擎版本或接入其他模型。`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Effects ---

  // Load settings from local storage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with default to ensure new fields exist if added later
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // --- Handlers ---

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    setIsSettingsOpen(false);
    
    // Add a system notification about the change
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: Role.SYSTEM,
        content: `**系统更新**: 配置已保存。\n- 目标引擎: UE ${newSettings.ueVersion}\n- AI 核心: ${newSettings.provider === 'gemini' ? 'Gemini' : newSettings.customModelName}`
      }
    ]);
  };

  const handleSendMessage = async (content: string = input) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: content
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Create placeholder for AI response
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: Role.MODEL,
      content: '',
      isStreaming: true
    }]);

    try {
      // Prepare history for context (exclude system messages/placeholders if needed, but simple mapping works)
      const history = messages
        .filter(m => m.role !== Role.SYSTEM) // filter out local system notifications
        .map(m => ({ role: m.role, content: m.content }));

      // Stream response
      const stream = aiService.streamResponse(history, content, settings);
      
      let fullContent = '';

      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, content: fullContent }
            : msg
        ));
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, content: "**发生错误**: 无法连接到 AI 服务，请检查网络或 API Key 设置。", isStreaming: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectModule = (prompt: string) => {
    // Append version context if not explicitly in prompt (though system instruction handles it, explicit is nice)
    const versionedPrompt = `${prompt}\n(Target Engine Version: UE ${settings.ueVersion})`;
    handleSendMessage(versionedPrompt);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-gray-100 selection:bg-souls-gold/30">
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={settings}
        onSave={handleSaveSettings}
      />

      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-souls-800 border border-souls-600 rounded-md text-souls-gold shadow-lg"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onSelectModule={handleSelectModule} 
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative w-full">
        
        {/* Header */}
        <header className="h-16 border-b border-souls-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="ml-10 md:ml-0 flex flex-col">
             <h2 className="font-bold text-gray-200 tracking-wide">UE5 ARCHITECT</h2>
             <span className="text-[10px] font-mono text-souls-gold">
               TARGET: UNREAL ENGINE {settings.ueVersion} | MODE: {settings.provider.toUpperCase()}
             </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMessages([])}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-souls-800/50 hover:bg-souls-700 rounded-md transition-colors"
            >
              <Plus size={14} />
              NEW CHAT
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-souls-gold transition-colors rounded-md hover:bg-souls-800"
              title="Settings"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-souls-800 bg-souls-900/30">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about UE ${settings.ueVersion} C++ architecture, gameplay tags, or networking...`}
              className="w-full bg-souls-800 border border-souls-700 rounded-xl pl-4 pr-12 py-3 text-sm md:text-base text-gray-200 focus:ring-1 focus:ring-souls-gold focus:border-souls-gold outline-none resize-none min-h-[50px] max-h-[200px] shadow-inner"
              rows={1}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all ${
                input.trim() && !isLoading
                  ? 'bg-souls-gold text-black hover:bg-souls-flame shadow-lg shadow-amber-900/20'
                  : 'bg-souls-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-souls-600">
              AI can make mistakes. Always review code before compiling in Unreal Engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;