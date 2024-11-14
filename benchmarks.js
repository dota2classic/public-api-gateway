import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};
export default function () {
  http.get(`https://dotaclassic.ru/api/v1/match/all?page=${Math.floor(Math.random() * 100)}`);
  // http.get(`http://localhost:6001/v1/match/all?page=${Math.floor(Math.random() * 100)}`)
  sleep(1);
}
