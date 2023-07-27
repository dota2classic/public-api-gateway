import { BACK_URL, FRONT_URL, isDev } from './env';

export const frontUrl = isDev ? "http://localhost:3000" : FRONT_URL;
// export const backUrl = ;
export const backUrl = isDev ? "http://localhost:6001" : BACK_URL;
// export const backUrl = "http://localhost:5002";
