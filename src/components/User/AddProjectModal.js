import { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";
import toast from "react-hot-toast";
import { RxReset } from "react-icons/rx";
import Dropdown from "../Common/Dropdown";

const projectSize = [
  { name: "Small", value: 1 },
  { name: "Medium", value: 2 },
  { name: "Large", value: 3 },
  { name: "Existential", value: 4 },
];

export default function AddProjectModal({
  isOpen,
  setIsOpen,
  submit,
  allGoals,
}) {
  const [selected, setSelected] = useState(projectSize[0]);
  const [selectedGoal, setSelectedGoal] = useState(allGoals[0]);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    size: projectSize[0].value,
    goal_id: allGoals[0].value,
  });
  function reset() {
    setSelected(projectSize[0]);
    setSelectedGoal(allGoals[0]);
    setNewProject({
      name: "",
      description: "",
      size: projectSize[0].value,
      goal_id: allGoals[0].value,
    });
  }
  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewProject({ ...newProject, [name]: value });
  }
  function checkFields() {
    if (
      Object.values(newProject).every(
        (item) => item.length > 0 || typeof item == "number"
      )
    ) {
      submit({
        ...newProject,
        size: selected.value,
        goal_id: selectedGoal.value,
      });
      reset();
      //   setRefresh((prev) => !prev);
      setIsOpen(false);
    } else {
      toast("Fill all the informations", {
        icon: "⚠️",
      });
    }
  }
  useEffect(() => {
    console.log(newProject);
    console.log("allGoals", allGoals);
  }, [newProject]);

  return (
    <Dialog
      as="div"
      className="bg-black bg-opacity-30 h-screen w-full fixed top-0 flex justify-center items-center z-40"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Dialog.Panel className="bg-white w-[50vw] rounded-lg p-4 border border-slate-100 shadow-lg relative">
        <Dialog.Title className="text-center text-slate-700 text-lg mb-4">
          Add New Project
        </Dialog.Title>
        <RxCross1
          onClick={() => setIsOpen(false)}
          className="text-slate-600 absolute top-2 right-2 cursor-pointer"
        />
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            {/* <label
              title="Name of the goal"
              htmlFor="name"
              className="text-slate-500 text-sm"
            >
              Project Name *
            </label> */}
            <input
              name="name"
              placeholder="Enter Project Name"
              value={newProject.name}
              onChange={handleInputChange}
              type="text"
              id="name"
              autoComplete="off"
              className="py-1 px-2 border border-slate-100 rounded-md text-slate-800"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            {/* <label
              title="Description of the goal"
              htmlFor="name"
              className="text-slate-500 text-sm"
            >
              Project Description *
            </label> */}
            <textarea
              onChange={handleInputChange}
              name="description"
              value={newProject.description}
              placeholder="Enter Project Description"
              maxLength={200}
              type="text"
              rows={5}
              id="description"
              className="resize-none py-1 px-2 border border-slate-100 rounded-md text-slate-800 "
            />
            <span className="text-[11px] text-slate-500 block text-right">
              {newProject.description.length}/200
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex-grow">
            <label
              title="Description of the goal"
              htmlFor="name"
              className="text-slate-500 text-sm"
            >
              Project Size *
            </label>
            <Dropdown
              data={projectSize}
              selected={selected}
              setSelected={setSelected}
              width={"w-full"}
            />
            </div>
            <div className="flex-grow">
            <label
              title="Description of the goal"
              htmlFor="name"
              className="text-slate-500 text-sm"
            >
              Project Size *
            </label>
            <Dropdown
              data={allGoals}
              selected={selectedGoal}
              setSelected={setSelectedGoal}
              width={"w-full"}
            />
            </div>
          </div>
        </div>

        <div className="mt-4 float-right">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium bg-blue-500 text-white  border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            onClick={checkFields}
          >
            Submit
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            onClick={reset}
          >
            Reset
          </button>
          <RxCross1
            onClick={() => setIsOpen(false)}
            className="absolute top-0 right-0 m-2 cursor-pointer"
          />
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
