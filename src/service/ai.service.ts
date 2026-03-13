import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApisauceInstance, create } from "apisauce";
import { CompletionResponse } from "../feedback/openai";
import { GptSystemPrompt } from "../feedback/gpt-systems";

export interface AIMessageHistory {
  role: "system" | "assistant" | "user";
  content: string;
}

export type GptModel = "gpt-4o-mini" | "gpt-4o" | "gpt-4-turbo";

interface CompletionRequest {
  model: GptModel;
  response_format?: { type: "json_object" };
  messages: AIMessageHistory[];
}

interface ValidationResult {
  invalid: boolean;
  reason: string;
}

@Injectable()
export class AiService {
  private api: ApisauceInstance;
  constructor(private readonly config: ConfigService) {
    this.api = create({
      baseURL: "https://api.proxyapi.ru/openai",
      headers: {
        Authorization: `Bearer ${config.get("gpt.token")}`,
      },
    });
  }

  private async query<T>(
    prompt: keyof typeof GptSystemPrompt,
    input: string,
    fallback: T,
    model: GptModel = "gpt-4o-mini",
  ): Promise<T> {
    try {
      const request: CompletionRequest = {
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: GptSystemPrompt[prompt] },
          { role: "user", content: input },
        ],
      };

      const res = await this.api.post<CompletionResponse>(
        "/v1/chat/completions",
        request,
      );

      if (res.ok) {
        return JSON.parse(res.data.choices[0].message.content) as T;
      }

      return fallback;
    } catch {
      return fallback;
    }
  }

  public async getValidationResult(content: string): Promise<ValidationResult> {
    return this.query<ValidationResult>(
      "ThreadValidation",
      content,
      { invalid: false, reason: "" },
    );
  }

  public async getChatModerationResult(
    chatLog: string,
  ): Promise<{ steamId: string; messageTemperature: number; reasoning: string }[]> {
    const raw = await this.query<{
      results?: { steamId: string; messageTemperature: number; reasoning: string }[];
    }>("ChatModeration", chatLog, { results: [] });

    return raw.results ?? [];
  }

  public async getGptResponse(
    context: string,
  ): Promise<{ answer?: string; unknown?: boolean }> {
    return this.query<{ answer?: string; unknown?: boolean }>(
      "TechicalIssues",
      context,
      { unknown: true },
    );
  }
}
