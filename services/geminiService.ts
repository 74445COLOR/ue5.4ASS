import { GoogleGenAI } from "@google/genai";
import { Role, AppSettings, AIProvider } from "../types";

// Default Gemini Model
const GEMINI_MODEL_ID = "gemini-2.5-flash"; // Using Flash 2.5 for speed & search tools, or Pro if configured

export class AIService {
  private getSystemInstruction(settings: AppSettings): string {
    return `
      你是一位世界级的虚幻引擎 (Unreal Engine) 专家，专注于版本 **Unreal Engine ${settings.ueVersion}**。
      你的任务是帮助用户开发高质量的 C++ 游戏代码和架构，特别是针对"魂类" (Soulslike) 游戏。

      **自动更新与适应机制**:
      - 当前目标引擎版本为: **UE ${settings.ueVersion}**。
      - 如果用户询问的特性在当前版本有重大变更 (例如 UE5.1 的 Enhanced Input, UE5.4 的 Motion Matching, UE5.5 的 MegaLights)，请务必使用**该版本最新**的 API。
      - 如果你不确定新版本的 API，请优先使用通用且稳定的 C++ 架构，或明确告知用户需要查阅特定文档。

      **核心行为准则 (CRITICAL)**:
      在回答代码相关问题时，严格遵守以下结构：

      1. **项目结构建议 (Project Structure)**: 
         - 针对 UE ${settings.ueVersion} 的模块化建议 (Public/Private 文件夹结构)。
         - 必要的类继承关系。
      
      2. **关键注意事项 (Pre-requisites)**:
         - **Build.cs 依赖**: 列出具体模块 (如 "EnhancedInput", "MotionWarping")。
         - **编辑器设置**: 针对 ${settings.ueVersion} 的特定设置 (例如 Project Settings -> Input)。
         - **网络复制**: 魂类游戏通常需要多人联机，请简述 Replication 策略。

      3. **代码实现 (Implementation)**:
         - 生产就绪的 C++ 代码 (.h 和 .cpp)。
         - 使用 Markdown 格式。
         - 中文注释。

      代码风格要求：
      - 优先使用 Modern C++ (auto, lambda, smart pointers)。
      - 严格遵循 UE 编码规范 (Prefixes: A, U, F, E, I)。
      - 逻辑复杂处使用 GameplayAbilitySystem (GAS) 或 GameplayTags。
    `;
  }

  async *streamResponse(
    history: { role: Role; content: string }[],
    newMessage: string,
    settings: AppSettings
  ) {
    if (settings.provider === 'gemini') {
      yield* this.streamGemini(history, newMessage, settings);
    } else {
      yield* this.streamCustom(history, newMessage, settings);
    }
  }

  // --- Gemini Implementation ---
  private async *streamGemini(
    history: { role: Role; content: string }[],
    newMessage: string,
    settings: AppSettings
  ) {
    try {
      // Use key from settings or fallback to env (env is for demo mostly)
      const apiKey = settings.geminiApiKey || process.env.API_KEY || "";
      if (!apiKey) {
        yield "错误: 未配置 Gemini API Key。请在设置中添加您的 Key。";
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Tools configuration
      const tools: any[] = [];
      if (settings.useSearch) {
        tools.push({ googleSearch: {} });
      }

      const chat = ai.chats.create({
        model: GEMINI_MODEL_ID,
        config: {
          systemInstruction: this.getSystemInstruction(settings),
          tools: tools,
          temperature: 0.7,
        },
        history: history.map(h => ({
          role: h.role === Role.USER ? 'user' : 'model',
          parts: [{ text: h.content }],
        })),
      });

      const result = await chat.sendMessageStream({ message: newMessage });

      for await (const chunk of result) {
        if (chunk.text) {
          yield chunk.text;
        }
        
        // Handle grounding (sources) if available - simplistic handling for stream
        // In a real app, we might send a special object or parse this at the end
        const groundingMetadata = (chunk as any).candidates?.[0]?.groundingMetadata;
        if (groundingMetadata?.groundingChunks) {
           // We could yield citations here, but for simplicity we'll focus on text
        }
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      yield `[Gemini 错误]: ${error.message || "连接失败"}`;
    }
  }

  // --- Custom (OpenAI Compatible) Implementation ---
  private async *streamCustom(
    history: { role: Role; content: string }[],
    newMessage: string,
    settings: AppSettings
  ) {
    try {
      if (!settings.customApiKey) {
        yield "错误: 未配置 Custom API Key。";
        return;
      }

      const messages = [
        { role: 'system', content: this.getSystemInstruction(settings) },
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: newMessage }
      ];

      const response = await fetch(`${settings.customBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.customApiKey}`
        },
        body: JSON.stringify({
          model: settings.customModelName,
          messages: messages,
          stream: true,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const err = await response.text();
        yield `[API Error ${response.status}]: ${err}`;
        return;
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const data = trimmed.slice(6);
            if (data === "[DONE]") return;
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // ignore incomplete json
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Custom API Error:", error);
      yield `[连接错误]: ${error.message}`;
    }
  }
}

export const aiService = new AIService();