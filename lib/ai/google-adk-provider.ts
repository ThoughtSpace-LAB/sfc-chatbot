import type { LanguageModelV2 } from "@ai-sdk/provider";

interface AdkConfig {
  baseURL: string;
  apiKey?: string;
  appName: string;
  userId?: string;
  enableStreaming?: boolean;
}

interface AdkPart {
  text?: string;
  functionCall?: {
    id: string;
    name: string;
    args: Record<string, any>;
  };
  functionResponse?: {
    id: string;
    name: string;
    response: any;
  };
}

interface AdkMessage {
  role: "user" | "model";
  parts: AdkPart[];
}

interface AdkEvent {
  content: AdkMessage;
  invocationId: string;
  author: string;
  actions: {
    stateDelta: Record<string, any>;
    artifactDelta: Record<string, any>;
    requestedAuthConfigs: Record<string, any>;
  };
  id: string;
  timestamp: number;
}

/**
 * Google ADK Language Model Provider for Vercel AI SDK
 * 
 * This provider allows you to use Google ADK agents with Vercel AI SDK.
 * It converts Vercel AI SDK format to ADK API format and handles streaming responses.
 */
function createGoogleADKLanguageModel(
  modelId: string,
  config: AdkConfig
): LanguageModelV2 {
  return {
    specificationVersion: "v2",
    provider: "google-adk",
    modelId,
    supportedUrls: {},

    async doGenerate() {
      throw new Error(
        "Google ADK provider only supports streaming. Use doStream instead."
      );
    },

    async doStream(options: any) {
      const { prompt } = options;

      // Convert Vercel AI SDK messages to ADK format
      const adkMessages = convertToAdkMessages(prompt);
      const lastUserMessage = adkMessages[adkMessages.length - 1];

      // Generate unique IDs for this session
      const sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const userId = config.userId || `u_${Math.random().toString(36).slice(2, 9)}`;

      const requestBody = {
        appName: config.appName,
        userId,
        sessionId,
        newMessage: lastUserMessage,
        streaming: config.enableStreaming ?? true,
      };

      const response = await fetch(`${config.baseURL}/run_sse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `ADK API request failed: ${response.status} ${response.statusText}`
        );
      }

      const stream = createStreamFromResponse(response);

      return {
        stream,
        rawCall: {
          rawPrompt: requestBody,
          rawSettings: config,
        },
      };
    },
  };
}

function convertToAdkMessages(prompt: any): AdkMessage[] {
  const messages: AdkMessage[] = [];

  for (const message of prompt) {
    if (message.role === "system") {
      // ADK doesn't have a system role, prepend as user message
      messages.push({
        role: "user",
        parts: [{ text: message.content }],
      });
    } else if (message.role === "user") {
      const parts: AdkPart[] = [];
      
      if (typeof message.content === "string") {
        parts.push({ text: message.content });
      } else if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if (part.type === "text") {
            parts.push({ text: part.text });
          } else if (part.type === "image") {
            // Handle image parts if needed
            parts.push({
              text: `[Image: ${part.image || "uploaded image"}]`,
            });
          }
        }
      }

      messages.push({
        role: "user",
        parts,
      });
    } else if (message.role === "assistant") {
      const parts: AdkPart[] = [];
      
      if (typeof message.content === "string") {
        parts.push({ text: message.content });
      } else if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if (part.type === "text") {
            parts.push({ text: part.text });
          } else if (part.type === "tool-call") {
            parts.push({
              functionCall: {
                id: part.toolCallId,
                name: part.toolName,
                args: part.args,
              },
            });
          }
        }
      }

      messages.push({
        role: "model",
        parts,
      });
    } else if (message.role === "tool") {
      // Tool response
      messages.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              id: message.toolCallId || "unknown",
              name: message.toolName || "unknown",
              response: message.content,
            },
          },
        ],
      });
    }
  }

  return messages;
}

function createStreamFromResponse(response: Response): ReadableStream<any> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }

      try {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.enqueue({
              type: "finish",
              finishReason: "stop",
              usage: {
                promptTokens: 0,
                completionTokens: 0,
              },
            });
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim() || !line.startsWith("data: ")) {
              continue;
            }

            try {
              const jsonStr = line.slice(6); // Remove "data: " prefix
              const event: AdkEvent = JSON.parse(jsonStr);

              // Process ADK event and convert to Vercel AI SDK format
              for (const part of event.content.parts) {
                if (part.text) {
                  controller.enqueue({
                    type: "text-delta",
                    id: event.id,
                    delta: part.text,
                  });
                }

                if (part.functionCall) {
                  controller.enqueue({
                    type: "tool-call-delta",
                    toolCallType: "function",
                    toolCallId: part.functionCall.id,
                    toolName: part.functionCall.name,
                    argsTextDelta: JSON.stringify(part.functionCall.args),
                  });
                }

                if (part.functionResponse) {
                  // Function responses are handled differently
                  // They're usually echoed back, so we can skip or log them
                  console.log(
                    "Function response received:",
                    part.functionResponse
                  );
                }
              }
            } catch (err) {
              console.warn("Failed to parse ADK event:", err);
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Create a Google ADK provider instance
 * 
 * @example
 * ```typescript
 * const adkProvider = createGoogleADKProvider({
 *   baseURL: process.env.GOOGLE_ADK_API_BASE_URL || "http://localhost:8000",
 *   appName: "my_agent",
 *   apiKey: process.env.GOOGLE_ADK_API_KEY,
 *   enableStreaming: true,
 * });
 * ```
 */
export function createGoogleADKProvider(config: AdkConfig) {
  return {
    languageModel: (modelId: string) => {
      return createGoogleADKLanguageModel(modelId, config);
    },
  };
}
