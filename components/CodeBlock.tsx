import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'cpp' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-souls-700 bg-souls-900 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-souls-800 border-b border-souls-700">
        <span className="text-xs font-mono text-souls-muted uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-souls-gold hover:text-souls-flame transition-colors font-medium"
        >
          {copied ? '已复制' : '复制代码'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;