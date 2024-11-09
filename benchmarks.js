import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '10s',
};
export default function () {
  http.get(`https://dotaclassic.ru/api/v1/match/${Math.round(Math.random() * 25000)}`);
  sleep(1);
}
