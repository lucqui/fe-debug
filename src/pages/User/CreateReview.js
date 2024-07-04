import React, { useEffect, useState } from "react";
import Layout from "../../components/User/Layout";
import { Rings } from "react-loader-spinner";
import Dropdown from "../../components/Common/Dropdown";
import Rating from "../../components/Common/Rating";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosConfig from "../../axios/axiosConfig";

const schemaId = [
  { name: "End Project", value: "endproj" },
  { name: "Mid Project", value: "midproj" },
  { name: "Ongoing Project", value: "ongoing" },
];

const CreateReview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [allProjects, setAllProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState({});
  const [selectedSchema, setSelectedSchema] = useState(schemaId[0]);
  const managerId = useSelector(
    (state) => state.user.user.manager_id
  ).toLowerCase();

  //Common Data
  const [otherData, setOtherData] = useState({
    project_id: selectedProject.value,
  });
  //End Proj
  const [endProj, setEndProj] = useState({
    hadDeadline: false,
    onSchedule: false,
    matchProjectNeedScore: 2,
    clearExpectationsScore: 2,
    errorsScore: 2,
    managerInvolvementScore: 2,
    managerInvolvementNeedScore: 2,
    managerExcessiveScore: 2,
  });
  //Mid Proj
  const [midProj, setMidProj] = useState({
    helpfulScore: 2,
    managerInvolvementScore: 2,
    clearExpectationsScore: 2,
  });
  // Ongoing Proj
  const [ongoingProj, setOngoingProj] = useState({
    performedResponsibilitiesScore: 2,
    clearExpectationsScore: 2,
    errorsScore: 2,
    managerInvolvementScore: 2,
    managerInvolvementNeedScore: 2,
  });

  function reset() {
    setOtherData({
      project_id: selectedProject.value,
    });
    setEndProj({
      hadDeadline: false,
      onSchedule: false,
      matchProjectNeedScore: 2,
      clearExpectationsScore: 2,
      errorsScore: 2,
      managerInvolvementScore: 2,
      managerInvolvementNeedScore: 2,
      managerExcessiveScore: 2,
      exceptionalJob: false,
      badJob: false,
      employeeSubstituteScore: 2,
    });
    setMidProj({
      helpfulScore: 2,
      managerInvolvementScore: 2,
      clearExpectationsScore: 2,
    });
  }

  async function fetchAllProjects() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/projects");
      console.log("projects", res);
      setAllProjects(
        res.data.data.filter((e) => e.created_by_id === managerId).map(
          ({ name, id }, index) => ({ name, value: id })
        )
      );
      setSelectedProject(
        res.data.data.filter((e) => e.created_by_id === managerId).map(
          ({ name, id }, index) => ({ name, value: id })
        )[0]
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setOtherData({ ...otherData, [name]: value });
  };
  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    setEndProj({
      ...endProj,
      [name]: value === "yes",
    });
  };
  const handleRateChange = (field, value) => {
    if (selectedSchema.value == "endproj") {
      setEndProj({
        ...endProj,
        [field]: value,
      });
    } else if (selectedSchema.value == "midproj") {
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
  async function handleSubmit() {
    let data;
    if (selectedSchema.value == "endproj") {
      data = endProj;
    } else if (selectedSchema.value == "midproj") {
      data = midProj;
    } else {
      data = ongoingProj;
    }
    // console.log({
    //   ...otherData,
    //   schema_id: "endproj",
    //   responses: endProj,
    // });
    try {
      setLoading(true);
      const res = await axiosConfig.post("/apis/reviews", {
        ...otherData,
        responses: data,
        schema_id: selectedSchema.value,
      });
      if (res.status == 200) {
        toast.success("Review Submitted Successfully");
        reset();
        navigate("/employee/review");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //endProj Component
  const endProjComponent = (
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
            Was the project completed on or ahead of schedule? If not, was is
            the employee’s fault?
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
            How closely did the project you completed match the project needed?
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
            How involved was your manager in the project?
          </p>
          <Rating
            value={endProj.managerInvolvementScore}
            label={"managerInvolvementScore"}
            handleRateChange={handleRateChange}
          />
        </div>
        <hr className="border-[1.5px] border-dashed border-slate-200" />
        <div className="flex flex-col gap-2 bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
          <p className="text-slate-500 text-sm">
            If you completed the project again, how involved would your manager
            need to be?
          </p>
          <Rating
            value={endProj.managerInvolvementNeedScore}
            label={"managerInvolvementNeedScore"}
            handleRateChange={handleRateChange}
          />
        </div>
        <hr className="border-[1.5px] border-dashed border-slate-200" />
        <div className="flex flex-col gap-2 bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
          <p className="text-slate-500 text-sm">
            Did your manager involve themselves too much?
          </p>
          <Rating
            value={endProj.managerExcessiveScore}
            label={"managerExcessiveScore"}
            handleRateChange={handleRateChange}
          />
        </div>
      </div>
    </>
  );
  //midProj Component
  const midProjComponent = (
    <>
      <hr className="border-[1.5px] border-dashed border-slate-200" />
      <div className="flex flex-col gap-y-5 ">
        <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
          <p className="text-slate-500 text-sm">
            Has the work you have been doing been helpful in meeting company
            needs for the project?
          </p>
          <Rating
            value={midProj.helpfulScore}
            label={"helpfulScore"}
            handleRateChange={handleRateChange}
          />
        </div>
        <hr className="border-[1.5px] border-dashed border-slate-200" />
        <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
          <p className="text-slate-500 text-sm">
            Are expectations for the project clear?
          </p>
          <Rating
            value={midProj.clearExpectationsScore}
            label={"clearExpectationsScore"}
            handleRateChange={handleRateChange}
          />
        </div>
        <hr className="border-[1.5px] border-dashed border-slate-200" />
        <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
          <p className="text-slate-500 text-sm">
            How involved has your manager been in the project?
          </p>
          <Rating
            value={midProj.managerInvolvementScore}
            label={"managerInvolvementScore"}
            handleRateChange={handleRateChange}
          />
        </div>
      </div>
    </>
  );
  //ongoingProj Component
  const ongoingProjComponent = (
    <>
      <hr className="border-[1.5px] border-dashed border-slate-200" />
      <div className="flex flex-col gap-y-5 ">
        <div className="flex flex-col bg-gray-200 bg-opacity-40 p-3 rounded-lg py-5 gap-y-4">
          <p className="text-slate-500 text-sm">
            How well are you performing your responsibilities?
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
            How involved has your manager been in the project?
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
            Does your manager involve themselves too much?
          </p>
          <Rating
            value={ongoingProj.managerInvolvementNeedScore}
            label={"managerInvolvementNeedScore"}
            handleRateChange={handleRateChange}
          />
        </div>
      </div>
    </>
  );

  useEffect(() => {
    fetchAllProjects();
  }, []);
  useEffect(() => {
    setOtherData({
      ...otherData,
      ["project_id"]: selectedProject.value,
    });
  }, [selectedProject]);
  useEffect(() => {
    console.log(otherData);
  }, [otherData]);

  return (
    <Layout>
      <h1 className="text-xl font-semibold  mb-4 text-slate-800">
        Create Review
      </h1>

      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Rings height={150} width={150} color="#3b82f6" />
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Dropdown
              data={schemaId}
              selected={selectedSchema}
              setSelected={setSelectedSchema}
              disabled={false}
              width={"w-[15rem]"}
            />
          </div>
          <div className="space-y-5">
            <div className="flex flex-col gap-y-5 bg-gray-200 bg-opacity-40 p-3 rounded-lg">
              <label
                htmlFor="project_name"
                className="text-sm text-slate-500 mb-3"
              >
                Project Name
              </label>
              <Dropdown
                data={allProjects}
                selected={selectedProject}
                setSelected={setSelectedProject}
                disabled={false}
                width={"w-1/2"}
              />
            </div>
            <hr className="border-[1.5px] border-dashed border-slate-200" />
            {selectedSchema.value == "endproj"
              ? endProjComponent
              : selectedSchema.value == "midproj"
              ? midProjComponent
              : ongoingProjComponent}
          </div>
          <div className="mt-[4rem] flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white w-fit px-5 text-center py-2 rounded-md"
            >
              Submit Review
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CreateReview;
