export function fromNowLabel(iso: string) {
  const date = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - date);

  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) {
    return "только что";
  }
  if (mins < 60) {
    return `${mins}м назад`;
  }

  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours}ч назад`;
  }

  const days = Math.floor(hours / 24);
  return `${days}д назад`;
}
