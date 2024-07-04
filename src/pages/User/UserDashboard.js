import React from "react";
import Layout from "../../components/User/Layout";
import { VictoryPie } from "victory";
import { RxChevronRight } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import axiosConfig from "../../axios/axiosConfig";
const UserDashboard = () => {
  const userRole = useSelector((state) => state.user.user.role).toLowerCase();
  const [performanceData, setPerformanceData] = useState({});
  const [performanceDataManager, setPerformanceDataManager] = useState([]);
  const [allTopReviews, setAllTopReviews] = useState([]);
  const [allProject, setAllProject] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [projectData, setProjectData] = useState({});
  const [projectDetailPage, setProjectDetailPage] = useState(1);
  const [reviewData, setReviewData] = useState([]);
  const [reviewPieChartData, setReviewPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState([])
  const [reviewCountPie, setReviewCountPie] = useState([])
  const projectSizeMap = {
    1: "Small",
    2: "Medium",
    3: "Large",
    4: "Existential",
  };
  const colorMap = {
    Small: "#56E776",
    Medium: "#2AB2FF",
    Large: "#F4EE4D",
    Existential: "#F88B3D",
  };
  const reviewColorMap = {
    Completed: "#2AB2FF",
    Pending: "#F88B3D",
  };

  const sizeCount = {
    Small: 0,
    Medium: 0,
    Large: 0,
    Existential: 0,
  };

  async function fetchPerformance() {
    try {
      setLoading(true);
      const res = await axiosConfig.get(
        userRole === "manager"
          ? "/apis/scoring/summary/reports"
          : "/apis/scoring/summary"
      );
      console.log(res);
      userRole === "manager"
        ? setPerformanceDataManager(res.data.Description)
        : setPerformanceData(res.data.data);

      setProjectData({
        1: [
          res.data.data.review_summaries.find(
            (item) => item.project_size === 1
          ) || {},
          "Small Project",
        ],
        2: [
          res.data.data.review_summaries.find(
            (item) => item.project_size === 2
          ) || {},
          "Medium Project",
        ],
        3: [
          res.data.data.review_summaries.find(
            (item) => item.project_size === 3
          ) || {},
          "Large Project",
        ],
        4: [
          res.data.data.review_summaries.find(
            (item) => item.project_size === 4
          ) || {},
          "Existential Project",
        ],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function fetchAllProject() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/projects");
      console.log(
        res.data.data.map((item) => {
          return {
            ...item,
            size: projectSizeMap[item.size],
          };
        })
      );
      setAllProject(
        res.data.data.map((item) => {
          return {
            ...item,
            size: projectSizeMap[item.size],
          };
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function fetchAllReviews() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/reviews");
      setReviewData(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function fetchAllReviewCount() {
    try {
      setLoading(true);
      const res = await axiosConfig.get(
        userRole === "manager"
          ? "/apis/reviews/manager-count"
          : "/apis/reviews/employee-count"
      );
      console.log(res)
      setReviewsCount(res.data.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPerformance();
    fetchAllProject();
    fetchAllReviews();
    fetchAllReviewCount();
  }, []);

  useEffect(() => {
    let combinedReviews = [];

    performanceData?.review_summaries?.forEach((obj) => {
      combinedReviews.push(...obj.recent_reviews);
    });
    console.log(combinedReviews);
    combinedReviews.sort((a, b) => b.score - a.score);
    setAllTopReviews(combinedReviews.splice(0, 3));
  }, [performanceData]);

  useEffect(() => {
    console.log(performanceDataManager);
  }, [performanceDataManager]);

  useEffect(() => {
    allProject?.forEach((project) => {
      sizeCount[project.size]++;
    });
    const pieData = Object.entries(sizeCount).map(([size, count]) => ({
      x: size,
      y: count,
    }));
    setPieData(pieData);
  }, [allProject]);

  useEffect(() => {
    const completedCount = reviewData?.completed_reviews?.length;
    const pendingCount = reviewData?.requested_reviews?.length;

    const pieData = [
      { x: "Completed", y: completedCount },
      { x: "Pending", y: pendingCount },
    ];
    setReviewPieChartData(pieData);
  }, [reviewData]);
useEffect(() => {
  setReviewCountPie(reviewsCount?.map(review=>review.count))
}, [reviewsCount])

  return (
    <Layout>
      {userRole !== "manager" ? (
        <>
          <h1 className="text-xl font-semibold  mb-8 text-slate-800">
            User Dashboard{" "}
          </h1>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5 max-h-fit overflow-hidden">
              <div className="bg-white shadow-md rounded-lg  p-7">
                <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
                  Performance{" "}
                  <span className="cursor-pointer">
                    <RxChevronRight />
                  </span>
                </p>
                <div className=" items-start grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative flex items-center justify-center">
                      <VictoryPie
                        width={100}
                        height={100}
                        radius={28}
                        innerRadius={40}
                        labelComponent={<span></span>}
                        style={{
                          data: { stroke: "#FFFFFF", strokeWidth: 2 },
                        }}
                        colorScale={["#56E776", "#F88B3D", "#F4EE4D"]}
                        data={reviewCountPie}
                      />
                      <p className="text-3xl font-semibold text-slate-600 absolute">
                        {performanceData.employee_score}
                        <span className="text-base">/10</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                        <span className="bg-[#56E776] rounded-full w-3 h-3"></span>
                        <p>End Project</p>
                      </div>
                      <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                        <span className="bg-[#F4EE4D] rounded-full w-3 h-3"></span>
                        <p>Mid Project</p>
                      </div>
                      <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                        <span className="bg-[#F88B3D] rounded-full w-3 h-3"></span>
                        <p>Ongoing Project</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 overflow-y-scroll h-[20rem] no-scrollbar">
                    {/* Projects */}
                    {allTopReviews.map((reviews) => (
                      <div className="border space-y-3 p-4 rounded-md">
                        {console.log(allTopReviews)}
                        <h1 className="text-lg font-medium text-slate-700">
                          {reviews.project_name}
                        </h1>
                        <p className="text-sm text-slate-600">
                          {reviews.project_description}
                        </p>
                        <span className="text-slate-600 text-xs float-end">
                          Score: {reviews.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg  p-7">
                <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
                  Projects{" "}
                  <span className="cursor-pointer">
                    <RxChevronRight />
                  </span>
                </p>
                {loading ? (
                  <div></div>
                ) : (
                  <div className=" items-start grid grid-cols-2 gap-4">
                    <div>
                      <VictoryPie
                        width={100}
                        height={100}
                        radius={28}
                        innerRadius={40}
                        labelComponent={<span></span>}
                        style={{
                          data: { stroke: "#FFFFFF", strokeWidth: 2 },
                        }}
                        colorScale={Object.values(colorMap)}
                        data={pieData}
                      />

                      <div className="flex flex-wrap gap-2">
                        <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                          <span className="bg-[#56E776] rounded-full w-3 h-3"></span>
                          <p>Small</p>
                        </div>
                        <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                          <span className="bg-[#2AB2FF] rounded-full w-3 h-3"></span>
                          <p>Medium</p>
                        </div>
                        <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                          <span className="bg-[#F4EE4D] rounded-full w-3 h-3"></span>
                          <p>Large</p>
                        </div>
                        <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                          <span className="bg-[#F88B3D] rounded-full w-3 h-3"></span>
                          <p>Existential</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-scroll h-[20rem] no-scrollbar">
                      {/* Projects */}
                      {allProject?.map((project) => (
                        <div
                          className={`bg-[${
                            colorMap[project?.size]
                          }] bg-opacity-40 space-y-3 p-4 rounded-md`}
                        >
                          <h1 className="text-lg font-medium text-slate-700">
                            {project?.name}
                          </h1>
                          <p className="text-sm text-slate-600">
                            {project?.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        // MANAGER
        <>
          <h1 className="text-xl font-semibold  mb-8 text-slate-800">
            Manager Dashboard{" "}
          </h1>
          <div className="flex flex-col gap-5 mb-5">
            <div className="grid grid-cols-2 gap-5 max-h-fit overflow-hidden">
              <div className="bg-white shadow-md rounded-lg  p-7">
                <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
                  Top Employees{" "}
                  <span className="cursor-pointer">
                    <RxChevronRight />
                  </span>
                </p>
                <div className=" items-start grid grid-cols-2 gap-4">
                  <div>
                    <VictoryPie
                      width={100}
                      height={100}
                      radius={28}
                      innerRadius={40}
                      labelComponent={<span></span>}
                      style={{
                        data: { stroke: "#FFFFFF", strokeWidth: 2 },
                      }}
                      colorScale={["#56E776", "#F88B3D", "#F4EE4D"]}
                      data={[
                        {
                          y: 20,
                        },
                        {
                          y: 40,
                        },
                        {
                          y: 40,
                        },
                      ]}
                    />

                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                        <span className="bg-[#56E776] rounded-full w-3 h-3"></span>
                        <p>End Project</p>
                      </div>
                      <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                        <span className="bg-[#F4EE4D] rounded-full w-3 h-3"></span>
                        <p>Mid Project</p>
                      </div>
                      <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                        <span className="bg-[#F88B3D] rounded-full w-3 h-3"></span>
                        <p>Ongoing Project</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 overflow-y-scroll h-[20rem] no-scrollbar">
                    {performanceDataManager
                      .sort((a, b) => b.employee_score - a.employee_score)
                      .slice(0, 4)
                      .map((data) => {
                        return (
                          <div className="border border-slate-300 p-2 rounded-md flex items-stretch gap-3">
                            <img
                              src="/assets/img/dp.png"
                              className="rounded-full object-cover w-10 h-10"
                              alt="Person1"
                            />
                            <div className="w-full">
                              <h1 className="text-lg font-medium text-slate-700 2xlM:text-[1.2vw]">
                                {data.first_name + " " + data.last_name}
                              </h1>
                              <p className="text-sm text-slate-600 mb-1  2xlM:text-[.9vw]">
                                {data.title}
                              </p>
                              <span className="text-slate-600 text-xs float-end">
                                Score: {data.employee_score}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg  p-7">
                <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
                  Projects{" "}
                  <span className="cursor-pointer">
                    <RxChevronRight />
                  </span>
                </p>
                {loading ? (
                  <div></div>
                ) : (
                  <div className=" items-start grid grid-cols-2 gap-4">
                    <div>
                      <VictoryPie
                        width={100}
                        height={100}
                        radius={28}
                        innerRadius={40}
                        labelComponent={<span></span>}
                        style={{
                          data: { stroke: "#FFFFFF", strokeWidth: 2 },
                        }}
                        colorScale={Object.values(colorMap)}
                        data={pieData}
                      />

                      <div className="flex flex-wrap gap-2">
                        <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                          <span className="bg-[#56E776] rounded-full w-3 h-3"></span>
                          <p>Small</p>
                        </div>
                        <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                          <span className="bg-[#2AB2FF] rounded-full w-3 h-3"></span>
                          <p>Medium</p>
                        </div>
                        <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                          <span className="bg-[#F4EE4D] rounded-full w-3 h-3"></span>
                          <p>Large</p>
                        </div>
                        <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                          <span className="bg-[#F88B3D] rounded-full w-3 h-3"></span>
                          <p>Existential</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-scroll h-[20rem] no-scrollbar">
                      {/* Projects */}
                      {allProject?.map((project) => (
                        <div
                          className={`bg-[${
                            colorMap[project?.size]
                          }] bg-opacity-40 space-y-3 p-4 rounded-md`}
                        >
                          <h1 className="text-lg font-medium text-slate-700">
                            {project?.name}
                          </h1>
                          <p className="text-sm text-slate-600">
                            {project?.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 ma max-h-fit overflow-hidden">
              <div className="bg-white col-span-2 shadow-md rounded-lg  p-7">
                <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
                  Reviews{" "}
                  <span className="cursor-pointer">
                    <RxChevronRight />
                  </span>
                </p>
                <div className=" items-start grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <VictoryPie
                      width={100}
                      height={100}
                      radius={28}
                      innerRadius={40}
                      labelComponent={<span></span>}
                      style={{
                        data: { stroke: "#FFFFFF", strokeWidth: 2 },
                      }}
                      colorScale={Object.values(reviewColorMap)}
                      data={reviewPieChartData}
                    />

                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                        <span className="bg-[#2AB2FF] rounded-full w-3 h-3"></span>
                        <p>Completed</p>
                      </div>
                      <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                        <span className="bg-[#F88B3D] rounded-full w-3 h-3"></span>
                        <p>Pending</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 col-span-3 overflow-y-scroll h-[20rem] no-scrollbar">
                    {/* Pending Reviews */}
                    {console.log(reviewData.requested_reviews)}
                    {reviewData?.requested_reviews?.map((review) => (
                      <div className="border border-slate-300 p-2 rounded-md flex items-stretch gap-3">
                        <img
                          src="/assets/img/dp.png"
                          className="rounded-full object-cover w-10 h-10"
                          alt={review.employee_name}
                        />
                        <div className="w-full">
                          <h1 className="text-lg font-medium text-slate-700 2xlM:text-[1.2vw]">
                            {review.employee_name}
                          </h1>
                          <p className="text-sm text-slate-600 mb-1  2xlM:text-[.9vw]">
                            {review.project_name}
                          </p>
                          <span className="text-slate-600 text-xs float-end">
                            {format(review.created_at, "dd-MM-yy")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default UserDashboard;
