import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const BillDetails = () => {
  const { name,isVendor, fieldsOfExpertise } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { workDetails } = location.state || {};
  const [serviceCharges, setServiceCharges] = useState(workDetails?.serviceCharges || 0);
  const [isLoading, setIsLoading] = useState(false);
  const taxRate = 0.12;
  const taxAmount = serviceCharges * taxRate;
  const totalAmount = serviceCharges + taxAmount;

  const [showNegotiateBox, setShowNegotiateBox] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState("");
  const handleNegotiateClick = () => {
    setShowNegotiateBox(true);
  };
  const isCustomer = !isVendor;

  const handleSendNegotiation = () => {
    console.log("Negotiated Price:", negotiatedPrice);
    setShowNegotiateBox(false);
  };

  if (!workDetails) {
    return <p>No work details available.</p>;
  }

  const handleGoBack = () => {
    if(isCustomer){
      navigate("/History");
    }
    if(isVendor){
      navigate("/ServiceWorker");
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const orderResponse = await fetch("http://localhost:5000/api/bill/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintId: workDetails._id,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const {
        id: order_id,
        amount,
        currency,
        billId,
      } = await orderResponse.json();

      const options = {
        key: "rzp_test_9pvIQ4B6FWjGWz",
        amount,
        currency,
        order_id,
        name: "Fix Mate",
        description: "Service Payment",
        handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

        try {
          const verifyResponse = await fetch(
            "http://localhost:5000/api/bill/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              }),
            }
          );

          if (!verifyResponse.ok) {
            throw new Error("Payment verification failed");
          }

          const result = await verifyResponse.json();

          if (result.message === "Payment verified successfully") {
            const successResponse = await fetch(
              "http://localhost:5000/api/bill/payment-succes",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  complaintId: workDetails._id,
                  billId: billId,
                }),
              }
            );

            if (successResponse.ok) {
              toast.success("Payment successful!");
              handleGoBack();
            } else {
              toast.error("Failed to mark payment as successful.");
            }
          }
        } catch (error) {
          console.error("Error during payment handling:", error);
          toast.error("An error occurred during payment verification.");
        }
        },
        prefill: {
          name: workDetails.name,
          email: workDetails.email,
          contact: workDetails.phone,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
    } finally {
      setIsLoading(false);
      handleStatusChange(workDetails._id, "paid", id = billId);
    }
  };

  const handleProceed = async () => {
    if (!serviceCharges || serviceCharges <= 0) {
      toast.error("Please enter a valid service charge.");
      return;
    }
    if(isCustomer){
      toast.error("You have to pay after the work is done.")
      return;
    }
    setIsLoading(true);
    const billData = {
      complaintId: workDetails._id,
      serviceCharges,
      taxAmount,
      totalAmount,
      taxRate,
      serviceType: fieldsOfExpertise,
      serviceDescription: workDetails.description,
      vendorName: name,
      customerName: workDetails.name,
      customerPhone: workDetails.phone,
    };

    try {
      const response = await fetch("http://localhost:5000/api/bill/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });

      const data = await response.json();
      toast.success(data.message);
      handleStatusChange(workDetails._id, "reviewed", data.bill._id);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create the bill. Please try again.");
    } finally {
      handleGoBack();
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (workId, newStatus,id="") => {
    try {
      const response = await fetch(`http://localhost:5000/api/work-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          workId, 
          BillId: id,
          status: newStatus,
          vendorName: name,
          serviceType: fieldsOfExpertise,
          serviceCharges,
          taxAmount,
          totalAmount,
          taxRate,
        }),
      });
      if (!response.ok) {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }finally{
      handleGoBack();
    }
  };

  const handleNegotiation = async () => {
    if (!negotiatedPrice || negotiatedPrice <= 0) {
      toast.succes("Please enter a valid negotiated amount.");
      return;
    }

    try {
      const data = await fetch("http://localhost:5000/api/bill/update-negotiated-amount", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintId: workDetails._id,
          negotiatedAmount: parseFloat(negotiatedPrice),
        }),
      });
      const response = await data.json();

      if (response) {
        toast.success("Negotiated bill sent successfully");
        console.log("Updated Bill: ", response);
      }
    } catch (error) {
      console.error("Error updating negotiated amount:", error);
      toast.error("Failed to send negotiated amount");
    } finally {
      handleGoBack();
    }
  };

  console.log("Work Details:", workDetails);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center border-b p-4">
          <h1 className="text-2xl font-bold">Service Bill</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Details Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Customer Details
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-medium">{workDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Phone</p>
                <p className="font-medium">{workDetails.phone}</p>
              </div>
            </div>
          </div>

          {/* Vendor Details Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Vendor Details
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Vendor Name</p>
                <p className="font-medium">
                  {isCustomer ? workDetails.vendorName : name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Domain</p>
                <p className="font-medium">
                  {isVendor ? fieldsOfExpertise : workDetails.fieldType}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Service Details
            </h3>
            <div className="p-4 bg-gray-100 rounded-lg space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Service Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Service Description</p>
                <p className="font-medium">{workDetails.description}</p>
              </div>
            </div>
          </div>

          {/* Charges Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Charges</h3>
            <div className="p-4 bg-gray-100 rounded-lg space-y-2">
              <div className="flex justify-between">
                {isVendor ? (
                  <>
                    <label
                      htmlFor="serviceCharges"
                      className="text-sm text-gray-600"
                    >
                      Service Charges
                    </label>
                    <input
                      type="number"
                      id="serviceCharges"
                      value={serviceCharges}
                      onChange={(e) =>
                        setServiceCharges(Number(e.target.value))
                      }
                      className="w-24 px-2 py-1 border rounded-md text-right appearance-none focus:outline-none"
                      style={{
                        MozAppearance: "textfield",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Service Charges</p>
                    <p className="font-medium">
                      ₹{workDetails.serviceCharges.toFixed(2)}
                    </p>
                  </>
                )}
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Tax (12%)</p>
                <p className="font-medium">
                  ₹
                  {isVendor
                    ? taxAmount.toFixed(2)
                    : workDetails.taxAmount.toFixed(2)}
                </p>
              </div>
              <p className="text-xs">Mode of Payment : Online</p>
              <div className="flex justify-between border-t pt-2">
                <p className="font-semibold">Total Amount (including tax)</p>
                <p className="font-bold text-lg">
                  ₹
                  {isVendor
                    ? totalAmount.toFixed(2)
                    : workDetails.totalAmount.toFixed(2)}
                </p>
              </div>
              {!showNegotiateBox && negotiatedPrice && (
                <div className="flex justify-between border-t pt-2">
                  <p className="font-medium">Negotiated Price:</p>
                  <p className="font-medium text-lg">{negotiatedPrice}</p>
                </div>
              )}
              {isVendor && (
                <div className="flex justify-between border-t pt-2">
                  <p className="font-medium">Negotiated Price:</p>
                  <p className="font-medium text-lg">{workDetails.negotiatedAmount}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Buttons */}
        {negotiatedPrice && !showNegotiateBox ? (
          <div className="flex justify-end space-x-4 p-6 border-t">
            <button
              onClick={() => {
                setNegotiatedPrice("");
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleNegotiation()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              send this bill
            </button>
          </div>
        ) : (
          workDetails.status != "accepted" && (
            <div className="flex justify-end space-x-4 p-6 border-t">
                {isCustomer && (
                  <button
                    onClick={() => {
                      handleStatusChange(workDetails._id, "rejected");
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                )}
                {workDetails?.negotiatedAmount && isVendor &&
                <button
                  onClick={() => {
                    setServiceCharges(workDetails.negotiatedAmount);
                  }}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                  Accept negotiated amount
                </button>
                  
              }
              <button
                onClick={handleGoBack}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              {isCustomer && (
                <button
                  onClick={handleNegotiateClick}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Negotiate
                </button>
              )}
              {isCustomer ? (
                <button
                  onClick={handlePayment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "..." : "Pay now"}
                </button>
              ) : (
                <button
                  onClick={handleProceed}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Bill..." : "Send"}
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* Negotiate Modal */}
      {isCustomer && showNegotiateBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-80">
            <h2 className="text-lg font-semibold">Enter Your Price</h2>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 rounded-lg"
              value={negotiatedPrice}
              onChange={(e) => setNegotiatedPrice(e.target.value)}
              placeholder="Enter negotiated price"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowNegotiateBox(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNegotiation}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
