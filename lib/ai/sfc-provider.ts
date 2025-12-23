import type { LanguageModel } from 'ai';

// 支持文本和内联数据(图片等)
interface SFCMessagePart {
  text?: string;
  inlineData?: {
    displayName: string;
    data: string; // base64编码
    mimeType: string;
  };
}

interface SFCMessage {
  role: "user" | "assistant" | "model";
  parts: Array<SFCMessagePart>;
}

// 支持camelCase(官方推荐)和snake_case
interface SFCRequest {
  appName?: string;
  userId?: string;
  sessionId?: string;
  newMessage?: SFCMessage;
  // 兼容snake_case
  app_name?: string;
  user_id?: string;
  session_id?: string;
  new_message?: SFCMessage;
  streaming: boolean;
}

interface SFCResponseData {
  content?: {
    parts?: Array<{ text?: string; functionCall?: any; functionResponse?: any }>;
    role?: string;
  };
  modelVersion?: string;
  finishReason?: string;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
    thoughtsTokenCount?: number;
  };
  partial?: boolean;
  invocationId?: string;
  author?: string;
  id?: string;
  timestamp?: number;
}

// 会话信息接口
interface SFCSession {
  id: string;
  appName: string;
  userId: string;
  state: Record<string, any>;
  events: any[];
  lastUpdateTime: number;
}

export class SFCLanguageModel {
  readonly specificationVersion = "v2" as const;
  readonly provider = "sfc" as const;
  readonly modelId: string;
  readonly defaultObjectGenerationMode = "tool" as const;
  readonly supportedUrls: Record<string, RegExp[]> = {};
  readonly supportsImageUrls = true;
  readonly supportsStructuredOutputs = false;

  private readonly apiUrl: string;
  private readonly baseUrl: string;
  private readonly appName: string;
  private readonly useCamelCase: boolean;
  private currentSession?: { userId: string; sessionId: string };

  constructor({
    modelId = "SFC_agent",
    apiUrl = "https://sfc-adk-822219439970.asia-east1.run.app/run_sse",
    appName = "SFC_agent",
    useCamelCase = true, // 默认使用camelCase(官方推荐)
  }: {
    modelId?: string;
    apiUrl?: string;
    appName?: string;
    useCamelCase?: boolean;
  } = {}) {
    this.modelId = modelId;
    this.apiUrl = apiUrl;
    this.baseUrl = apiUrl.replace(/\/run.*$/, ''); // 提取基础URL用于会话管理
    this.appName = appName;
    this.useCamelCase = useCamelCase;
  }


  /**
   * 创建新会话
   * @param userId 用户ID
   * @param sessionId 会话ID
   * @param initialState 初始状态(可选)
   */
  async createSession(
    userId: string,
    sessionId: string,
    initialState?: Record<string, any>
  ): Promise<SFCSession> {
    const url = `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions/${sessionId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initialState || {}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create session: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * 获取会话信息
   */
  async getSession(userId: string, sessionId: string): Promise<SFCSession> {
    const url = `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions/${sessionId}`;
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get session: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * 更新会话状态
   */
  async updateSession(
    userId: string,
    sessionId: string,
    stateDelta: Record<string, any>
  ): Promise<SFCSession> {
    const url = `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions/${sessionId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stateDelta }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update session: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * 删除会话
   */
  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const url = `${this.baseUrl}/apps/${this.appName}/users/${userId}/sessions/${sessionId}`;
    const response = await fetch(url, { method: "DELETE" });

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      throw new Error(`Failed to delete session: ${response.status} ${errorText}`);
    }
  }

  /**
   * 设置当前会话(用于多轮对话)
   */
  setCurrentSession(userId: string, sessionId: string) {
    this.currentSession = { userId, sessionId };
  }

  /**
   * 清除当前会话
   */
  clearCurrentSession() {
    this.currentSession = undefined;
  }

  /**
   * doGenerate 方法 - 不支持,请使用 doStream
   */
  async doGenerate(): Promise<any> {
    throw new Error("doGenerate is not supported for SFC model. Use doStream instead.");
  }

  async doStream(options: any): Promise<any> {
    const { prompt } = options;

    // 提取用户消息(支持多模态)
    const lastMessage = prompt[prompt.length - 1];
    const messageParts: SFCMessagePart[] = [];

    if (lastMessage.role === "user") {
      if (Array.isArray(lastMessage.content)) {
        for (const part of lastMessage.content) {
          if (part.type === "text") {
            messageParts.push({ text: part.text });
          } else if (part.type === "image" && part.image) {
            // 处理图片 - 假设已经是base64格式
            const imageUrl = typeof part.image === "string" ? part.image : part.image.toString();
            if (imageUrl.startsWith("data:")) {
              const [mimeType, base64Data] = imageUrl.split(",");
              messageParts.push({
                inlineData: {
                  displayName: "image.png",
                  data: base64Data,
                  mimeType: mimeType.replace("data:", "").replace(";base64", ""),
                },
              });
            }
          }
        }
      } else {
        messageParts.push({ text: lastMessage.content as string });
      }
    }

    // 使用当前会话或生成新的
    let userId: string;
    let sessionId: string;

    if (this.currentSession) {
      userId = this.currentSession.userId;
      sessionId = this.currentSession.sessionId;
    } else {
      sessionId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      userId = `u_${Math.random().toString(36).substr(2, 9)}`;
      
      // 自动创建会话
      try {
        await this.createSession(userId, sessionId);
        this.currentSession = { userId, sessionId };
      } catch (error) {
        console.warn("Failed to create session, continuing anyway:", error);
      }
    }

    // 构建请求体(支持camelCase和snake_case)
    const requestBody: SFCRequest = this.useCamelCase
      ? {
          appName: this.appName,
          userId: userId,
          sessionId: sessionId,
          newMessage: {
            role: "user",
            parts: messageParts,
          },
          streaming: true,
        }
      : {
          app_name: this.appName,
          user_id: userId,
          session_id: sessionId,
          new_message: {
            role: "user",
            parts: messageParts,
          },
          streaming: true,
        };

    let response: Response;
    try {
      response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      throw new Error(`Failed to connect to SFC API: ${error}`);
    }

    if (!response.ok) {
      let errorMessage = `SFC API error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.text();
        errorMessage += ` - ${errorBody}`;
      } catch {}
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader from API");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    let totalTokens = { prompt: 0, completion: 0 };
    let finishReason: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown" = "unknown";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim() || !line.startsWith("data: ")) continue;

              const jsonStr = line.slice(6); // Remove "data: " prefix
              try {
                const data: SFCResponseData = JSON.parse(jsonStr);

                // Update token counts
                if (data.usageMetadata) {
                  totalTokens.prompt = data.usageMetadata.promptTokenCount || 0;
                  totalTokens.completion = data.usageMetadata.candidatesTokenCount || 0;
                }

                // Handle finish reason
                if (data.finishReason) {
                  finishReason = data.finishReason === "STOP" ? "stop" : "other";
                }

                // Extract text from the content
                if (data.content?.parts) {
                  for (const part of data.content.parts) {
                    if (part.text) {
                      // Only send delta for new text
                      if (data.partial) {
                        const delta = part.text.slice(fullText.length);
                        if (delta) {
                          controller.enqueue({
                            type: "text-delta",
                            id: data.id || "unknown",
                            delta,
                          });
                        }
                        fullText = part.text;
                      } else if (!fullText) {
                        // Final complete text
                        controller.enqueue({
                          type: "text-delta",
                          id: data.id || "unknown",
                          delta: part.text,
                        });
                        fullText = part.text;
                      }
                    }
                  }
                }
              } catch (e) {
                console.error("Failed to parse SSE data:", e);
              }
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return {
      stream,
      rawCall: { rawPrompt: null, rawSettings: {} },
    };
  }
}

export function createSFCProvider() {
  return {
    languageModel: (modelId: string) => {
      return new SFCLanguageModel({ modelId });
    },
  };
}
