import React, { useEffect, useState } from "react";
import { RiAppleLine, RiGoogleLine } from "react-icons/ri";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosConfig from "../axios/axiosConfig";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cnfPassword: "",
    role: "",
    title: "",
    organization_id: "",
  });
  const [hasManagerId, setHasManagerId] = useState(false);

  const loader = (
    <div className="w-[1.5rem] h-[1.5rem] mx-auto rounded-full border-2 border-transparent border-r-white border-t-white animate-spin"></div>
  );
  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  }
  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return re.test(password);
  }

  function checkFields() {
    if (!Object.values(data).every((item) => item.trim().length > 0)) {
      return 0;
    } else if (!validateEmail(data.email)) {
      return 1;
    } else if (data.password !== data.cnfPassword) {
      return 2;
    } else if (!validatePassword(data.password)) {
      return 3;
    }
    return 4;
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }
  async function signup() {
    if (!hasManagerId) {
      delete data.manager_id;
    }
    const check = checkFields();
    if (check === 4) {
      delete data.cnfPassword;
      try {
        setLoading(true);
        const res = await axiosConfig.post("/apis/user/register", data);
        toast.success("User created successfully");
        if (res.status === 200) {
          navigate("/", {
            state: { email: data.email, password: data.password },
          });
        }
      } catch (error) {
        if (error.response.status === 409) {
          toast.error("User already exists");
        } else {
          toast.error("Something went wrong");
        }
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else if (check === 0) {
      toast("Fill up all the details", { icon: "⚠️" });
    } else if (check === 1) {
      toast("Enter a valid email address", { icon: "⚠️" });
    } else if (check === 2) {
      toast("Passwords do not match", { icon: "⚠️" });
    } else if (check === 3) {
      toast(
        "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
        { icon: "⚠️" }
      );
    }
  }
  return (
    <div className="p-3 my-3 flex justify-center items-center">
      <div className="smM:w-[80vw] h-auto bg-white rounded-lg p-6 space-y-14 shadow-lg ">
        <h1 className="text-2xl font-semibold text-center">Register</h1>
        <div className="flex flex-col gap-y-4 ">
          <div className="flex smM:flex-col gap-8  w-full">
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-slate-500">First Name *</label>
              <input
                value={data.first_name}
                onChange={handleInputChange}
                type="text"
                name="first_name"
                placeholder="e.g. John"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label className="text-slate-500">Last Name *</label>
              <input
                value={data.last_name}
                onChange={handleInputChange}
                type="text"
                name="last_name"
                placeholder="e.g. Doe"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="password" className="text-slate-500">
              Email *
            </label>
            <input
              value={data.email}
              onChange={handleInputChange}
              placeholder="e.g. johndoe@gmail.com"
              type="email"
              name="email"
              className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
            />
          </div>
          <div className="flex smM:flex-col gap-8">
            <div className="flex flex-col gap-y-2 relative w-full">
              <label htmlFor="password" className="text-slate-500">
                Password *
              </label>
              <input
                value={data.password}
                placeholder="Password"
                onChange={handleInputChange}
                type={!showPassword ? "password" : "text"}
                name="password"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
              {!showPassword ? (
                <LuEyeOff
                  onClick={() => setShowPassword((prev) => !prev)}
                  size={18}
                  className="absolute bottom-3 right-3 cursor-pointer text-slate-400 bg-white"
                />
              ) : (
                <LuEye
                  onClick={() => setShowPassword((prev) => !prev)}
                  size={18}
                  className="absolute bottom-3 right-3 cursor-pointer text-slate-400 bg-white"
                />
              )}
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label htmlFor="password" className="text-slate-500">
                Confirm Password *
              </label>
              <input
                value={data.cnfPassword}
                placeholder="Confirm Password"
                onChange={handleInputChange}
                type="password"
                name="cnfPassword"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="email" className="text-slate-500">
              Organization ID *
            </label>
            <input
              value={data.organization_id}
              onChange={handleInputChange}
              placeholder="Organization Id"
              type="text"
              name="organization_id"
              className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
            />
          </div>
          <div className="flex smM:flex-col gap-8">
            <div className="flex flex-col gap-y-2 w-full">
              <label htmlFor="email" className="text-slate-500">
                Title *
              </label>
              <input
                value={data.title}
                onChange={handleInputChange}
                type="text"
                name="title"
                placeholder="e.g. Developer"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <label htmlFor="password" className="text-slate-500">
                Role *
              </label>
              <select
                name="role"
                value={data.role}
                onChange={handleInputChange}
                className="focus:outline-none border border-slate-200 rounded-full py-[10px] px-3"
              >
                <option>Select a Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
          </div>
          <div className="gap-x-2 flex mt-3 text-sm">
            <input
              type="checkbox"
              id="isManagerId"
              onChange={(e) => setHasManagerId(e.target.checked)}
            />
            <label htmlFor="isManagerId">Do you have a manager?</label>
          </div>
          {hasManagerId && (
            <div className="flex flex-col gap-y-2">
              <label htmlFor="manager_id" className="text-slate-500">
                Manager ID
              </label>
              <input
                value={data.manager_id}
                onChange={handleInputChange}
                type="text"
                name="manager_id"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
            </div>
          )}
        </div>
        <button
          className="bg-blue-500 text-white w-full py-2 rounded-full"
          onClick={signup}
        >
          {loading ? loader : "Continue"}
        </button>
        <div className="flex flex-col gap-y-5">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link className="text-blue-500" to="/">
              {" "}
              Login now{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
