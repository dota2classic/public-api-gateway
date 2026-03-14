# Refactoring Plan

## Critical ✅

### C1. `__proto__` mutation — centralize and replace ✅
**Files:** `src/event.controller.ts:34`, `src/rmq.controller.ts:187`, `src/gateway/util/construct.ts:8`

`buff.__proto__ = constructor.prototype` is used inline in both controllers to coerce deserialized RMQ messages into class instances. `construct.ts` already exists as a utility but is not used.

- Replace all inline `__proto__` assignments with `Object.setPrototypeOf(data, constructor.prototype)` inside `construct.ts`
- Update both controllers to import and use `construct.ts`

### C2. Unauthenticated `GET /reports` endpoint ✅
**File:** `src/report/report.controller.ts:212-213`

`@WithUser()` and `@ModeratorGuard()` are commented out. Anyone can list all player reports without authentication.

- Restore the guards

---

## High ✅

### H1. Extract `ReportController` business logic to `ReportService` ✅
**File:** `src/report/report.controller.ts:62-139`

`createReport()` is a god method: finds rules, fetches bans, applies punishments, all inline in the controller.

- Move rule lookup, ban checking, punishment logic to `ReportService`
- Controller should call one service method and return the result

### H2. Extract `CustomizationController` to `CustomizationService` ✅
**File:** `src/customization/customization.controller.ts:40-47, 144-180`

Controller injects 2 repositories + `DataSource`, performs full CRUD and transactional cleanup inline.

- Create `CustomizationService` with the transaction logic
- Controller delegates entirely

### H3. Extract `StatsController` DB reads to `StatsService` ✅
**File:** `src/stats/stats.controller.ts:44-48, 53-88`

Controller injects 2 repositories and does all DB reads directly. `StatsService` exists but is barely used.

- Move all repository queries into `StatsService`
- Fix or remove the dead cron (`refreshQueueStats` clears `_stats` but does nothing — see H4)

### H4. Fix dead `StatsService` cron ✅
**File:** `src/stats/stats.service.ts:25-28`

`@Cron(EVERY_5_MINUTES)` fires, sets `_stats = []`, then stops. The actual computation is commented out. `StatsController.getMatchmakingInfo()` always returns `[]`.

- Either restore the implementation or remove the cron and endpoint

### H5. Move raw SQL out of `PlayerController` ✅
**File:** `src/player/player.controller.ts:258-273`

Raw parameterized SQL query and `DataSource` injection live in the controller's `search()` handler.

- Move to `PlayerService` or a dedicated `PlayerRepository`

### H6. Fix `console.log` in `RoleGuard.canActivate()` ✅
**File:** `src/utils/decorator/with-user.ts:63`

Fires on every guarded request in production.

- Remove

### H7. Replace hardcoded admin `steam_id` in `FeedbackService` ✅
**File:** `src/feedback/feedback.service.ts:202`

`"159907143"` is hardcoded as the AI bot author.

- Move to `configuration.ts` and inject via `ConfigService`

### H8. Apply `ReqLoggingInterceptor` globally ✅
**File:** `src/app.module.ts`

17+ controllers are missing `@UseInterceptors(ReqLoggingInterceptor)`. If it feeds Prometheus metrics it should be universal.

- Register as `{ provide: APP_INTERCEPTOR, useClass: ReqLoggingInterceptor }` in `MetricsModule` or `AppModule`
- Remove per-controller `@UseInterceptors(ReqLoggingInterceptor)` decorators

---

## Medium

### M1. Re-enable `@memoize` on `getProfileDecorations`
**File:** `src/service/user-profile.service.ts:66`

The decorator is commented out. Called on every message mapping, leaderboard entry, teammate — now does 2 DB lookups with no caching every time. Likely an accidental regression.

- Restore `@memoize2({ maxAge: 10_000 })`

### M2. Fix `ModeratorGuard` to include JWT verification
**File:** `src/utils/decorator/with-user.ts:84-85`

`ModeratorGuard` uses only `RoleGuard` without wrapping `AuthGuard("jwt")`. If `@WithUser()` is accidentally omitted, an unauthenticated request passes role check if `request.user` is already set from another path.

- Wrap `RoleGuard` with `AuthGuard("jwt")` inside `ModeratorGuard`, same as `AdminGuard`

### M3. Fix `UserRelationService` — separate bootstrap from cron, add map eviction
**File:** `src/service/user-relation.service.ts:39-58`

`onApplicationBootstrap` is also `@Cron(EVERY_MINUTE)` — the same method runs as both lifecycle hook and scheduler. The in-memory `relationMap` has no eviction policy.

- Split into two methods: one for initial load, one for refresh
- Add a max-size or TTL eviction strategy to `relationMap`

### M4. Controller calling another controller method
**File:** `src/match/match.controller.ts:172`

`reportPlayerInMatch()` ends with `return this.matchReportMatrix(user, dto.matchId)` — calling a sibling controller method for response composition.

- Extract shared logic into a service method called by both handlers

### M5. Fix `throw "string"` in `CustomizationController`
**File:** `src/customization/customization.controller.ts:83`

`throw "Bad decoration id for type"` — NestJS exception filters don't catch plain strings, results in unhandled 500.

- Replace with `throw new BadRequestException("Bad decoration id for type")`

### M6. Fix `return 200` in `NotificationController`
**File:** `src/notification/notification.controller.ts:42, 52`

`subscribe()` and `unsubscribe()` return the literal number `200` as body.

- Return `void` (NestJS sends 204) or a proper response DTO

### M7. `getThread()` missing default case
**File:** `src/forum/forum.controller.ts:338`

Falls through all `ThreadType` branches with no `default`, silently returns `undefined` → empty 200.

- Add `throw new BadRequestException(...)` as the default case

### M8. Side-effect emission in GET handler
**File:** `src/player/player.controller.ts:154-165`

`playerSummary()` emits `UserMightExistEvent` on every GET, making it non-idempotent.

- Move the event emission to a service or interceptor

---

## Low

### L1. Remove direct repository injection from `ForumController` and `AdminFeedbackController`
**Files:** `src/forum/forum.controller.ts:80-82`, `src/feedback/admin-feedback.controller.ts:40-47`

Controllers query repositories directly instead of going through their respective services.

### L2. Standardize pagination with `makePage`
**Files:** `src/player/player.controller.ts:110-118, 130-138`, `src/forum/forum.controller.ts:248-253`, `src/admin/admin-user.controller.ts:118-129`

All manually build `{ data, page, perPage, pages }`. The `makePage` helper in `src/gateway/util/make-page.ts` exists but is used inconsistently.

- Replace all manual pagination assembly with `makePage`

### L3. Remove dead stub endpoint
**File:** `src/player/player.controller.ts:85-88`

`GET /connections` returns `{}` with no implementation.

- Remove or implement

### L4. Remove all `console.log/error` from production code
Replace with NestJS `Logger` or remove entirely:
- `src/forum/forum.controller.ts:492-497` (debug strings "HEy", "eee", "GGG")
- `src/feedback/feedback.service.ts:199`
- `src/payments/payanyway-payment-adapter.ts:69-70`
- `src/event-handler/srcds-performance.handler.ts:268-269`
- `src/socket/event-handler/party-invite-expired.handler.ts:14`
- `src/lobby/lobby.service.ts:200`

### L5. Remove dead commented-out code
- `src/feedback/feedback.service.ts:74-77` — commented-out bootstrap test
- `src/feedback/feedback.service.ts:183-188` — commented-out `ebus.publish`
- `src/stats/stats.service.ts:26-27` — commented-out cron body (see H4)
- `src/player/player.controller.ts:69-70` — commented-out cache interceptor

### L6. Add error handling to RMQ message handlers
**File:** `src/rmq.controller.ts`

No `@RabbitSubscribe` handler has try/catch. DB errors propagate uncontrolled. At minimum, log failures per handler.
