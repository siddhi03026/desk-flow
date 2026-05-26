const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved']
};

const isValidTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return true;
  return ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
};

module.exports = {
  isValidTransition
};
