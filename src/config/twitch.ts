export function isTwitchEnabled(env = process.env) {
  return env.TWITCH_ENABLED !== "false" && Boolean(env.TWITCH_CLIENT_ID && env.TWITCH_SECRET);
}
