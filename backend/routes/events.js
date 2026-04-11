const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, adminOnly } = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');

// @route   GET /api/events
// @desc    Get all upcoming events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .populate('createdBy', 'name email');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/all
// @desc    Get all events (admin view)
// @access  Private - Admin only
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'name email');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events/create
// @desc    Create a new event
// @access  Private - Admin only
router.post(
  '/create',
  auth,
  adminOnly,
  [
    body('eventName').notEmpty().withMessage('Event name is required'),
    body('type')
      .isIn(['Technical', 'Cultural', 'Sports', 'Workshop'])
      .withMessage('Invalid event type'),
    body('date')
      .isISO8601()
      .withMessage('Valid date is required')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Event date must be in the future');
        }
        return true;
      }),
    body('location').notEmpty().withMessage('Location is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventName, type, date, location } = req.body;

    try {
      const event = new Event({
        eventName,
        type,
        date,
        location,
        createdBy: req.user.id
      });

      await event.save();
      await event.populate('createdBy', 'name email');
      res.status(201).json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/events/:eventId
// @desc    Delete an event
// @access  Private - Admin only
router.delete('/:eventId', auth, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.eventId);

    // Remove this event from all users' interests
    await User.updateMany(
      { 'interests.eventId': req.params.eventId },
      { $pull: { interests: { eventId: req.params.eventId } } }
    );

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events/interest/:eventId
// @desc    Mark interest in an event (toggle)
// @access  Private - Student
router.post('/interest/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findById(req.user.id);

    const alreadyInterested = user.interests.find(
      (i) => i.eventId.toString() === req.params.eventId
    );

    if (alreadyInterested) {
      // Remove interest (toggle off)
      user.interests = user.interests.filter(
        (i) => i.eventId.toString() !== req.params.eventId
      );
      await user.save();
      return res.json({ message: 'Interest removed', interested: false });
    }

    // Add interest
    user.interests.push({ eventId: req.params.eventId, hasTeam: false });
    await user.save();
    res.json({ message: 'Interest marked', interested: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events/team-status/:eventId
// @desc    Update team status for an event
// @access  Private - Student
router.post('/team-status/:eventId', auth, async (req, res) => {
  try {
    const { hasTeam } = req.body;
    if (typeof hasTeam !== 'boolean') {
      return res.status(400).json({ message: 'hasTeam must be a boolean' });
    }

    const user = await User.findById(req.user.id);

    const interest = user.interests.find(
      (i) => i.eventId.toString() === req.params.eventId
    );

    if (!interest) {
      return res.status(400).json({ message: 'You are not interested in this event' });
    }

    interest.hasTeam = hasTeam;
    await user.save();

    res.json({ message: 'Team status updated', hasTeam });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/teammates/:eventId
// @desc    Get all students interested in an event
// @access  Private
router.get('/teammates/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const users = await User.find({
      'interests.eventId': req.params.eventId,
      role: 'student'
    }).select('name email interests');

    const teammates = users.map((u) => {
      const interest = u.interests.find(
        (i) => i.eventId.toString() === req.params.eventId
      );
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        hasTeam: interest ? interest.hasTeam : false
      };
    });

    res.json(teammates);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/my-interests
// @desc    Get current user's interested event IDs
// @access  Private
router.get('/my-interests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('interests');
    res.json(user.interests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
