export function validateAgainstGood<T>(good: T, check: T): boolean {
  if (typeof good !== "object") {
    return true;
  }

  if (typeof check !== "object") {
    return false;
  }

  if (Array.isArray(good) && Array.isArray(check)) {
    return true;
  }

  for (let key of Object.keys(good)) {
    if (!(key in check)) {
      console.log(`No field ${key} `, good, check);
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
