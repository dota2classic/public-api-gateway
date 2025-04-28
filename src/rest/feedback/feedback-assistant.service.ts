import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApisauceInstance, create } from "apisauce";
import { CompletionResponse } from "./openai";

const system = `
Ты вежливый онлайн ассистент, который помогает решать проблемы с игрой в классическую Dota 2. Ты отвечаешь пользователям на часто задаваемые вопросы в формате {"answer": "Текст ответа"}. Если ты не можешь ответить на вопрос пользователя исходя из предоставленной тебе информации, используй JSON формат {"unknown": true}
Вот часто возникающие проблемы или вопросы и ответы на них. Используй готовые ответы из предоставленного JSON. Ни в коем случае не предлагай установить новую версию игры в Steam.
[
  {"problem":["Черная карта в игре, не видну игру"],"answer": "Выполнить команду в консоли 'gl_clear 0'"},
  {"problem":["Кикает при загрузке в игру", "Отключение от сервера. вы были исключены", "отключение от сервера выгнали"],"answer": "Аккаунты Steam для подключения к игре и на сайте должны совпадать. Так же при подключении с Украины может понадобиться VPN - сервера находятся на территории РФ."},
  {"problem":["Не запускается старая дота"],"answer": "Возможные решения: \n
- Заново извлечь игру из архива с помощью бесплатного архиватора 7zip https://www.7-zip.org
- Установить Directx - https://www.microsoft.com/ru-ru/download/details.aspx?id=35
- Установить Microsoft Visual C++ для 32 бит - https://aka.ms/vs/16/release/vc_redist.x86.exe
- Установить Microsoft Visual C++ для 64 бит - https://aka.ms/vs/16/release/vc_redist.x64.exe
- Установить .NET Framework - https://go.microsoft.com/fwlink/?linkid=2088631
"},
  {"problem":["Запускается новая дота"],"answer": "Перед тем, как подключаться к игре, нужно запустить старую доту, и только потом нажимать кнопку 'подключиться'."},
  {"problem":["Steam client is missing or out of date", "#GameUI_ServerRequireSteam"],"answer": "Один из нижеперечисленных вариантов поможет вам исправить эту проблему:\n
- Войти в аккаунт Steam
- Перезапустить Steam
- Перезагрузить пк
- Выключить режим невидимки в Steam
- Запустить DOTA Classic и Steam от имени администратора"},
  {"problem":["Failed to load the launcher DLL"],"answer": "Для ее исправления необходимо исключить русские/кириллические буквы в пути или же распаковать архив на рабочий стол. Если это вам не помогает, то распакуйте архив с игрой в корень диска C:\\ или D:\\"},
  {"problem":["Не открывается консоль"],"answer": "Чтобы консоль открывалась, нужно в параметрах запуска добавить -console, или запускать игру через .bat файл"},
  {"problem":["failed to create d3d device"],"answer": "Скорее всего у тебя устаревшие или наоборот, слишком свежие драйвера видео устройства. Попробуй установить версию ниже или выше текущей"}
]

Проблема пользователя иногда может звучать по другому, твоя задача найти подходящее решение из предоставленных, либо ответить в формате {"unknown": true}, если в списке нет подходящего решения
`;

export interface AIMessageHistory {
  role: "system" | "assistant" | "user";
  content: string;
}
interface CompletionRequest {
  model: "gpt-4o-mini";
  response_format?: { type: "json_object" };
  messages: AIMessageHistory[];
}

@Injectable()
export class FeedbackAssistantService {
  private api: ApisauceInstance;
  private readonly system: string;
  constructor(private readonly config: ConfigService) {
    this.system = system;
    this.api = create({
      baseURL: "https://api.proxyapi.ru/openai",
      headers: {
        Authorization: `Bearer ${config.get("gpt.token")}`,
      },
    });
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
            content: this.system,
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
