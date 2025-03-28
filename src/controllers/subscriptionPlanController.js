const SubscriptionPlan = require("../models/SubscriptionPlan");

// Create a subscription plan
exports.createSubscriptionPlan = async (req, res) => {
  try {
    const {
      name,
      monthlyPrice,
      yearlyPrice,
      memberLimit,
      description,
      features,
    } = req.body;

    if (!name || monthlyPrice < 0 || yearlyPrice < 0 || memberLimit < 1) {
      return res.status(400).json({ message: "Invalid input values" });
    }

    const newPlan = new SubscriptionPlan({
      name,
      monthlyPrice,
      yearlyPrice,
      memberLimit,
      description,
      features,
    });

    await newPlan.save();

    res.status(201).json({
      message: "Subscription plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all subscription plans
exports.getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({
      message: "Subscription plans retrieved successfully",
      data: plans,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single plan
exports.getSubscriptionPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }
    res.status(200).json({
      message: "Subscription plan retrieved successfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a subscription plan
exports.updateSubscriptionPlan = async (req, res) => {
  try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }
    res.status(200).json({
      message: "Subscription plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a subscription plan
exports.deleteSubscriptionPlan = async (req, res) => {
  try {
    // Add org check logic later
    const deleted = await SubscriptionPlan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }
    res.status(200).json({
      message: "Subscription plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
