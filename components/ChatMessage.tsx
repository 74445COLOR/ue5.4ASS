import React from 'react';
import { Message, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot, User, Cpu } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
          isUser 
            ? 'bg-souls-700 border-souls-600' 
            : 'bg-souls-900 border-souls-gold/30'
        }`}>
          {isUser ? <User size={20} className="text-gray-300" /> : <Bot size={20} className="text-souls-gold" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col p-4 rounded-2xl shadow-md border ${
          isUser
            ? 'bg-souls-700 border-souls-600 text-gray-100 rounded-tr-sm'
            : 'bg-black/40 border-souls-800 text-gray-200 rounded-tl-sm backdrop-blur-sm'
        }`}>
          {message.role === Role.MODEL && (
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-souls-800">
               <Cpu size={14} className="text-souls-gold animate-pulse" />
               <span className="text-xs font-mono text-souls-muted">UE5 ARCHITECT CORE</span>
             </div>
          )}
          
          <div className="text-sm md:text-base leading-relaxed">
            <MarkdownRenderer content={message.content} />
          </div>
          
          {message.isStreaming && (
             <div className="mt-2 flex gap-1">
                <div className="w-2 h-2 bg-souls-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-souls-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-souls-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;