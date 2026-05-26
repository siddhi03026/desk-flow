const Ticket = require('../models/Ticket');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { calculateSlaStatus } = require('../utils/slaCalculator');
const { isValidTransition } = require('../utils/transitionRules');

// @desc    Get all tickets
// @route   GET /tickets
// @access  Public
exports.getTickets = asyncHandler(async (req, res, next) => {
  const { status, priority, breached } = req.query;
  
  let query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const tickets = await Ticket.find(query).sort({ createdAt: -1 });
  
  let processedTickets = tickets.map(calculateSlaStatus);

  if (breached === 'true') {
    processedTickets = processedTickets.filter(t => t.slaBreached === true);
  } else if (breached === 'false') {
    processedTickets = processedTickets.filter(t => t.slaBreached === false);
  }

  res.status(200).json({
    success: true,
    count: processedTickets.length,
    data: processedTickets
  });
});

// @desc    Create a ticket
// @route   POST /tickets
// @access  Public
exports.createTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.create(req.body);
  const processedTicket = calculateSlaStatus(ticket);
  
  res.status(201).json({
    success: true,
    data: processedTicket
  });
});

// @desc    Update ticket status
// @route   PATCH /tickets/:id
// @access  Public
exports.updateTicketStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required' });
  }

  let ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ success: false, error: 'Ticket not found' });
  }

  if (!isValidTransition(ticket.status, status)) {
    return res.status(400).json({ 
      success: false, 
      error: `Invalid status transition from ${ticket.status} to ${status}` 
    });
  }

  // Update status and resolvedAt
  ticket.status = status;
  if (status === 'resolved') {
    ticket.resolvedAt = new Date();
  } else if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
    ticket.resolvedAt = null;
  }

  await ticket.save();
  const processedTicket = calculateSlaStatus(ticket);

  res.status(200).json({
    success: true,
    data: processedTicket
  });
});

// @desc    Delete ticket
// @route   DELETE /tickets/:id
// @access  Public
exports.deleteTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ success: false, error: 'Ticket not found' });
  }

  await ticket.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get ticket stats
// @route   GET /tickets/stats
// @access  Public
exports.getStats = asyncHandler(async (req, res, next) => {
  const tickets = await Ticket.find({});
  const processedTickets = tickets.map(calculateSlaStatus);

  const stats = {
    byStatus: {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    },
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    },
    breachedUnresolved: 0
  };

  processedTickets.forEach(ticket => {
    stats.byStatus[ticket.status]++;
    stats.byPriority[ticket.priority]++;
    if (ticket.slaBreached && ticket.status !== 'resolved' && ticket.status !== 'closed') {
      stats.breachedUnresolved++;
    }
  });

  res.status(200).json({
    success: true,
    data: stats
  });
});
