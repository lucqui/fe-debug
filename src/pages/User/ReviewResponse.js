import React, { useEffect, useState } from "react";
import Layout from "../../components/User/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dropdown from "../../components/Common/Dropdown";
import Rating from "../../components/Common/Rating";
import { Rings } from "react-loader-spinner";
import toast from "react-hot-toast";
import axiosConfig from "../../axios/axiosConfig";

const ReviewResponse = () => {
  const title = useSelector((state) => state.user.user.title).toLowerCase();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [allGoals, setAllGoals] = useState([]);
  let project_name,
    project_size,
    date,
    submitted_by,
    review_type,
    schema_id,
    project_description;

  if (state && Object.keys(state).length > 0) {
    ({
      project_name,
      project_size,
      date,
      submitted_by,
      review_type,
      schema_id,
      project_description,
    } = state);
  }
  //End proj
  const [endProj, setEndProj] = useState({
    hadDeadline: false,
    onSchedule: false,
    matchProjectNeedScore: 2,
    clearExpectationsScore: 2,
    errorsScore: 2,
    selfInvolvementScore: 2,
    selfInvolvementNeedScore: 2,
    managerInvolvementNeedScore: 2,
    exceptionalJob: false,
    badJob: false,
    employeeSubstituteScore: 2,
  });
  //Mid Proj
  const [midProj, setMidProj] = useState({
    managerEmployeeWorkHelpfulScore: 2,
    managerExpectationsClearScore: 2,
    selfInvolvementScore: 2,
    exceptionalJob: false,
    badJob: false,
  });
  // Ongoing Proj
  const [ongoingProj, setOngoingProj] = useState({
    performedResponsibilitiesScore: 2,
    clearExpectationsScore: 2,
    errorsScore: 2,
    managerInvolvementScore: 2,
    managerInvolvementNeedScore: 2,
  });

  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    if (schema_id == "endproj_manager") {
      setEndProj({
        ...endProj,
        [name]: value === "yes",
      });
    } else if (schema_id == "midproj_manager") {
      console.log(name, value);
      setMidProj({
        ...midProj,
        [name]: value === "yes",
      });
    }
  };
  const handleRateChange = (field, value) => {
    if (schema_id == "endproj_manager") {
      setEndProj({
        ...endProj,
        [field]: value,
      });
    } else if (schema_id == "midproj_manager") {
      setMidProj({
        ...midProj,
        [field]: value,
      });
    } else {
      setOngoingProj({
        ...ongoingProj,
        [field]: value,
      });
    }
  };
  function reset() {
    setEndProj({
      hadDeadline: false,
      onSchedule: false,
      matchProjectNeedScore: 2,
      clearExpectationsScore: 2,
      errorsScore: 2,
      selfInvolvementScore: 2,
      selfInvolvementNeedScore: 2,
      managerInvolvementNeedScore: 2,
      exceptionalJob: false,
      badJob: false,
      employeeSubstituteScore: 2,
    });
    setMidProj({
      managerExpectationsClearScore: 2,
      selfInvolvementScore: 2,
      managerEmployeeWorkHelpfulScore: 2,
      exceptionalJob: false,
      badJob: false,
    });
  }
  const projectSize = [
    { name: "Small", value: 1 },
    { name: "Medium", value: 2 },
    { name: "Large", value: 3 },
    { name: "Existential", value: 4 },
  ];
  // const [selectedGoal, setSelectedGoal] = useState({});
  // async function fetchAllGoal() {
  //   try {
  //     setLoading(true);
  //     const res = await axiosConfig.get("/apis/goals");
  //     console.log("goals", res);
  //     setAllGoals(
  //       res.data.data.map(({ name, id }, index) => ({ name, value: id }))
  //     );
  //     setSelectedGoal(
  //       res.data.data.map(({ name, id }, index) => ({ name, value: id }))[0]
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  const [selectedProjectSize, setSelectedProjectSize] = useState(
    projectSize[
      projectSize.findIndex(
        (e) => e.name?.toLowerCase() === project_size?.toLowerCase()
      )
    ]
  );
  async function handleSubmit() {
    console.log(midProj);
    let data;
    if (schema_id == "endproj_manager") {
      data = endProj;
    } else if (schema_id == "midproj_manager") {
      data = midProj;
    } else {
      data = ongoingProj;
    }
    try {
      setLoading(true);
      const res = await axiosConfig.post(`/apis/reviews/${submitted_by}`, {
        responses: data,
      });
      if (res.status == 200) {
        const scoreRes = await axiosConfig.post("/apis/scoring/reviews");
        const employeeRes = await axiosConfig.post("/apis/scoring/employee");
        if (scoreRes.status == 200 && employeeRes == 200) {
          toast.success("Review Submitted Successfully");
        }
        navigate("/manager/review");
        reset();
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  // useEffect(() => {
  //   // fetchAllGoal();
  // }, []);
  return (
    <Layout>
      <h1 className="text-xl font-semibold  mb-8 text-slate-800">
        Mark Review
      </h1>

      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Rings height={150} width={150} color="#3b82f6" />
        </div>
      ) : (
        <>
          <div className="space-y-5">
            <div className="flex flex-col gap-y-5 bg-gray-200 bg-opacity-40 p-3 rounded-lg">
              <div className="flex flex-col">
                <label className="text-sm text-slate-500 mb-3">
                  Project Name
                </label>
                <p className="border border-slate-300 text-slate-700 px-2 py-[3px] rounded-md w-fit min-w-[30%] max-w-full">
                  {project_name}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-slate-500 mb-3">
                  Project Description
                </label>
                <p className="border border-slate-300 text-slate-700 px-2 py-[3px] rounded-md w-full">
                  {project_description}
                </p>
              </div>
            </div>
            <hr className="border-[1.5px] border-dashed border-slate-200" />
            {/* <div className="flex flex-col gap-y-5">
              <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                <p className="text-slate-500 text-sm mb-3">
                  What company goal does this project work towards?
                </p>
                <Dropdown
                  data={allGoals}
                  selected={selectedGoal}
                  setSelected={setSelectedGoal}
                  disabled={false}
                  width={"w-1/2"}
                />
              </div>
              <hr className="border-[1.5px] border-dashed border-slate-200" />
              <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                <p className="text-slate-500 text-sm mb-3">
                  How big of a project is this?
                </p>
                <Dropdown
                  data={projectSize}
                  selected={selectedProjectSize}
                  setSelected={setSelectedProjectSize}
                  disabled={false}
                  width={"w-1/2"}
                />
              </div>
            </div> */}
            {schema_id == "endproj_manager" ? (
              <>
                <div className="flex flex-col gap-y-5">
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm mb-3">
                      Did the project have a deadline?
                    </p>
                    <div className="h-[2rem] flex gap-x-5">
                      <input
                        type="radio"
                        id="yes"
                        name="hadDeadline"
                        value="yes"
                        checked={endProj.hadDeadline}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="yes"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          endProj.hadDeadline ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="no"
                        name="hadDeadline"
                        value="no"
                        checked={!endProj.hadDeadline}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="no"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          !endProj.hadDeadline ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        No
                      </label>
                    </div>
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4 ">
                    <p className="text-slate-500 text-sm mb-3">
                      Was the project completed on or ahead of schedule? If not,
                      was is the employee’s fault?
                    </p>
                    <div className="h-[2rem] grid grid-cols-2 gap-x-5">
                      <div className="h-[2rem] flex gap-x-5">
                        <input
                          type="radio"
                          id="yesSchedule"
                          name="onSchedule"
                          value="yes"
                          checked={endProj.onSchedule}
                          onChange={handleRadioChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="yesSchedule"
                          className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                            endProj.onSchedule ? "bg-blue-500 text-white" : ""
                          } hover:bg-blue-500 hover:text-white`}
                        >
                          Yes
                        </label>
                        <input
                          type="radio"
                          id="noSchedule"
                          name="onSchedule"
                          value="no"
                          checked={!endProj.onSchedule}
                          onChange={handleRadioChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="noSchedule"
                          className={`border border-blue-500 text-blue-500 text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                            !endProj.onSchedule ? "bg-blue-500 text-white" : ""
                          } hover:bg-blue-500 hover:text-white`}
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="border-[1.5px] border-dashed border-slate-200" />
                <div className="flex flex-col gap-y-5 ">
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      How closely did the project you completed match the
                      project needed?
                    </p>
                    <Rating
                      value={endProj.matchProjectNeedScore}
                      label={"matchProjectNeedScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />

                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Were expectations for the project clear?
                    </p>
                    <Rating
                      value={endProj.clearExpectationsScore}
                      label={"clearExpectationsScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                </div>
                <hr className="border-[1.5px] border-dashed border-slate-200" />
                <div className="flex flex-col gap-y-5">
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      How error free was the project?
                    </p>
                    <Rating
                      value={endProj.errorsScore}
                      label={"errorsScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col gap-2 bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      How involved were you in the project?
                    </p>
                    <Rating
                      value={endProj.selfInvolvementScore}
                      label={"selfInvolvementScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col gap-2 bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      If the employee completed the project again, how involved
                      would you need to be?
                    </p>
                    <Rating
                      value={endProj.selfInvolvementNeedScore}
                      label={"selfInvolvementNeedScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                </div>
                <hr className="border-[1.5px] border-dashed border-slate-200" />

                <div className="flex flex-col gap-y-5">
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Did the employee do an exceptionally good job?
                    </p>
                    <div className="h-[2rem] flex gap-x-5">
                      <input
                        type="radio"
                        id="exceptionalJobYes"
                        name="exceptionalJob"
                        value="yes"
                        checked={endProj.exceptionalJob}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="exceptionalJobYes"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          endProj.exceptionalJob ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="exceptionalJobNo"
                        name="exceptionalJob"
                        value="no"
                        checked={!endProj.exceptionalJob}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="exceptionalJobNo"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          !endProj.exceptionalJob
                            ? "bg-blue-500 text-white"
                            : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        No
                      </label>
                    </div>
                  </div>

                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Did the employee do a bad job?
                    </p>
                    <div className="h-[2rem] flex gap-x-5">
                      <input
                        type="radio"
                        id="badJobYes"
                        name="badJob"
                        value="yes"
                        checked={endProj.badJob}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="badJobYes"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          endProj.badJob ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="badJobNo"
                        name="badJob"
                        value="no"
                        checked={!endProj.badJob}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="badJobNo"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          !endProj.badJob ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="border-[1.5px] border-dashed border-slate-200" />
                <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                  <p className="text-slate-500 text-sm">
                    How well did the employee work with coworkers on this
                    project?
                  </p>
                  <Rating
                    value={endProj.employeeSubstituteScore}
                    label={"employeeSubstituteScore"}
                    handleRateChange={handleRateChange}
                  />
                </div>
                <hr className="border-[1.5px] border-dashed border-slate-200" />
              </>
            ) : schema_id == "midproj_manager" ? (
              <>
                <hr className="border-[1.5px] border-dashed border-slate-200" />
                <div className="flex flex-col gap-y-5 ">
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Has the employee’s work been helpful in meeting company
                      needs for the project?
                    </p>
                    <Rating
                      value={midProj.managerEmployeeWorkHelpfulScore}
                      label={"managerEmployeeWorkHelpfulScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Are expectations for the project clear?
                    </p>
                    <Rating
                      value={midProj.managerExpectationsClearScore}
                      label={"managerExpectationsClearScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      How involved have you been in the project?
                    </p>
                    <Rating
                      value={midProj.selfInvolvementScore}
                      label={"selfInvolvementScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Has the employee been doing an exceptionally good job?
                    </p>
                    <div className="h-[2rem] flex gap-x-5">
                      <input
                        type="radio"
                        id="exceptionalJobYes"
                        name="exceptionalJob"
                        value="yes"
                        checked={midProj.exceptionalJob}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="exceptionalJobYes"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          midProj.exceptionalJob ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="exceptionalJobNo"
                        name="exceptionalJob"
                        value="no"
                        checked={!midProj.exceptionalJob}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="exceptionalJobNo"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          !midProj.exceptionalJob
                            ? "bg-blue-500 text-white"
                            : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        No
                      </label>
                    </div>
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Has the employee been doing a bad job?
                    </p>
                    <div className="h-[2rem] flex gap-x-5">
                      <input
                        type="radio"
                        id="badJobYes"
                        name="badJob"
                        value="yes"
                        checked={midProj.badJob}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="badJobYes"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          midProj.badJob ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="badJobNo"
                        name="badJob"
                        value="no"
                        checked={!midProj.badJob}
                        onChange={handleRadioChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="badJobNo"
                        className={`border border-blue-500 text-blue-500  text-sm w-fit px-8 rounded-md cursor-pointer flex justify-center items-center ${
                          !midProj.badJob ? "bg-blue-500 text-white" : ""
                        } hover:bg-blue-500 hover:text-white`}
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <hr className="border-[1.5px] border-dashed border-slate-200" />
                <div className="flex flex-col gap-y-5 ">
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      How well is the employee performing their
                      responsibilities?
                    </p>
                    <Rating
                      value={ongoingProj.performedResponsibilitiesScore}
                      label={"performedResponsibilitiesScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Are expectations for the project clear?
                    </p>
                    <Rating
                      value={ongoingProj.clearExpectationsScore}
                      label={"clearExpectationsScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      How error free is the project?
                    </p>
                    <Rating
                      value={ongoingProj.errorsScore}
                      label={"errorsScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      How involved are you in the project?
                    </p>
                    <Rating
                      value={ongoingProj.managerInvolvementScore}
                      label={"managerInvolvementScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                  <hr className="border-[1.5px] border-dashed border-slate-200" />
                  <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
                    <p className="text-slate-500 text-sm">
                      Do you have to involve yourself too much?
                    </p>
                    <Rating
                      value={ongoingProj.managerInvolvementNeedScore}
                      label={"managerInvolvementNeedScore"}
                      handleRateChange={handleRateChange}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-[4rem] flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white w-fit text-center px-5 py-2 rounded-md"
            >
              Submit Review
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ReviewResponse;
