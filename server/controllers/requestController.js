const ClientRequest = require('../models/ClientRequest');

// @desc    Create new client request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res, next) => {
  try {
    const { clientName, email, subject, description } = req.body;

    if (!clientName || !email || !subject || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const request = await ClientRequest.create({
      user: req.user._id,
      clientName,
      email,
      subject,
      description,
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all client requests with pagination
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await ClientRequest.countDocuments({ user: req.user._id });
    const requests = await ClientRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await ClientRequest.findOne({ _id: id, user: req.user._id });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (status && ['New', 'In Progress', 'Done'].includes(status)) {
      request.status = status;
    }

    const updatedRequest = await request.save();

    res.status(200).json(updatedRequest);
  } catch (error) {
    next(error);
  }
};

// @desc    Get request stats
// @route   GET /api/requests/stats
// @access  Private
const getRequestStats = async (req, res, next) => {
  try {
    const stats = await ClientRequest.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await ClientRequest.countDocuments({ user: req.user._id });

    const formattedStats = {
      total,
      new: 0,
      inProgress: 0,
      done: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'New') formattedStats.new = stat.count;
      if (stat._id === 'In Progress') formattedStats.inProgress = stat.count;
      if (stat._id === 'Done') formattedStats.done = stat.count;
    });

    res.status(200).json(formattedStats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus,
  getRequestStats,
};
