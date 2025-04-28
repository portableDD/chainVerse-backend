const RemovalRequest = require('./../models/requestRemoval');

//SUBMIT REQUEST
exports.createRequest = async (req, res) => {
  try {
    const { type, reason, confirm } = req.body;

    if (!["Deactivate", "Delete"].includes(type)) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid type. Must be Deactivate or Delete.",
      });
    }

    //double check before permanent delete
    if (type === "Delete" && confirm !== true) {
      return res.status(400).json({
        status: "Failed",
        message: "Permanent deletion requires double confirmation.",
      });
    }

    const request = new RemovalRequest({
      userId: req.user._id,
      type,
      reason,
    });

    await request.save();
    res.status(201).json({
      status: "Success",
      message: "Account removal request submitted.",
      request,
    });
  } catch (error) {
    console.error("Error submitting removal request:", error);
    res.status(500).json({
      status: "Failed",
      message: "Server error.",
    });
  }
};

//VIEW ALL REQUEST (Admin)
exports.getRequests = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const requests = await RemovalRequest.find(filter).populate(
      "userId",
      "email name"
    );
    res.json({ requests });
  } catch (error) {
    console.error("Error retrieving removal requests:", error);
    res.status(500).json({
      status: "Failed",
      message: "Server error.",
    });
  }
};

//PROCESS REQUEST (Admin)
exports.processRequest = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const { requestId } = req.params;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid status.",
      });
    }

    const request = await RemovalRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        status: "Failed",
        message: "Removal request not found.",
      });
    }

    request.status = status;
    request.adminNote = adminNote;
    request.updatedAt = new Date();
    await request.save();

    res.json({ message: `Request ${status.toLowerCase()}.`, request });
  } catch (error) {
    console.error("Error processing removal request:", error);
    res.status(500).json({
      status: "Failed",
      message: "Server error.",
    });
  }
};
