import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  setIsSessionLoaded,
  setLoggedin,
} from "../store/features/common/userSlice";
import axiosConfig from "../axios/axiosConfig";

const useUserUtility = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const isLoggedin = useSelector((state) => state.user.isLoggedin);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // if (Object.keys(userData).length === 0) {
        const res = await axiosConfig.get("/apis/user/me", {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        dispatch(setLoggedin(true));
        dispatch(setIsSessionLoaded(true));
        dispatch(addUser(res.data.user_data));
        // }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          dispatch(setLoggedin(false));
          // todo: navigate to login
        }
      }
    };
    fetchUserDetails();
  }, [dispatch, isLoggedin]);
};

export default useUserUtility;
