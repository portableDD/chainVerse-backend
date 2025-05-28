const { default: mongoose } = require("mongoose");
const Organization = require("../models/organization");
const SubscriptionPlan = require("../models/SubscriptionPlan");

const subscribeToPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      planId: subscriptionPlanId,
      billingCycle,
      paymentMethod,
    } = req.body;

    if (!name || !subscriptionPlanId || !billingCycle || !paymentMethod) {
      return res.status(400).json({ message: "Invalid input values" });
    }

    const newSubscription = new Organization({
      name,
      description,
      subscriptionPlanId,
      billingCycle,
      paymentMethod,
      lastPaymentDate: new Date(),
    });

    await newSubscription.save();

    res.status(201).json({
      message: "Successfully subscribed to plan",
      data: newSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSubscriptionPlan = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Invalid organization id" });
    }

    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const expirationDuration =
      (organization.billingCycle === "monthly" ? 30 : 365) *
      24 *
      60 *
      60 *
      1000;
    const expirationDate = new Date(
      organization.lastPaymentDate.getTime() + expirationDuration
    );

    const subscriptionPlan = await SubscriptionPlan.findById(
      organization.subscriptionPlanId
    );
    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    res.status(200).json({
      message: "Subscription plan",
      data: {
        organization,
        subscriptionPlan,
        expirationDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateSubscriptionPlan = async (req, res) => {
  try {
    const id = req.params.id;
    const planId = req.params.planId;
    if (!id) {
      return res.status(400).json({ message: "Invalid organization id" });
    }

    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const subscriptionPlan = await SubscriptionPlan.exists({
      _id: mongoose.Types.ObjectId(planId),
    });
    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    organization.subscriptionPlanId = planId;
    organization.lastPaymentDate = new Date();
    await organization.save();

    res.status(200).json({
      message: "Successfully updated subscription plan",
      data: organization,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const cancelSubscriptionPlan = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSubscriptionPlanInvoice = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  subscribeToPlan,
  getSubscriptionPlan,
  updateSubscriptionPlan,
  cancelSubscriptionPlan,
  getSubscriptionPlanInvoice,
};