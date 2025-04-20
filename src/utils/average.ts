export function avg(arr: number[]) {
  if (!arr.length) return 0;

  let sum = 0;
  for (let number of arr) {
    sum += number;
  }

  return sum / arr.length;
}
