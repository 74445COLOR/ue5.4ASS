import React from 'react';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple split by code blocks
  // Regex to match ```language ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Extract language and code
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
          if (match) {
            const [, lang, code] = match;
            return <CodeBlock key={index} language={lang || 'cpp'} code={code.trim()} />;
          }
          return null; 
        } else {
          // Process bold text, lists, etc. (basic handling)
          const lines = part.split('\n');
          return (
            <div key={index} className="whitespace-pre-wrap">
              {lines.map((line, i) => {
                 // Basic Bold processing
                 const parts = line.split(/(\*\*.*?\*\*)/g);
                 return (
                   <span key={i} className="block min-h-[1rem]">
                      {parts.map((p, j) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                          return <strong key={j} className="text-souls-gold">{p.slice(2, -2)}</strong>;
                        }
                        return p;
                      })}
                   </span>
                 )
              })}
            </div>
          );
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;