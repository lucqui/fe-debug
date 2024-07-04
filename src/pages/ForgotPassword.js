import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosConfig from "../axios/axiosConfig";

const ForgotPassword = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosConfig.post("/apis/user/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      toast.error(error.response.data.Description);
    } finally {
      setLoading(false);
    }
  };

  const loader = (
    <div className="w-[1.5rem] h-[1.5rem] mx-auto rounded-full border-2 border-transparent border-r-white border-t-white animate-spin"></div>
  );

  return (
    <div className="p-3 flex justify-center items-center">
      <div className="w-[30rem] bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="email" className="text-slate-500">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="e.g. johndoe@gmail.com"
              className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-full"
              disabled={loading}
            >
              {loading ? loader : "Submit"}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-600 py-2 px-4 rounded-full"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;