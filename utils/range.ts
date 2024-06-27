export function rangeOpacity(newOpacity: number) {
  return Math.min(Math.max(Math.round(newOpacity), 0), 100);
}