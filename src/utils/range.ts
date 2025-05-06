export function range(max: number) {
  return Array.from({ length: max}, (_, ix) => ix)
}
