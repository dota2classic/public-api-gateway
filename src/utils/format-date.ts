const format = new Intl.DateTimeFormat("ru-RU", {});

export function fullDate(d: Date): string {
  const timeString = d.toTimeString().split(":").slice(0, 2).join(":");
  return format.format(d) + ", " + timeString;
}
