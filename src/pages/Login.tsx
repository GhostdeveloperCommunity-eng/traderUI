import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompleteUrlV1 } from "../utils";

const LoginPage = () => {
  const [input, setInput] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const validateInput = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;
    return emailRegex.test(value) || mobileRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      if (validateInput(input)) {
        setIsOtpSent(true);
      } else {
        alert("Please enter a valid email or 10-digit mobile number");
      }
    } else {
      if (otp.length === 6) {
        let formattedInput = input;
        if (/^\d{10}$/.test(input)) {
          formattedInput = `+91-${input}`;
        }

        fetch(getCompleteUrlV1("auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formattedInput, otp: Number(otp) }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.token) {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  token: data.token,
                  user: data.user,
                })
              );
              navigate("/master-product-list");
            } else {
              alert("Login Failed");
            }
          });
      } else {
        alert("Please enter a valid 6-digit OTP");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          {!isOtpSent ? (
            <input
              type="text"
              placeholder="Email or Mobile Number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
          ) : (
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };
