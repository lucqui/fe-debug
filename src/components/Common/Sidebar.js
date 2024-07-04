import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { GoGraph } from "react-icons/go";
import { IoPeopleOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { GrInProgress } from "react-icons/gr";
import { MdManageAccounts } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { VscFeedback } from "react-icons/vsc";
import { PiProjectorScreenChart } from "react-icons/pi";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const userRole = useSelector((state) => state.user.user.role).toLowerCase();
  const title = useSelector((state) => state.user.user.title).toLowerCase();
  return (
    <div className="bg-slate-800 w-[15rem] h-full fixed top-[4.1rem]">
      <div className=" flex flex-col gap-y-5 px-4 pt-4">
        <Link
          to={`/${userRole}/dashboard`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname == `/${userRole}/dashboard`
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <RxDashboard className="text-xl" />
          Dashboard
        </Link>
        <Link
          to={`/${userRole}/goal`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname == `/${userRole}/goal`
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <TbTargetArrow className="text-xl" />
          Goals
        </Link>

        {["manager","employee","admin"].includes(userRole) && (
          <Link
            to={`/${userRole}/project`}
            className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
              location.pathname == `/${userRole}/project`
                ? "bg-slate-700 text-white"
                : "bg-none text-slate-200"
            }`}
          >
            <PiProjectorScreenChart className="text-xl" />
            Project
          </Link>
        )}
        {userRole == "admin" && (
          <Link
            to={`/${userRole}/user-view`}
            className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
              location.pathname == `/${userRole}/user-view`
                ? "bg-slate-700 text-white"
                : "bg-none text-slate-200"
            }`}
          >
            <LuUsers className="text-xl" />
            Users
          </Link>
        )}
        <Link
          to={`/${userRole}/review`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/review`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          {" "}
          <VscFeedback className="text-2xl" />
          Review
        </Link>
        <Link
          to={`/${userRole}/performance`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/performance`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <GoGraph className="text-xl" />
          Performance
        </Link>

        <Link
          to={`/${userRole}/pay`}
          className={`flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 ${
            location.pathname.includes(`/${userRole}/pay`)
              ? "bg-slate-700 text-white"
              : "bg-none text-slate-200"
          }`}
        >
          <LiaMoneyCheckAltSolid className="text-2xl" />
          Pay
        </Link>

        <Link className="flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 text-slate-200">
          <IoPeopleOutline className="text-xl" />
          Career
        </Link>
        {/* <Link className="flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 text-slate-200">
          <FiUser className="text-xl" />
          Skills
        </Link>
        <Link className="flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 text-slate-200">
          <GrInProgress />
          Improvement
        </Link>
        {userRole === "admin" && (
          <Link className="flex items-center justify-start pl-9 gap-x-2 py-3 text-center rounded-lg hover:bg-slate-700 text-slate-200">
            <MdManageAccounts className="text-xl" />
            Managers
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default Sidebar;
