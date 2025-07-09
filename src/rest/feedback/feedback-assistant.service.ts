import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApisauceInstance, create } from "apisauce";
import { CompletionResponse } from "./openai";
import { GptSystemPrompt } from "./gpt-systems";

export interface AIMessageHistory {
  role: "system" | "assistant" | "user";
  content: string;
}

interface CompletionRequest {
  model: "gpt-4o-mini";
  response_format?: { type: "json_object" };
  messages: AIMessageHistory[];
}

interface ValidationResult {
  invalid: boolean;
  reason: string;
}

@Injectable()
export class FeedbackAssistantService {
  private api: ApisauceInstance;
  constructor(private readonly config: ConfigService) {
    this.api = create({
      baseURL: "https://api.proxyapi.ru/openai",
      headers: {
        Authorization: `Bearer ${config.get("gpt.token")}`,
      },
    });
  }

  public async getValidationResult(content: string): Promise<ValidationResult> {
    try {
      const request: CompletionRequest = {
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: GptSystemPrompt.ThreadValidation,
          },
          {
            role: "user",
            content: content,
          },
        ],
      };

      const res = await this.api.post<CompletionResponse>(
        `/v1/chat/completions`,
        request,
      );

      if (res.ok) {
        return JSON.parse(res.data.choices[0].message.content);
      }

      return {
        invalid: false,
        reason: "",
      };
    } catch (e) {
      return {
        invalid: false,
        reason: "",
      };
    }
  }

  public async getGptResponse(
    context: string,
  ): Promise<{ answer?: string; unknown?: boolean }> {
    try {
      const request: CompletionRequest = {
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: GptSystemPrompt.TechicalIssues,
          },
          {
            role: "user",
            content: context,
          },
        ],
      };

      const res = await this.api.post<CompletionResponse>(
        `/v1/chat/completions`,
        request,
      );

      if (res.ok) {
        return JSON.parse(res.data.choices[0].message.content);
      }

      return {
        unknown: true,
      };
    } catch (e) {
      return {
        unknown: true,
      };
    }
  }
}
