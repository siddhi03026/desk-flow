const SLA_TARGETS = {
  urgent: 1 * 60 * 60 * 1000, // 1 hour in ms
  high: 4 * 60 * 60 * 1000,   // 4 hours in ms
  medium: 24 * 60 * 60 * 1000, // 24 hours in ms
  low: 72 * 60 * 60 * 1000    // 72 hours in ms
};

const calculateSlaStatus = (ticket) => {
  const now = new Date();
  const createdAt = new Date(ticket.createdAt);
  
  let ageMinutes = 0;
  let slaBreached = false;

  const slaTargetMs = SLA_TARGETS[ticket.priority] || SLA_TARGETS.low;

  if (ticket.status === 'resolved' || ticket.status === 'closed') {
    const resolvedAt = ticket.resolvedAt ? new Date(ticket.resolvedAt) : now;
    const timeToResolveMs = resolvedAt.getTime() - createdAt.getTime();
    ageMinutes = Math.floor(timeToResolveMs / (1000 * 60));
    slaBreached = timeToResolveMs > slaTargetMs;
  } else {
    const ageMs = now.getTime() - createdAt.getTime();
    ageMinutes = Math.floor(ageMs / (1000 * 60));
    slaBreached = ageMs > slaTargetMs;
  }

  return {
    ...ticket.toObject(),
    ageMinutes,
    slaBreached
  };
};

module.exports = {
  calculateSlaStatus,
  SLA_TARGETS
};
