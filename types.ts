export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
  groundingMetadata?: string[]; // For storing search sources
}

export enum ModuleType {
  CHARACTER_BASE = 'CHARACTER_BASE',
  COMBAT_SYSTEM = 'COMBAT_SYSTEM',
  AI_BOSS = 'AI_BOSS',
  INVENTORY = 'INVENTORY',
  CUSTOM = 'CUSTOM'
}

export interface CoreSystemPrompts {
  [key: string]: {
    title: string;
    prompt: string;
    icon: string;
    description: string;
  }
}

export type AIProvider = 'gemini' | 'custom'; // custom handles OpenAI compatible (DeepSeek, ChatGPT, etc.)

export interface AppSettings {
  ueVersion: string;      // e.g., "5.4", "5.3", "5.5"
  provider: AIProvider;
  geminiApiKey: string;
  customApiKey: string;
  customBaseUrl: string;  // e.g., "https://api.openai.com/v1"
  customModelName: string;// e.g., "gpt-4", "deepseek-chat"
  useSearch: boolean;     // Toggle Google Search Grounding (Gemini only)
}

export const DEFAULT_SETTINGS: AppSettings = {
  ueVersion: '5.4',
  provider: 'gemini',
  geminiApiKey: '', // Will try to load from env if empty
  customApiKey: '',
  customBaseUrl: 'https://api.openai.com/v1',
  customModelName: 'gpt-4o',
  useSearch: true
};