export function getUserInitials(name?: string, surname?: string, displayName?: string) {
  const first = (name || "").trim();
  const last = (surname || "").trim();

  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  const fallback = (displayName || `${first} ${last}` || "U").trim();
  const parts = fallback.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return fallback.slice(0, 2).toUpperCase() || "U";
}

function hashToInt(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarGradient(seed: string) {
  const gradients = [
    "from-cyan-500/30 via-blue-500/20 to-slate-700/80",
    "from-blue-500/30 via-cyan-500/20 to-slate-700/80",
    "from-sky-500/30 via-indigo-500/20 to-slate-700/80",
    "from-cyan-400/35 via-blue-400/20 to-slate-800/80",
    "from-blue-400/35 via-sky-400/20 to-slate-800/80",
  ];

  return gradients[hashToInt(seed) % gradients.length];
}
