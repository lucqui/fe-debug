import React, { useEffect, useState } from "react";
import { RiAppleLine, RiGoogleLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  setLoggedin,
  addUser,
  setIsSessionLoaded,
} from "../store/features/common/userSlice";
import toast from "react-hot-toast";
import ForgotPassword from "./ForgotPassword";
import axiosConfig from "../axios/axiosConfig";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const loader = (
    <div className="w-[1.5rem] h-[1.5rem] mx-auto rounded-full border-2 border-transparent border-r-white border-t-white animate-spin"></div>
  );
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }
  function checkFields() {
    return Object.values(data).every((item) => item.length > 0);
  }
  async function login() {
    if (checkFields()) {
      console.log(data);
      try {
        setLoading(true);
        console.log("axios url:", axiosConfig.baseURL);
        const promise = axiosConfig.post("/apis/user/login", data);
        const res = await promise;
        console.log("Login response:", res);
        toast.promise(promise, {
          loading: "Logging in",
          success: "Logged in Successfully",
          error: false,
        });
        if (res.status === 200) {
          const token = res.data.Token;
          console.log("Received token:", token);
          document.cookie = `token=${token}; path=/`; // Save token as a cookie
          dispatch(setLoggedin(true));
          const userRes = await axiosConfig.get("/apis/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          });
          console.log("User response:", userRes);
          let user = { ...userRes.data.user_data, token };
          console.log("saving user in redux", user);
          dispatch(addUser(user));
          dispatch(setIsSessionLoaded(true));
          const userRole = userRes.data.user_data.role.toLowerCase();
          navigate(`/${userRole}/dashboard`);
        }
        console.log("user login api response", res);
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.response.data.description);
      } finally {
        setLoading(false);
      }
    } else {
      toast("Email and password required!", {
        icon: "⚠️",
      });
    }
  }
  useEffect(() => {
    if (state) {
      setData({
        email: state.email,
        password: state.password,
      });
    }
  }, []);

  return (
    <div className="p-3 h-screen flex justify-center items-center">
      {!showForgotPassword && (
        <div className="w-[30rem] h-auto bg-white rounded-lg p-6 space-y-14 shadow-lg">
          <h1 className="text-2xl font-semibold text-center">Welcome Back!</h1>
          <div className="flex flex-col gap-y-4 ">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="email" className="text-slate-500">
                Email
              </label>
              <input
                value={data.email}
                onChange={handleInputChange}
                type="email"
                name="email"
                placeholder="e.g. johndoe@gmail.com"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="password" className="text-slate-500">
                Password
              </label>
              <input
                value={data.password}
                onChange={handleInputChange}
                type="password"
                name="password"
                className="focus:outline-none border border-slate-200 rounded-full py-2 px-3"
              />
            </div>
            <span
              className="text-sm text-blue-500 cursor-pointer"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </span>
          </div>
          <button
            className="bg-blue-500 text-white w-full py-2 rounded-full"
            onClick={login}
          >
            {loading ? loader : "Continue"}
          </button>
          <div className="flex flex-col gap-y-5">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link className="text-blue-500" to="/signup">
                {" "}
                Sign up now{" "}
              </Link>
            </div>
          </div>
        </div>
      )}
      {showForgotPassword && (
        <ForgotPassword onCancel={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Login;
