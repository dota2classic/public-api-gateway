require('dotenv').config();


export const REDIS_URL = () => process.env.REDIS_URL || 'redis://localhost:6379';

export const REDIS_HOST = () => process.env.REDIS_HOST || 'redis'
export const REDIS_PASSWORD = () => process.env.REDIS_PASSWORD || undefined;

export const DISCORD_API_TOKEN = () => process.env.DISCORD_API_TOKEN;

export const DB_USERNAME = () => process.env.POSTGRES_USERNAME;
export const DB_PASSWORD = () => process.env.POSTGRES_PASSWORD;
export const DB_HOST = () => process.env.POSTGRES_HOST;

export const profile = process.env.PROFILE;
export const isProd = profile === 'prod';
export const isDev = !isProd;

export const STEAM_KEY = process.env.STEAM_KEY || "tmp"

export const GAMESERVER_APIURL = process.env.GS_URL || 'localhost:5003';
export const FORUM_APIURL = process.env.FORUM_URL || 'localhost:6009';
export const JWT_SECRET = process.env.PRIVATE_JWT_KEY || 'tmp';

const tmp = parseInt(process.env.LIVE_MATCH_DELAY);
export const LIVE_MATCH_DELAY = Number.isNaN(tmp) ? 60_000 : tmp;
console.log(LIVE_MATCH_DELAY)
export const TOKEN_KEY = 'dota2classic_auth_token';


export const FRONT_URL = process.env.FRONT_URL;
export const BACK_URL = process.env.BACK_URL;
