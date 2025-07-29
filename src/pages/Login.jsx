import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Forgot Password Flow State
  const [step, setStep] = useState("email"); // email | otp | reset
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (forgotMode) return; // prevent normal login submit in forgot mode

    const valid = validate();
    if (!valid) return;

    try {
      if (isLogin) {
        const res = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
        login(res.data.accessToken, res.data.refreshToken);
        toast.success("Logged in successfully!");
      } else {
        const res = await authApi.register({
          email: formData.email,
          password: formData.password,
        });
        login(res.data.accessToken, res.data.refreshToken);
        toast.success("Registered successfully!");
      }
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (isLogin
          ? "Invalid email or password"
          : "Registration failed. Email might already be registered.");
      setSubmitError(message);
      toast.error(message);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Min 6 characters";

    if (!isLogin) {
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm your password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Forgot Password Flow Handlers
  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      toast.error("Enter valid registered email");
      return;
    }
    try {
      await authApi.sendOtp(resetEmail);
      toast.success("OTP sent to email!");
      setStep("otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }
    try {
      await authApi.verifyOtp({ email: resetEmail, otp });
      toast.success("OTP verified!");
      setStep("reset");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await authApi.resetPassword({ email: resetEmail, newPassword, otp });
      toast.success("Password reset successfully!");
      setForgotMode(false);
      setStep("email");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {forgotMode ? "Forgot Password" : isLogin ? "Login" : "Register"}
        </h2>

        {submitError && !forgotMode && (
          <p className="text-red-500 text-center mb-2">{submitError}</p>
        )}

        {forgotMode ? (
          <>
            {step === "email" && (
              <>
                <label>Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-4"
                />
                <button
                  onClick={handleForgotEmailSubmit}
                  className="bg-blue-600 text-white w-full py-2 rounded"
                >
                  Send OTP
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-4"
                />
                <button
                  onClick={handleOtpVerify}
                  className="bg-blue-600 text-white w-full py-2 rounded"
                >
                  Verify OTP
                </button>
              </>
            )}

            {step === "reset" && (
              <>
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-4"
                />
                <button
                  onClick={handlePasswordReset}
                  className="bg-blue-600 text-white w-full py-2 rounded"
                >
                  Reset Password
                </button>
              </>
            )}

            <p className="text-center mt-4 text-sm">
              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setStep("email");
                }}
                className="text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            </p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
              {isLogin ? "Login" : "Register"}
            </button>

            {isLogin && (
              <p
                className="text-sm mt-2 text-blue-600 cursor-pointer text-center hover:underline"
                onClick={() => setForgotMode(true)}
              >
                Forgot Password?
              </p>
            )}

            <p className="text-center mt-4 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
