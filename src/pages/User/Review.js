import React, { useEffect, useState } from "react";
import Layout from "../../components/User/Layout";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { LuSearch } from "react-icons/lu";
import ReviewTable from "../../components/User/ReviewsTable";

import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../../axios/axiosConfig";

const Review = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.user.role).toLowerCase();
  const tabs = ["Pending", "Completed"];
  const [activeTab, setActiveTab] = useState(0);
  const [reviewData, setReviewData] = useState([]);
  const [tabData, setTabData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const projectSizeMap = {
    1: "Small",
    2: "Medium",
    3: "Large",
    4: "Existential",
  };
  const reviewTypeMap = {
    endproj_manager: ["End Project", "green", "endproj_manager"],
    endproj: ["End Project", "green", "endproj"],
    midproj_manager: ["Mid Project", "yellow", "midproj_manager"],
    midproj: ["Mid Project", "yellow", "midproj"],
    ongoing_manager: ["Ongoing Project", "orange", "ongoing_manager"],
    ongoing: ["Ongoing Project", "orange", "ongoing"],
  };

  async function fetchAllReviews() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/reviews");
      setReviewData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  function writeResponse(reviewData) {
    if(userRole=="manager"){
      delete reviewData.action;
      navigate(`/${userRole}/review/response`, { state: reviewData });
    }else{
      navigate(`/${userRole}/review/write`);
    }
  }
  function searchFilter(e) {
    if (searchQuery)
      return e.project_name.toLowerCase().includes(searchQuery.toLowerCase());
    else return true;
  }
  useEffect(() => {
    fetchAllReviews();
    if (userRole != "manager") {
      setActiveTab(1);
    }
  }, []);
  useEffect(() => {
    if (Object.values(reviewData).length > 0) {
      if (activeTab == 0) {
        const manipulatedData = reviewData.requested_reviews
          .filter(searchFilter)
          .map((item, index) => ({
            key: (index + 1).toString(),
            date: {
              name: format(new Date(item.created_at), "dd-MM-yy"),
              value: item.created_at,
            },
            project_name: item.project_name,
            project_size: projectSizeMap[item.project_size],
            submitted_by: item.original_review_id,
            review_type: reviewTypeMap[item.schema_id],
            project_description: item.project_description,
            schema_id:item.schema_id,
            employee_name:item.employee_name,
            action: writeResponse,
          }));
        setTabData(manipulatedData);
      } else {
        const manipulatedData = reviewData.completed_reviews
          .filter(searchFilter)
          .map((item, index) => ({
            key: (index + 1).toString(),
            date: {
              name: format(new Date(item.created_at), "dd-MM-yy"),
              value: item.created_at,
            },
            project_name: item.project_name,
            project_size: projectSizeMap[item.project_size],
            submitted_by: item.original_review_id,
            review_type: reviewTypeMap[item.schema_id],
            employee_name:item.employee_name,
            project_description: item.project_description,
            action: null,
          }));
        setTabData(manipulatedData);
      }
    }
  }, [reviewData, activeTab, searchFilter]);

  return (
    <Layout>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Rings height={150} width={150} color="#3b82f6" />
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-semibold  mb-8 text-slate-800">
            Reviews{" "}
          </h1>
          {userRole == "manager" ? (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <div className=" w-fit space-x-3 text-sm pb-[2px]">
                  {tabs.map((e, index) => {
                    return (
                      <span
                        className={`pb-[2px] cursor-pointer px-4 ${
                          activeTab == index
                            ? "border-b-2 border-blue-500 text-blue-500 "
                            : "text-slate-600"
                        }`}
                        onClick={() => setActiveTab(index)}
                      >
                        {e}
                      </span>
                    );
                  })}
                </div>
                <div className="relative flex items-center">
                  <LuSearch className="absolute left-1 text-slate-300" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white pl-5 rounded-full border border-slate-300 text-sm py-[2px] focus:outline-none text-slate-700 w-[10rem]"
                    placeholder="Search"
                    type="text"
                    name="search"
                  />
                </div>
              </div>
              <ReviewTable tabData={tabData} />
            </div>
          ) : (
            <div>
              <div className="space-y-10 ">
                <div className="flex justify-end gap-x-5 ">
                <div className="relative flex items-center float-end">
                  <LuSearch className="absolute left-1 text-slate-300" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white pl-5 rounded-full border border-slate-300 text-sm py-[2px] focus:outline-none text-slate-700 w-[10rem]"
                    placeholder="Search"
                    type="text"
                    name="search"
                  />
                </div>
                <div onClick={writeResponse} className="bg-blue-500 text-sm text-white rounded-md py-1 px-3 cursor-pointer">
                  Create Review
                </div>
                </div>

                <ReviewTable tabData={tabData} />
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Review;
