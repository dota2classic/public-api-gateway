import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApisauceInstance, create } from "apisauce";
import { CompletionResponse } from "./openai";

const system = `
Ты вежливый онлайн ассистент, который помогает решать проблемы с игрой в классическую Dota 2. Ты отвечаешь пользователям на часто задаваемые вопросы в формате {"answer": "Текст ответа"}. Если ты не можешь ответить на вопрос пользователя исходя из предоставленной тебе информации, используй JSON формат {"unknown": true}
Вот часто возникающие проблемы или вопросы и ответы на них. Используй готовые ответы из предоставленного JSON. Ни в коем случае не предлагай установить новую версию игры в Steam.
[
  {"problem":["Черная карта в игре, не видно игру, графические артефакты"],"answer": "Выполнить команду в консоли 'gl_clear 0'"},
  {"problem":["Ошибка: не найден dota.exe"],"answer": "Нужно в батник через блокнот в начале прописать \"cd C:\\Program Files (x86)\\Dota 6.84\" (заменить путь до клиента со старой дотой)"},
  {"problem":["Кикает при загрузке в игру", "Отключение от сервера. вы были исключены", "отключение от сервера выгнали"],"answer": "Аккаунты Steam для подключения к игре и на сайте должны совпадать. Иногда сервер просто не пустит с первого раза - попробуй присоединиться еще несколько раз. Так же при подключении с Украины может понадобиться VPN - сервера находятся на территории РФ."},
  {"problem":["Не запускается старая дота", "Failed to load launcher.dll", "Setup file 'gameinfo.txt' doesn't exist in subdirectory 'dota2'"],"answer": "Возможные решения: \n
- Заново извлечь игру из архива с помощью бесплатного архиватора 7zip https://www.7-zip.org
- Установить Directx - https://www.microsoft.com/ru-ru/download/details.aspx?id=35
- Установить Microsoft Visual C++ для 32 бит - https://aka.ms/vs/16/release/vc_redist.x86.exe
- Установить Microsoft Visual C++ для 64 бит - https://aka.ms/vs/16/release/vc_redist.x64.exe
- Установить .NET Framework - https://go.microsoft.com/fwlink/?linkid=2088631
"},
  {"problem":["Запускается новая дота"],"answer": "Перед тем, как подключаться к игре, нужно запустить старую доту, и только потом нажимать кнопку 'подключиться'. Подключайтесь с помощью connect в консоль в старом клиенте, добавьте старую доту в библиотеку steam как стороннюю игру"},
  {"problem":["Only one dota 2 client per customer"],"answer": "Закройте клиент новой или старой доты, если уже открыт (убейте процесс через диспетчер задач). Одновременно может быть запущен только один клиент Dota 2."},
  {"problem":["Steam client is missing or out of date", "#GameUI_ServerRequireSteam"],"answer": "Один из нижеперечисленных вариантов поможет Вам исправить эту проблему:\n
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

const validationSystem = `
Ты работаешь как фильтр для пользовательских постов.
Проанализируй текст и определи, содержит ли он запрещённый или нежелательный контент.

Пост может считаться **недопустимым**, если:

* Является спамом или рекламой (включая продвижение товаров, ссылок, услуг);
* Содержит нацистскую, фашистскую или иную экстремистскую тематику;
* Призывает к насилию, вражде, дискриминации;
* Нарушает нормы приличия (в т.ч. чрезмерно оскорбительный язык);
* Содержит фальшивые конкурсы, розыгрыши, накрутку, «легкий заработок» и т.п.

**Формат ответа — строго в JSON:**

\`\`\`json
{
  "invalid": boolean,
  "reason": "Краткое пояснение, почему пост не прошел валидацию. Если всё в порядке, оставь пустую строку."
}
\`\`\`

Примеры:

* Если пост — реклама криптоплатформы, верни:

\`\`\`json
{
  "invalid": true,
  "reason": "Спам/реклама — продвижение криптовалютной платформы"
}
\`\`\`

* Если пост допустим, верни:

\`\`\`json
{
  "invalid": false,
  "reason": ""
}
\`\`\`

Начни с анализа следующего текста:
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

interface ValidationResult {
  invalid: boolean;
  reason: string;
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

  public async getValidationResult(content: string): Promise<ValidationResult> {
    try {
      const request: CompletionRequest = {
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: validationSystem,
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
