import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosConfig from "../axios/axiosConfig";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const hashedToken = urlParams.get('hashed_token');

    try {
      await axiosConfig.post(`/apis/user/update-password/${hashedToken}`, {
        new_password: newPassword,
      });
      toast.success('Password reset successful');
      navigate('/');
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
        <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="newPassword" className="text-slate-500">
              New Password
            </label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="confirmPassword" className="text-slate-500">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-full"
            disabled={loading}
          >
            {loading ? loader : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;