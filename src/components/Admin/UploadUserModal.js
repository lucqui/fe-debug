import { Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import DisplayUserModal from "../Common/DisplayUserModal";
import axiosConfig from "../../axios/axiosConfig";

function UploadUserModal({ showModal, setShowModal, setRefresh, role }) {
  const [responseModal, setResponseModal] = useState({
    status: false,
    data: {},
  });
  //   const [] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    files: [],
  });
  const modalRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const csvFiles = droppedFiles.filter((file) => file.type === "text/csv");
    const otherFiles = droppedFiles.filter((file) => file.type !== "text/csv");

    if (otherFiles.length > 0) {
      toast.error("Only CSV files are allowed.");
    }

    setFormData({ ...formData, files: [...formData.files, ...csvFiles] });
    setIsDragging(true);
  };
  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const csvFiles = selectedFiles.filter((file) => file.type === "text/csv");
    const otherFiles = selectedFiles.filter((file) => file.type !== "text/csv");

    if (otherFiles.length > 0) {
      toast.error("Only CSV files are allowed.");
    }

    setFormData({ ...formData, files: [...formData.files, ...csvFiles] });
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (formData.files[0]) {
      const userData = new FormData();
      userData.append("file", formData.files[0]);
      let link;
      if (role === 1) {
        link = "/apis/user/upload-managers";
      } else if (role === 2) {
        link = "/apis/user/upload-users";
      }
      try {
        setShowModal(false);
        const promise = axiosConfig.post(link, userData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.promise(promise, {
          loading: "Uploading CSV",
          success: "CSV uploaded successfully",
          error: "Error uploading CSV",
        });
        const res = await promise;

        console.log(res);
        if (res.status === 200) {
          setResponseModal(
           { status:true,
            data:res.data}
          )
          setRefresh((prev) => !prev);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFormData({ files: [] });
      }
    } else {
      toast.error("Upload CSV");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col m-4  gap-y-4">
      {responseModal.status && (
        <DisplayUserModal
          setResponseModal={setResponseModal}
          responseModal={responseModal}
        />
      )}
      {showModal && (
        <div className="z-40 fixed top-0 left-0  w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
          <div
            ref={modalRef}
            className="z-50 bg-[#FFFFFFE0] relative p-10 w-[520px] h-[514px] rounded-2xl flex flex-col items-center justify-center gap-y-6"
          >
            <RxCross2
              size={30}
              onClick={() => setShowModal(false)}
              className="ml-[25rem] cursor-pointer text-sm rounded-full p-1 absolute top-2 right-2"
            />
            <p className="text-center text-slate-700 text-xl mb-4">Add File</p>
            <div
              className={`w-full h-[20rem] border-2 ${
                isDragging ? "border-blue-500" : "border-slate-400"
              } rounded-lg border-dashed flex flex-col justify-center items-center`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                name="Scans"
                type="file"
                className="hidden"
                id="file-input"
                onChange={handleFileInputChange}
              />
              {/* <PiCloudArrowDown
                className={`text-5xl font-normal ${
                  isDragging ? "text-[#36AE78]" : "text-slate-400"
                }`}
              /> */}
              <span className="text-slate-400 text-center">
                Drag & Drop files here <br />
                or{" "}
              </span>{" "}
              <label
                className="text-blue-600 hover:underline cursor-pointer"
                htmlFor="file-input"
              >
                {" "}
                Browse
              </label>
            </div>
            <div className="w-full">
              <ul className="w-full py-[3px] flex gap-x-3 px-2 overflow-x-scroll no-scrollbar">
                {formData.files.map((file, index) => (
                  <li
                    className="border border-blue-500 text-blue-500 bg-blue-200 bg-opacity-15 rounded-full w-fit pl-2 pr-1 whitespace-nowrap flex items-center gap-x-1"
                    key={index}
                  >
                    {file.name.length > 15
                      ? file.name.substring(0, 14) + "..."
                      : file.name}
                  </li>
                ))}
              </ul>
              {/* <p className="text-left text-slate-500 text-sm pl-3 pt-2">
                {formData.Scans.length > 0
                  ? "Files: " + formData.Scans.length
                  : ""}
              </p> */}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white font-semibold px-8 py-2 rounded-xl w-[450px] mt-6 active:scale-95 active:transform transition-transform duration-300 focus:outline-none"
            >
              Add
              {/* {loading ? loader : "Add"} */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadUserModal;
