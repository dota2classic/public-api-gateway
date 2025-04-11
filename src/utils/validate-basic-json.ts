export function validateAgainstGood<T>(good: T, check: T): boolean {
  if (typeof good !== "object") {
    return true;
  }
  if (typeof check !== "object") {
    return false;
  }

  for (let key of Object.keys(good)) {
    if (!(key in check)) {
      return false;
    }
    const newGood = good[key];
    const newCheck = check[key];

    const valid = validateAgainstGood(newGood, newCheck);
    if (!valid) {
      return false;
    }
  }

  return true;
}
