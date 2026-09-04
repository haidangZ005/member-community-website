const MAX_RECENT_COMMUNITIES = 5;

export function readRecentCommunities(storage, key) {
  try {
    const value = JSON.parse(storage?.getItem(key) || '[]');
    return Array.isArray(value)
      ? value.filter((item) => item?.id && item?.name).slice(0, MAX_RECENT_COMMUNITIES)
      : [];
  } catch {
    return [];
  }
}

export function rememberCommunity(storage, key, community) {
  const recent = [community, ...readRecentCommunities(storage, key).filter((item) => item.id !== community.id)]
    .slice(0, MAX_RECENT_COMMUNITIES);
  try { storage?.setItem(key, JSON.stringify(recent)); } catch { /* Browsing still works when storage is unavailable. */ }
  return recent;
}

export function forgetCommunity(storage, key, communityId) {
  const recent = readRecentCommunities(storage, key).filter((item) => item.id !== communityId);
  try { storage?.setItem(key, JSON.stringify(recent)); } catch { /* Browsing still works when storage is unavailable. */ }
  return recent;
}
