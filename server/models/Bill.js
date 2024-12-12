const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    serviceDescription: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    serviceCharges: {
      type: Number,
      required: true,
    },
    taxRate: {
      type: Number,
      required: true,
      default: 0.12,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected", "failed"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    negotiatedAmount: {
      type: Number,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
