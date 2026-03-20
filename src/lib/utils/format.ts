export function formatCoins(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function initials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
