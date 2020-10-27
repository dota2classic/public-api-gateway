import { isDev } from './env';

export const frontUrl = isDev ? "http://localhost:3000" : "https://dev.dota2classic.ru";
// export const backUrl = ;
export const backUrl = isDev ? "http://localhost:6001" : "https://dev.dota2classic.ru/api";
// export const backUrl = "http://localhost:5002";