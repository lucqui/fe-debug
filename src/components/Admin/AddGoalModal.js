import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";
import toast from "react-hot-toast";
import { RxReset } from "react-icons/rx";

export default function AddGoalModal({
  isOpen,
  setIsOpen,
  submit,
  currentGoal, // The current goal being edited, if any
  setRefresh, // Function to trigger a refresh in the parent component
}) {
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
  });

  // Effect to handle opening modal for edit or add new
  useEffect(() => {
    if (currentGoal && isOpen) {
      // Pre-fill the form for editing
      setNewGoal({
        name: currentGoal.name,
        description: currentGoal.description,
      });
    } else {
      // Reset form if not editing (i.e., adding a new goal)
      reset();
    }
  }, [currentGoal, isOpen]);

  function reset() {
    setNewGoal({
      name: "",
      description: "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewGoal({ ...newGoal, [name]: value });
  }

  function checkFieldsAndSubmit() {
    if (Object.values(newGoal).every((item) => item.trim().length > 0)) {
      submit({
        ...newGoal,
        id: currentGoal ? currentGoal.id : undefined,
      });
      reset();
      setIsOpen(false);
      setRefresh((prev) => !prev); // Refresh parent component to reflect changes
    } else {
      toast.error("Please fill in all the fields.");
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setIsOpen}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title className="text-center text-slate-700 text-lg mb-4">
                {currentGoal ? "Edit Goal" : "Add New Goal"}
              </Dialog.Title>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Goal Name"
                  autoComplete="off"
                  value={newGoal.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                <textarea
                  name="description"
                  placeholder="Goal Description"
                  value={newGoal.description}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border rounded-md"
                  rows="4"
                ></textarea>
              </div>

              <div className="mt-4 float-right">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium bg-blue-500 text-white  border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={checkFieldsAndSubmit}
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
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
