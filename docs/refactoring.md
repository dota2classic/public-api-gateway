# Structural Refactoring Plan

## Summary

The codebase has grown into a classic god-module pattern. `app.module.ts` (603 lines) registers 28 controllers and 140+ providers flat with zero feature encapsulation. The goal is to incrementally extract self-contained feature modules, reduce coupling, and normalize structure.

---

## Priority Queue

### P0 — Critical

| # | Task | Status |
|---|------|--------|
| 1 | Extract feature modules from `app.module.ts` | 🔄 In progress |
| 2 | Split `RmqController` (16 handlers, unrelated domains) | ⬜ |
| 3 | Break up `NotificationService` hub (22+ importers) | ⬜ |

### P1 — High

| # | Task | Status |
|---|------|--------|
| 4 | Relocate orphaned root files (`party.service.ts`, `twitch.*`, `steam.*`, `discord.*`) | ⬜ |
| 5 | Reduce `SocketGateway` constructor (50+ deps) | ⬜ |
| 6 | Split `forum.controller.ts` (558 lines, 26 methods) | ⬜ |
| 7 | Split `lobby.service.ts` (538 lines) | ⬜ |

### P2 — Medium

| # | Task | Status |
|---|------|--------|
| 8 | Consolidate duplicate notification event handlers (8+ identical) | ⬜ |
| 9 | Group entities by domain in `src/entity/` | ⬜ |
| 10 | Standardize feature module structure (21 features, 10+ layouts) | ⬜ |
| 11 | Unify event definitions (currently spread across 4 locations) | ⬜ |

---

## Feature Module Extraction Progress

Target: replace the monolithic `app.module.ts` with feature modules.

### Folder convention

Modules live as **top-level folders under `src/`**, mirroring the `src/metrics/` pattern — not nested under `src/rest/`.

```
src/{feature}/
  {feature}.module.ts
  {feature}.controller.ts
  {feature}.service.ts
  {feature}.mapper.ts
  dto/
  event-handler/
```

Previously extracted modules still under `src/rest/` (blogpost, record, rule, etc.) should be relocated when convenient.

Each module declares its own `TypeOrmModule.forFeature([...])`, exports services that other modules need, and is imported once in `app.module.ts`.

### Module extraction checklist

- [x] `RuleModule` — `RuleController`, `RuleService`, `RuleMapper`, `RuleEntity`, `RulePunishmentEntity`
- [x] `BlogpostModule` — `BlogpostController`, `BlogpostMapper`
- [x] `RecordModule` — `RecordController`, `RecordMapper`, `MatchMapper` (local)
- [x] `UserServicesModule` (@Global) — `UserProfileService`, `StorageMapper`, `CustomizationMapper` (shared; enables all above)
- [ ] `AuthModule` — `AuthController`, `AuthService`, strategies
- [ ] `MetaModule` — `MetaController`, `MetaMapper`
- [ ] `StatsModule` — `StatsController`, `StatsMapper`
- [ ] `StorageModule` — `StorageController`, `StorageMapper`, S3 handlers
- [ ] `ReportModule` — `ReportController`, `ReportService`, `ReportMapper`, handlers
- [ ] `FeedbackModule` — `FeedbackController`, `FeedbackService`, mappers, handlers
- [ ] `NotificationModule` — `NotificationController`, `NotificationService`, handlers
- [ ] `PaymentModule` — payment controllers, service, adapters
- [ ] `TournamentModule` — `TournamentController`, handlers
- [ ] `LobbyModule` — `LobbyController`, `LobbyService`, handlers
- [ ] `PlayerModule` — `PlayerController`, `PlayerMapper`
- [ ] `MatchModule` — `MatchController`, `LiveMatchController`, mappers
- [ ] `AdminModule` — `AdminUserController`, `ServerController`, `AdminMapper`
- [ ] `CustomizationModule` — `CustomizationController`, mapper
- [ ] `ForumModule` — `ForumController`, `ForumMapper`
- [ ] `SocketModule` — `SocketGateway`, delivery, message service, handlers
- [ ] `OAuthModule` (or split) — `SteamController`, `DiscordController`, `TwitchController`, strategies

---

## Key Problem Files

| File | Lines | Problem |
|------|-------|---------|
| `src/app.module.ts` | 603 | God module — 28 controllers, 140+ providers |
| `src/rmq.controller.ts` | 218 | 16 handlers across unrelated domains |
| `src/rest/forum/forum.controller.ts` | 558 | 26 methods, no service layer |
| `src/rest/lobby/lobby.service.ts` | 538 | Single class doing too much |
| `src/socket/socket.gateway.ts` | 288 | 50+ constructor dependencies |
| `src/rest/payments/payment.service.ts` | 296 | Mixes payment logic + notification dispatch |
| `src/rest/notification/notification.service.ts` | 248 | Hub: WebPush + Telegram + Socket + CRUD |

## Hub Services (High Coupling)

- `NotificationService` — imported by 22+ files across unrelated features
- `UserProfileService` — imported by 24+ files

## Orphaned Files (Need a Folder)

| File | Should Move To |
|------|---------------|
| `src/rest/party.service.ts` | `src/rest/party/party.service.ts` |
| `src/rest/twitch.service.ts` | `src/rest/twitch/twitch.service.ts` |
| `src/rest/twitch.controller.ts` | `src/rest/twitch/twitch.controller.ts` |
| `src/rest/steam.controller.ts` | `src/rest/steam/steam.controller.ts` |
| `src/rest/discord.controller.ts` | `src/rest/discord/discord.controller.ts` |
