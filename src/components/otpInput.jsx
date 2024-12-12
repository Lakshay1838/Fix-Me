import React, { useState } from "react";

const OTPInput = () => {
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = () => {
    console.log("Entered OTP:", otp);
    // Add logic to verify OTP here

  };

  return (
    <div>
      <label>Enter OTP:</label>
      <input
        type="text"
        value={otp}
        onChange={handleChange}
        maxLength={6} // Assuming a 6-digit OTP
      />
      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
};

export default OTPInput;
