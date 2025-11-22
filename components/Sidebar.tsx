import React from 'react';
import { SOULSLIKE_MODULES } from '../constants';
import { ModuleType } from '../types';
import { Sword, User, Skull, Backpack, ChevronRight, Terminal } from 'lucide-react';

interface SidebarProps {
  onSelectModule: (prompt: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectModule, isOpen, onClose }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sword': return <Sword size={18} />;
      case 'user': return <User size={18} />;
      case 'skull': return <Skull size={18} />;
      case 'backpack': return <Backpack size={18} />;
      default: return <Terminal size={18} />;
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 bg-souls-900 border-r border-souls-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-souls-800 flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-souls-gold to-amber-700 rounded flex items-center justify-center shadow-lg shadow-amber-900/20">
              <Terminal className="text-white" size={20} />
           </div>
           <h1 className="font-bold text-lg tracking-wider text-gray-100">SOUL<span className="text-souls-gold">FORGE</span></h1>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-xs font-bold text-souls-muted uppercase tracking-widest mb-4 px-2">
            Core Systems / 核心模块
          </p>
          
          <div className="space-y-2">
            {(Object.keys(SOULSLIKE_MODULES) as ModuleType[]).map((key) => {
              const module = SOULSLIKE_MODULES[key];
              return (
                <button
                  key={key}
                  onClick={() => {
                    onSelectModule(module.prompt);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className="w-full text-left group relative overflow-hidden p-3 rounded-lg border border-souls-800 bg-souls-900/50 hover:bg-souls-800 hover:border-souls-600 transition-all duration-200"
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="mt-1 text-souls-gold group-hover:text-white transition-colors">
                      {getIcon(module.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-200 group-hover:text-souls-gold transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                        {module.description}
                      </p>
                    </div>
                    <ChevronRight size={14} className="absolute right-0 top-4 text-souls-700 group-hover:text-souls-gold opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 -translate-x-2" />
                  </div>
                  
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-souls-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-souls-800/50 border border-souls-700/50">
            <h4 className="text-xs font-bold text-souls-gold mb-2">TIPS / 提示</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              选择左侧模块以生成高质量的 C++ 核心代码。AI 将模拟 UE5.4 专家，为您提供 .h 和 .cpp 完整实现。
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-souls-800 text-center">
          <p className="text-[10px] text-souls-600 font-mono">
            POWERED BY GEMINI 3 PRO PREVIEW
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;