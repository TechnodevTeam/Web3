'use client';

type SessionStatusBadgeProps = {
  live?: boolean;
  startTime?: string;
  endTime?: string;
};

export function isSessionLive(
  live?: boolean,
  startTime?: string,
  endTime?: string
): boolean {
  if (live === true) return true;

  if (!startTime || !endTime) return false;

  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return false;

  return now >= start && now <= end;
}

function LiveBadge() {
  return (
    <div className="session-status-badge session-status-badge--live" title="En direct">
      <svg viewBox="0 0 48 32" width="36" height="24" aria-hidden="true">
        <circle cx="24" cy="16" r="5" fill="#ef4444" />
        <path
          d="M12 16c0-4 2-7.5 5-9.5M36 16c0-4-2-7.5-5-9.5"
          stroke="#ef4444"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M6 16c0-6.5 4-12 10-14.5M42 16c0-6.5-4-12-10-14.5"
          stroke="#ef4444"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="session-status-badge__label">
        <span>LIVE</span>
        <small>EN DIRECT</small>
      </div>
    </div>
  );
}

function WaitingBadge() {
  return (
    <div className="session-status-badge session-status-badge--waiting" title="En attente">
      <svg viewBox="0 0 48 32" width="36" height="24" aria-hidden="true">
        <circle cx="24" cy="16" r="11" fill="none" stroke="#475569" strokeWidth="2" />
        <path
          d="M24 16 L24 9"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 16 L30 19"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="35" cy="16" r="1.2" fill="#475569" />
        <circle cx="33" cy="22" r="1.2" fill="#475569" />
        <circle cx="27" cy="26" r="1.2" fill="#475569" />
      </svg>
      <div className="session-status-badge__label">
        <span>ATTENTE</span>
        <small>EN COURS</small>
      </div>
    </div>
  );
}

export default function SessionStatusBadge({
  live,
  startTime,
  endTime,
}: SessionStatusBadgeProps) {
  const isLive = isSessionLive(live, startTime, endTime);
  return isLive ? <LiveBadge /> : <WaitingBadge />;
}
