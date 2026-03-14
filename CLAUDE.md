# d2c-api-gateway

NestJS API Gateway for Dota 2 Classic. Handles REST endpoints, RabbitMQ event processing, WebSocket connections, and integrations with S3, Redis, PostgreSQL, Telegram, Steam, Discord, and Twitch.

**Framework:** NestJS + Fastify | **Port:** 6001 | **Global prefix:** `/v1`

---

## Commands

```bash
npm run start:dev       # Dev with watch mode
npm run start:local     # Dev against localhost gameserver
npm run build           # Compile to dist/
npm run start:prod      # Run compiled dist/main.js
npm run test            # Jest unit tests
npm run test:e2e        # E2E tests
npm run lint            # ESLint --fix
npm run migration:run   # Run pending TypeORM migrations
npm run migration:generate -- src/database/migrations/MigrationName  # Generate migration
```

---

## Architecture

```
src/
  api/              # @Global ApiModule — Forum, Matchmaker, Tournament, Trade, GS, PrometheusDriver
  admin/            # AdminModule — ServerController, AdminUserController, AdminMapper
  auth/             # AuthModule — AuthController, Steam/Discord/Twitch OAuth controllers + strategies
  blogpost/         # BlogpostModule
  cache/            # Live match cache event handlers (StopLiveGame, LiveMatchUpdate, MatchFinished, etc.)
  config/           # configuration.ts (env mapping), typeorm.config.ts
  core/             # @Global CoreModule — CqrsModule, JwtModule, RedlockModule, RabbitMQModule, Redis
  customization/    # CustomizationController (still in AppModule)
  database/         # TypeORM migrations
  entity/           # All TypeORM entities (imported via db.config.ts)
  event-handler/    # Misc CQRS handlers (SRCDSPerformanceHandler)
  feedback/         # FeedbackModule — FeedbackService, AiService (exported), FeedbackMapper, event handlers
  forum/            # ForumModule — ForumController, ForumMapper (exported), LiveMatchService (exported)
  gateway/
    events/         # Shared event class definitions
    shared-types/   # Shared enums and types
  itemdrop/         # ItemDropModule — ItemDropController, ItemDropService, ItemDropMapper, ItemDroppedHandler
  lobby/            # LobbyModule — LobbyController, LobbyMapper, lobby event handlers
  match/            # MatchController, LiveMatchController (still in AppModule)
  meta/             # MetaModule — MetaController, MetaMapper
  metrics/          # @Global MetricsModule — Prometheus, ReqLoggingInterceptor
  notification/     # NotificationModule — NotificationService, TelegramNotificationService, command handlers
  payments/         # PaymentsModule — PaymentService, PayanywayPaymentAdapter, controllers
  player/           # PlayerController (still in AppModule)
  record/           # RecordModule
  report/           # ReportModule — ReportController, ReportService, ReportMapper, PlayerRuleBrokenHandler
  rule/             # RuleModule — RuleMapper (exported), RuleService (exported)
  service/          # @Global UserServicesModule — UserProfileService, PlayerBanService, UserRelationService
  socket/           # @Global SocketModule — SocketGateway, SocketDelivery, PartyService (exported), LobbyService (exported), MatchMapper (exported), PlayerMapper (exported)
  stats/            # StatsModule — StatsController, StatsService, StatsMapper, TwitchService (exported)
  storage/          # StorageModule — StorageController, StorageService, StorageMapper, MatchArtifactUploadedHandler
  tournament/       # TournamentModule — TournamentController, TournamentMapper, 3 invitation/ready-check handlers
  utils/            # Auth decorators, pipes, helpers
  app.module.ts     # Root module — wires all feature modules; remaining: MatchController, LiveMatchController, PlayerController, CustomizationController, cache handlers, MainService
  rmq.controller.ts # All @RabbitSubscribe handlers — dispatches via CommandBus
  event.controller.ts # @EventPattern handlers (republish to internal EventBus)
```

---

## Key Patterns

### Adding a RabbitMQ handler

This is the most common task. Four steps:

**1. Event class** (usually already exists in `src/gateway/events/`):
```typescript
export class MyEvent {
  constructor(
    public readonly matchId: number,
    public readonly data: string,
  ) {}
}
```

**2. Handler service** (`src/<feature>/event-handler/my-event.handler.ts`):
```typescript
@Injectable()
export class MyEventHandler {
  private readonly logger = new Logger(MyEventHandler.name);

  constructor(private readonly someService: SomeService) {}

  async handle(event: MyEvent) {
    await this.someService.doSomething(event);
  }
}
```

**3. Subscribe in `rmq.controller.ts`:**
```typescript
@RabbitSubscribe({
  exchange: "app.events",
  routingKey: MyEvent.name,
  queue: `api-queue.${MyEvent.name}`,
})
private async handleMyEvent(msg: MyEvent) {
  await this.myEventHandler.handle(msg);
}
```
Also inject the handler in the `RmqController` constructor.

**4. Register in `app.module.ts` providers array:**
```typescript
MyEventHandler,
```

> To forward an event to the internal CQRS EventBus instead of handling directly, use `this.event(MyEvent, msg)` (the private helper already on RmqController).

---

### CQRS Event Handler (internal events)

Used when events originate internally or are republished from `event.controller.ts`.

```typescript
@EventsHandler(MyEvent)
export class MyEventHandler implements IEventHandler<MyEvent> {
  constructor(private readonly service: SomeService) {}

  async handle(event: MyEvent) {
    await this.service.process(event);
  }
}
```

Register in `app.module.ts` providers. No need to touch `rmq.controller.ts`.

---

### REST controller conventions

```typescript
@UseInterceptors(ReqLoggingInterceptor)
@Controller("feature")
@ApiTags("feature")
export class FeatureController {
  constructor(private readonly service: FeatureService) {}

  @Get(":id")
  @WithUser()                    // Requires JWT auth
  async getOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: CurrentUserDto) {
    return this.service.findOne(id);
  }
}
```

Auth decorators:
- `@WithUser()` — requires JWT (`Authorization: Bearer`)
- `@AdminGuard()` — admin only
- `@ModeratorGuard()` — admin or moderator
- `@CurrentUser()` — parameter decorator, injects `{ steam_id, roles }`

---

### Mapper pattern

```typescript
@Injectable()
export class FeatureMapper {
  public mapFeature = (source: FeatureApiDto): FeatureDto => ({
    id: source.id,
    name: source.name,
  });
}
```

Methods are arrow functions (not class methods) for consistent `this` binding.

---

### LLM integration (FeedbackAssistantService)

- Service: `src/feedback/feedback-assistant.service.ts` (exposed as `AiService`)
- System prompts: `src/feedback/gpt-systems.ts` (add new prompts to the `GptSystemPrompt` object)
- Model: `gpt-4o-mini` via ProxyAPI (`https://api.proxyapi.ru/openai`)
- Always use `response_format: { type: "json_object" }` and return a JSON **object** (not array) — wrap arrays as `{ "results": [...] }`
- Prompts are written in Russian to match user locale

---

### S3 access

Inject with `@InjectS3() private readonly s3: S3` (from `nestjs-s3`).

```typescript
const object = await this.s3.getObject({ Bucket: bucket, Key: key });
const text = await object.Body.transformToString();
```

Log files are parsed with `parseLogFile(text)` from `src/utils/parseLogFile.ts`, which returns `LogMessage[]` with `{ steamId, message, allChat, team }`.

---

### Entities & database

- Entities live in `src/entity/`, imported in `src/db.config.ts` `Entities` array
- `synchronize: false` — always use migrations
- Generate a migration after changing entities: `npm run migration:generate -- src/database/migrations/DescriptiveName`
- Migrations run automatically on startup in production

---

## External services

| Service | Config key | Notes |
|---------|-----------|-------|
| PostgreSQL | `postgres.*` | TypeORM, pool min 4 / max 20 |
| Redis | `redis.host`, `redis.password` | Cache + Redlock + microservice transport |
| RabbitMQ | `rabbitmq.*` | Exchange `app.events` (topic), queue prefix `api-queue.` |
| S3 | `s3.*` | Replays bucket `logs`, uploads bucket configurable |
| OpenAI/ProxyAPI | `gpt.token` | Used by FeedbackAssistantService |
| Telegram | `telegram.*` | TelegramNotificationService |
| Steam/Discord/Twitch | respective keys | OAuth strategies in `src/strategy/`, controllers in `AuthModule` |

All config comes from environment variables mapped in `src/config/configuration.ts`.

---

## Notifications

Use `NotificationService.createNotification(steamId, entityId, entityType, type, ttl?)` to create in-app and Telegram notifications. Entity types and notification types are enums in `src/entity/notification.entity.ts`.
