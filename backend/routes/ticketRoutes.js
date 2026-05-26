const express = require('express');
const {
  getTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
  getStats
} = require('../controllers/ticketController');

const router = express.Router();

router.route('/stats').get(getStats);
router.route('/').get(getTickets).post(createTicket);
router.route('/:id').patch(updateTicketStatus).delete(deleteTicket);

module.exports = router;
