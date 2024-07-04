import React, { useEffect, useState } from "react";
import Layout from "../../components/User/Layout";
import { Rings } from "react-loader-spinner";
import ScoreBar from "../../components/Common/ScoreBar";
import { VictoryPie } from "victory";
import { useSelector } from "react-redux";
import axiosConfig from "../../axios/axiosConfig";

const Performance = () => {
  const [performanceData, setPerformanceData] = useState({});
  const [performanceDataManager, setPerformanceDataManager] = useState([]);
  const [projectData, setProjectData] = useState({});
  const [projectDetailPage, setProjectDetailPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const userRole = useSelector((state) => state.user.user.role).toLowerCase();

  const sizeMap={
    1: "Small",
    2: "Medium",
    3: "Large",
    4: "Existential"
  }

  async function fetchPerformance() {
    try {
      setLoading(true);
      const res = await axiosConfig.get(
        userRole === "manager"
          ? "/apis/scoring/summary/reports"
          : "/apis/scoring/summary"
      );
      console.log(res.data.Description);
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

  useEffect(() => {
    fetchPerformance();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Rings height={150} width={150} color="#3b82f6" />
        </div>
      ) : (
        <>
          <h1 className="text-xl font-semibold  mb-8 text-slate-800">
            Performance Dashboard 
          </h1>
          {userRole != "manager" ? (
            //Employee Performance Dashboard
            <div>
              <div className="flex flex-col justify-center items-center my-12">
                <ScoreBar score={performanceData.employee_score} width={60} />
                <p className="text-slate-600">
                  Your Average Score :
                  <span className="text-2xl font-semibold text-slate-600">
                     {performanceData.employee_score} / 10
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-4 w-full h-fit gap-x-4">
                <div
                  onClick={() => setProjectDetailPage(4)}
                  className="rounded-md bg-white border border-slate-200 cursor-pointer"
                >
                  {/* {                console.log(projectData[4][0] )} */}
                  <VictoryPie
                    innerRadius={100}
                    labelComponent={<span></span>}
                    colorScale={["#3b82f6", "#e2e8f0"]}
                    data={[
                      {
                        y:
                          projectData[4] &&
                          projectData[4][0] &&
                          projectData[4][0].average_score
                            ? projectData[4][0].employee_score_impact * 100
                            : 0,
                      },
                      {
                        y:
                          projectData[4] &&
                          projectData[4][0] &&
                          projectData[4][0].average_score
                            ? 100 -
                              projectData[4][0].employee_score_impact * 100
                            : 100,
                      },
                    ]}
                  />
                  <p className="text-center mt-2 font-semibold text-slate-700">
                    Existential Project
                  </p>
                  <p className="text-xs text-slate-500 text-center">
                    {projectData[4] &&
                    projectData[4][0] &&
                    projectData[4][0].employee_score_impact
                      ? projectData[4][0].employee_score_impact * 100
                      : 0}
                    % of your score came from these projects
                  </p>
                </div>
                <div
                  onClick={() => setProjectDetailPage(3)}
                  className="rounded-md bg-white border border-slate-200 cursor-pointer"
                >
                  <VictoryPie
                    innerRadius={100}
                    labelComponent={<span></span>}
                    colorScale={["#3b82f6", "#e2e8f0"]}
                    data={[
                      {
                        y:
                          projectData[3] &&
                          projectData[3][0] &&
                          projectData[3][0].average_score
                            ? projectData[3][0].employee_score_impact * 100
                            : 0,
                      },
                      {
                        y:
                          projectData[3] &&
                          projectData[3][0] &&
                          projectData[3][0].average_score
                            ? 100 -
                              projectData[3][0].employee_score_impact * 100
                            : 100,
                      },
                    ]}
                  />
                  <p className="text-center mt-2 font-semibold text-slate-700">
                    Large Project
                  </p>
                  <p className="text-xs text-slate-500 text-center">
                    {projectData[3] &&
                    projectData[3][0] &&
                    projectData[3][0].employee_score_impact
                      ? projectData[3][0].employee_score_impact * 100
                      : 0}
                    % of your score came from these projects
                  </p>
                </div>
                <div
                  onClick={() => setProjectDetailPage(2)}
                  className="rounded-md bg-white border border-slate-200 cursor-pointer"
                >
                  <VictoryPie
                    innerRadius={100}
                    labelComponent={<span></span>}
                    colorScale={["#3b82f6", "#e2e8f0"]}
                    data={[
                      {
                        y:
                          projectData[2] &&
                          projectData[2][0] &&
                          projectData[2][0].employee_score_impact
                            ? projectData[2][0].employee_score_impact * 100
                            : 0,
                      },
                      {
                        y:
                          projectData[2] &&
                          projectData[2][0] &&
                          projectData[2][0].employee_score_impact
                            ? 100 -
                              projectData[2][0].employee_score_impact * 100
                            : 100,
                      },
                    ]}
                  />
                  <p className="text-center mt-2 font-semibold text-slate-700">
                    Medium Project
                  </p>
                  <p className="text-xs text-slate-500 text-center">
                    {(projectData[2] &&
                    projectData[2][0] &&
                    projectData[2][0].employee_score_impact
                      ? projectData[2][0].employee_score_impact * 100
                      : 0
                    ).toFixed(0)}
                    % of your score came from these projects
                  </p>
                </div>
                <div
                  onClick={() => setProjectDetailPage(1)}
                  className="rounded-md bg-white border border-slate-200 cursor-pointer"
                >
                  <VictoryPie
                    innerRadius={100}
                    labelComponent={<span></span>}
                    colorScale={["#3b82f6", "#e2e8f0"]}
                    data={[
                      {
                        y:
                          projectData[1] &&
                          projectData[1][0] &&
                          projectData[1][0].employee_score_impact
                            ? projectData[1][0].employee_score_impact * 100
                            : 0,
                      },
                      {
                        y:
                          projectData[1] &&
                          projectData[1][0] &&
                          projectData[1][0].employee_score_impact
                            ? 100 -
                              projectData[1][0].employee_score_impact * 100
                            : 100,
                      },
                    ]}
                  />
                  <p className="text-center mt-2 font-semibold text-slate-700">
                    Small Project
                  </p>
                  <p className="text-xs text-slate-500 text-center">
                    {projectData[1] &&
                    projectData[1][0] &&
                    projectData[1][0].employee_score_impact
                      ? projectData[1][0].employee_score_impact * 100
                      : 0}
                    % of your score came from these projects
                  </p>
                </div>
              </div>
              {/* Project Details */}
              <div className="h-fit mt-[8rem] mb-[4rem] p-5 space-y-5 bg-white rounded-md">
                <h1 className="text-xl font-semibold text-slate-800">
                  {projectData[projectDetailPage] &&
                    projectData[projectDetailPage][1]}
                </h1>
                {/* {projectDetailPage} */}
                <div className="space-y-6">
                  {projectData[projectDetailPage] &&
                    projectData[projectDetailPage][0].recent_reviews?.map(
                      (item) => {
                        return (
                          <div
                            key={item.review_id}
                            className="h-full w-full grid grid-cols-3 gap-x-5"
                          >
                            <div className="col-span-1 flex flex-col justify-center items-center  p-1 rounded-md bg-slate-50 border border-slate-200">
                              <p className="text-sm text-slate-700">
                                {item.project_name}
                              </p>
                              <VictoryPie
                                height={200}
                                radius={70}
                                innerRadius={50}
                                labelComponent={<span></span>}
                                colorScale={["#3b82f6", "#e2e8f0"]}
                                data={[
                                  {
                                    y: item.employee_score_impact,
                                  },
                                  {
                                    y: 1 - item.employee_score_impact,
                                  },
                                ]}
                              />
                              <span className="text-xs text-center text-slate-600">
                                {(item.employee_score_impact * 100).toFixed(2)}% of your
                                performance score came from this project
                              </span>
                            </div>
                            <div className="col-span-2 p-2 rounded-md bg-slate-50 border border-slate-200">
                              <ul className="flex flex-col justify-evenly h-full">
                                <li className="flex gap-2 text-sm items-cente text-slate-700">
                                  Overall Performance :
                                  <ScoreBar
                                    score={item.score}
                                    width={40}
                                    height={"1rem"}
                                  />
                                  {item.score} / 10
                                </li>
                                <li className="flex gap-2 text-sm items-cente text-slate-700">
                                  Completed on or ahead of schedule :
                                  <span>
                                    <span className="font-semibold">Yes</span> /
                                    <span>No</span>
                                  </span>
                                </li>
                                <li className="flex gap-1 text-sm items-cente text-slate-700">
                                  How accurate was the project to specs : 1 2 3
                                  4 <span className="font-semibold">5</span>{" "}
                                </li>
                                <li className="flex gap-1 text-sm items-cente text-slate-700">
                                  Were there errors found after the project was
                                  completed : 1 2 3 4{" "}
                                  <span className="font-semibold">5</span>{" "}
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
            </div>
          ) : (
            //Manager's Performance Dashboard
            <div>
              <div className="space-y-5">
                {performanceDataManager.map((employee) => {
                  return (
                    <div key={employee.user_id} className="grid grid-cols-10 bg-white p-3 gap-3 rounded-md">
                      {/* Employee Detail */}
                      <div className=" col-span-2 text-center text-slate-700">
                        <h1>{employee.first_name+' '+employee.last_name}</h1>
                        <span className="text-sm text-slate-500">
                          {employee.title}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="col-span-4 p-2 rounded-md bg-slate-50 border border-slate-200">
                        <ul className="flex flex-col gap-y-4 justify-evenly h-full">
                          <li className="text-sm text-slate-700 grid grid-cols-2 items-center">
                            Overall Performance :
                            <ScoreBar score={employee.employee_score} width={100} height={"1rem"} />
                            {employee.employee_score} / 10
                            {/* {item.score} */}
                          </li>
                          {/* <li className="text-sm items-cente text-slate-700 grid grid-cols-2">
                            Performance Alignment :
                            <ScoreBar score={2} width={100} height={"1rem"} />
                          </li> */}
                          {/* <li className="text-sm items-cente text-slate-700 grid grid-cols-2">
                            Pay :
                            <ScoreBar score={2} width={100} height={"1rem"} />
                          </li>
                          <li className="text-sm items-cente text-slate-700 grid grid-cols-2">
                            Trust :
                            <ScoreBar score={2} width={100} height={"1rem"} />
                          </li>
                          <li className="text-sm items-cente text-slate-700 grid grid-cols-2">
                            Outlook :
                            <ScoreBar score={2} width={100} height={"1rem"} />
                          </li>
                          <li className="text-sm items-cente text-slate-700 grid grid-cols-2">
                            Attrition Likelihood :
                            <ScoreBar score={2} width={100} height={"1rem"} />
                          </li> */}
                        </ul>
                      </div>
                      {/* Last 3 projects */}
                      <div className=" col-span-4 flex flex-wrap justify-evenly items-center">
                        {employee.review_summaries.sort((a,b)=> b.average_score - a.average_score).slice(0,3).map((review)=>{
                         return <div key={review.review_id} className="bg-slate-50 border-slate-200 h-fit w-[7rem] text-center p-1 rounded-md">
                          <VictoryPie
                            height={100}
                            width={100}
                            radius={40}
                            innerRadius={30}
                            labelComponent={<span></span>}
                            colorScale={["#3b82f6", "#e2e8f0"]}
                            data={[
                              {
                                y: review.employee_score_impact * 100,
                              },
                              {
                                y: 100 - (review.employee_score_impact * 100),
                              },
                            ]}
                          />
                          <p className="text-sm text-slate-700">{review.recent_reviews[0].project_name}</p>
                          <span className="text-xs text-slate-500">
                            {sizeMap[review.project_size]}
                          </span>
                        </div>
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Performance;
