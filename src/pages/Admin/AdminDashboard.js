import React, { useState, useEffect } from "react";
import Layout from "../../components/User/Layout";
import { RxChevronRight } from "react-icons/rx";
import { VictoryChart, VictoryLine, VictoryPie, VictoryTheme } from "victory";
import { format } from "date-fns";
import axiosConfig from "../../axios/axiosConfig";
const AdminDashboard = () => {
  const [allProject, setAllProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [allGoals, setAllGoals] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [reviewData, setReviewData] = useState([]);

  const projectSizeMap = {
    1: "Small",
    2: "Medium",
    3: "Large",
    4: "Existential",
  };
  const sizeCount = {
    Small: 0,
    Medium: 0,
    Large: 0,
    Existential: 0,
  };
  const reviewTypeMap = {
    endproj_manager: ["End Project", "green", "endproj_manager"],
    endproj: ["End Project", "green", "endproj"],
    midproj_manager: ["Mid Project", "yellow", "midproj_manager"],
    midproj: ["Mid Project", "yellow", "midproj"],
    ongoing_manager: ["Ongoing Project", "orange", "ongoing_manager"],
    ongoing: ["Ongoing Project", "orange", "ongoing"],
  };
  const colorMap = {
    Small: "#56E776",
    Medium: "#2AB2FF",
    Large: "#F4EE4D",
    Existential: "#F88B3D",
  };
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

  async function fetchAllGoal() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/goals");
      console.log("goals", res);
      setAllGoals(
        res.data.data.map((item) => {
          return {
            date: format(new Date(item.created_at), "dd-MM-yy"),
            name: item.name,
            description: item.description,
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
      const res = await axiosConfig.get("/apis/reviews/admin");
      console.log(res.data);
      setReviewData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function fetchAllUsers() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/user/fetchUsers");
      console.log("users", res);
      const users = res.data.data;
      setAllUsers(users);
        
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
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
    fetchAllProject();
    fetchAllGoal();
    fetchAllReviews();
    fetchAllUsers();
  }, []);

  return (
    <Layout>
      <h1 className="text-xl font-semibold  mb-8 text-slate-800">
        Admin Dashboard{" "}
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
                {/* Projects */}
                <div className="border border-slate-300 p-2 rounded-md flex items-stretch gap-3">
                  <img
                    src="/assets/img/dp.png"
                    className="rounded-full object-cover w-10 h-10"
                    alt="Person1"
                  />
                  <div className="w-full">
                    <h1 className="text-lg font-medium text-slate-700 2xlM:text-[1.2vw]">
                      Alfreda Cannon
                    </h1>
                    <p className="text-sm text-slate-600 mb-1  2xlM:text-[.9vw]">
                      Backend Developer
                    </p>
                    <span className="text-slate-600 text-xs float-end">
                      Score: 8.5
                    </span>
                  </div>
                </div>
                <div className="border border-slate-300 p-2 rounded-md flex items-stretch gap-3">
                  <img
                    src="/assets/img/dp.png"
                    className="rounded-full object-cover w-10 h-10"
                    alt="Person1"
                  />
                  <div className="w-full">
                    <h1 className="text-lg font-medium text-slate-700 2xlM:text-[1.2vw]">
                      Alfreda Cannon
                    </h1>
                    <p className="text-sm text-slate-600 mb-1  2xlM:text-[.9vw]">
                      Backend Developer
                    </p>
                    <span className="text-slate-600 text-xs float-end">
                      Score: 8.5
                    </span>
                  </div>
                </div>
                <div className="border border-slate-300 p-2 rounded-md flex items-stretch gap-3">
                  <img
                    src="/assets/img/dp.png"
                    className="rounded-full object-cover w-10 h-10"
                    alt="Person1"
                  />
                  <div className="w-full">
                    <h1 className="text-lg font-medium text-slate-700 2xlM:text-[1.2vw]">
                      Alfreda Cannon
                    </h1>
                    <p className="text-sm text-slate-600 mb-1  2xlM:text-[.9vw]">
                      Backend Developer
                    </p>
                    <span className="text-slate-600 text-xs float-end">
                      Score: 8.5
                    </span>
                  </div>
                </div>
                <div className="border border-slate-300 p-2 rounded-md flex items-stretch gap-3">
                  <img
                    src="/assets/img/dp.png"
                    className="rounded-full object-cover w-10 h-10"
                    alt="Person1"
                  />
                  <div className="w-full">
                    <h1 className="text-lg font-medium text-slate-700 2xlM:text-[1.2vw]">
                      Alfreda Cannon
                    </h1>
                    <p className="text-sm text-slate-600 mb-1  2xlM:text-[.9vw]">
                      Backend Developer
                    </p>
                    <span className="text-slate-600 text-xs float-end">
                      Score: 8.5
                    </span>
                  </div>
                </div>
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

        <div className="grid grid-cols-5 gap-5 max-h-fit overflow-hidden">
          <div className="bg-white shadow-md rounded-lg  col-span-2 p-7">
            <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
              Goals{" "}
              <span className="cursor-pointer">
                <RxChevronRight />
              </span>
            </p>
            <div className="flex flex-col gap-4 col-span-3 overflow-y-scroll no-scrollbar">
              {/* Goals */}
              {
                allGoals.map(goal=>(
                <div className="border border-slate-300 p-3 rounded-md flex items-stretch gap-3">
                  <div className="w-full">
                    <h1 className="text-lg font-medium text-slate-700 2xlM:text-[1.2vw]">
                      {goal.name}
                    </h1>
                    <span className="text-slate-600 text-xs float-end">
                      {goal.date}
                    </span>
                  </div>
                </div>
                ))
              }
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg  col-span-3 p-7">
            <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
              Pay{" "}
              <span className="cursor-pointer">
                <RxChevronRight />
              </span>
            </p>
            <VictoryChart>
              <VictoryLine
                style={{ data: { stroke: "#F88B3D" } }}
                data={[
                  { x: 1, y: 4 },
                  { x: 2, y: 3 },
                  { x: 3, y: 5 },
                  { x: 4, y: 4 },
                  { x: 5, y: 6 },
                ]}
              />
              <VictoryLine
                style={{ data: { stroke: "#2AB2FF" } }}
                data={[
                  { x: 1, y: 3 },
                  { x: 2, y: 4 },
                  { x: 3, y: 6 },
                  { x: 4, y: 5 },
                  { x: 5, y: 4 },
                ]}
              />
            </VictoryChart>
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
              {/* <div className="col-span-2">
                <VictoryPie
                  width={100}
                  height={100}
                  radius={28}
                  innerRadius={40}
                  labelComponent={<span></span>}
                  style={{
                    data: { stroke: "#FFFFFF", strokeWidth: 2 },
                  }}
                  colorScale={["#F88B3D", "#2AB2FF"]}
                  data={[
                    {
                      y: 10,
                    },
                    {
                      y: 90,
                    },
                  ]}
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
              </div> */}
              <div className="flex flex-col gap-4 col-span-5 overflow-y-scroll h-[20rem] no-scrollbar">
                {/* Reviews */}
                { reviewData.map(review=>(
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
                      {format(new Date(review.created_at), "dd-MM-yy")}
                    </span>
                  </div>
                </div>
                ))
               
               }
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg h-fit  col-span-1 p-7">
            <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
              Employees{" "}
              <span className="cursor-pointer">
                <RxChevronRight />
              </span>
            </p>

            <div className="space-y-4">
              <div className="flex gap-5 border rounded-md p-2">
                <img
                  width="96"
                  height="96"
                  className="w-12 h-12"
                  src="https://img.icons8.com/windows/475569/96/collaborator-male.png"
                  alt="collaborator-male"
                />
                <div className="text-slate-600">
                  <h1 className="text-xl">{allUsers.filter(user=>user.role=="Employee").length}</h1>
                  <p className="text-sm">Employees</p>
                </div>
              </div>
              <div className="flex gap-5 border rounded-md p-2">
                <img
                  width="96"
                  height="96"
                  className="w-12 h-12"
                  src="https://img.icons8.com/windows/475569/96/manager.png"
                  alt="collaborator-male"
                />
                <div className="text-slate-600">
                <h1 className="text-xl">{allUsers.filter(user=>user.role=="Manager").length}</h1>
                  <p className="text-sm">Managers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
