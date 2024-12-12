const express = require("express");
const Bill = require("../models/Bill");
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Complaint = require("../models/Complaint");
const KEY = "rzp_test_9pvIQ4B6FWjGWz";
const SECRET = "3V9LWX8WFJRlRF52FM7cofTq";

router.post("/create", async (req, res) => {
  const {
    complaintId,
    serviceCharges,
    taxAmount,
    totalAmount,
    taxRate,
    serviceType,
    serviceDescription,
    vendorName,
    customerName,
    customerPhone,
  } = req.body;

  if (!serviceCharges || serviceCharges <= 0) {
    return res.status(400).json({ message: "Invalid service charges" });
  }

  const existingBill = await Bill.findOne({
    taxRate,
    serviceType,
    serviceDescription,
    vendorName,
    customerName,
    customerPhone,
  });

  try {

    if (existingBill) {
      existingBill.serviceCharges = serviceCharges;
      existingBill.taxAmount = taxAmount;
      existingBill.totalAmount = totalAmount;
      existingBill.complaintId = complaintId;

      const updatedBill = await existingBill.save();

      return res.status(200).json({
        message: "Bill updated successfully",
        bill: updatedBill,
      });
    } 
    const newBill = new Bill({
      taxAmount,
      totalAmount,
      serviceCharges,
      taxRate,
      serviceType,
      serviceDescription,
      vendorName,
      customerName,
      customerPhone,
      complaintId,
      status: "pending",
    });

    const savedBill = await newBill.save();
    return res.status(201).json({ message: "Bill created successfully", bill: savedBill });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ message: "Failed to create bill" });
  }
});

router.put("/update-negotiated-amount", async (req, res) => {
  const { complaintId, negotiatedAmount } = req.body;

  if (!complaintId || !negotiatedAmount) {
    return res
      .status(400)
      .json({ message: "Bill ID and Negotiated Amount are required" });
  }
  try {
    const complaint = await Complaint.findOne({ _id: complaintId });
    const bill = await Bill.findOne({ complaintId: complaintId });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    complaint.negotiatedAmount = negotiatedAmount;
    bill.negotiatedAmount = negotiatedAmount;

    await complaint.save();
    await bill.save();

    res.status(200).json({
      message: "Negotiated amount updated successfully",
      bill,
    });
  } catch (error) {
    console.error("Error updating negotiated amount:", error);
    res.status(500).json({ message: "Failed to update negotiated amount" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bills" });
  }
});

const razorpay = new Razorpay({
  key_id: KEY,
  key_secret: SECRET,
});

router.post("/create-payment", async (req, res) => {
  try {
    const { complaintId } = req.body;

    const complaint = await Complaint.findById(complaintId).populate("BillId");
    if (!complaint || !complaint.BillId) {
      return res.status(404).json({ message: "Complaint or Bill not found" });
    }
    const bill = complaint.BillId;
    const options = {
      amount: complaint.totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${bill._id}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      billId: bill._id,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return res
        .status(400)
        .json({ message: "Payment failed or was not completed" });
    }

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

router.post("/payment-succes", async (req, res) => {
  try {
    const { complaintId,billId } = req.body;
    
    const complaint = await Complaint.findById(complaintId);
    const bill = await Bill.findById(billId);

    if (!complaint || !bill) {
      return res.status(404).json({ message: "Complaint or Bill not found" });
    }

    complaint.status = "accepted";
    bill.status = "paid";

    await complaint.save();
    await bill.save();

    res.status(200).json({
      message: "Payment successful",
      complaint,
      bill
    });
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({ message: "Failed to update payment status" });
  }
});


module.exports = router;