import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";
import { createGoogleADKProvider } from "./google-adk-provider";

// Create Google ADK provider instance
const googleADKProvider = createGoogleADKProvider({
  baseURL: process.env.GOOGLE_ADK_API_BASE_URL || "http://localhost:8000",
  appName: process.env.GOOGLE_ADK_APP_NAME || "my_agent",
  apiKey: process.env.GOOGLE_ADK_API_KEY,
  enableStreaming: true,
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
          "google-adk-agent": chatModel, // fallback for testing
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": gateway.languageModel("xai/grok-2-vision-1212"),
        "chat-model-reasoning": wrapLanguageModel({
          model: gateway.languageModel("xai/grok-3-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": gateway.languageModel("xai/grok-2-1212"),
        "artifact-model": gateway.languageModel("xai/grok-2-1212"),
        // Google ADK Agent - 直接使用模型ID，由ADK处理实际模型选择
        "google-adk-agent": googleADKProvider.languageModel("adk-agent"),
      },
    });
