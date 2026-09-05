import { Users } from 'lucide-react';

export default function CommunityAvatar({ avatarUrl, large = false }) {
  return <span className={`community-mark${large ? ' large' : ''}`} aria-hidden="true">
    {avatarUrl ? <img src={avatarUrl} alt="" /> : <Users size={large ? 28 : 18} />}
  </span>;
}
