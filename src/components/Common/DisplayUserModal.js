import { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";
import toast from "react-hot-toast";
import { RxReset } from "react-icons/rx";
import Dropdown from "../Common/Dropdown";
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";


export default function DisplayUserModal({ responseModal, setResponseModal }) {
  const { data } = responseModal;

  console.log(responseModal)

  return (
    <Dialog
      as="div"
      className="bg-slate-100 bg-opacity-5 backdrop-blur-[2px] h-screen w-full fixed top-0 flex justify-center items-center z-40"
      open={responseModal.status}
      onClose={() => setResponseModal({ status: false, data: {} })}
    >
      <Dialog.Panel className="bg-white w-[50vw] h-[80vh] rounded-lg px-10 pb-10 pt-5 border border-slate-100 shadow-lg relative overflow-y-scroll no-scrollbar">
        <Dialog.Title className="text-center text-slate-700 font-medium text-lg mb-6">
          Upload Response
        </Dialog.Title>
        <RxCross1
          onClick={() => setResponseModal({ status: false, data: {} })}
          className="text-slate-600 absolute top-4 right-4 cursor-pointer"
        />
        <div className="rounded-lg overflow-hidden">

         <table className="w-full border">
          <thead>
            <tr className="border-y bg-slate-50">
              <td className="p-2 text-left ">Email</td>
              <td className="p-2 text-center">Status</td>
              <td className="p-2 text-center">Description</td>
            </tr>
          </thead>
          <tbody>
            {
                responseModal.data.data?.map(response=>(
                    <tr className="border-y">
                    <td className="p-2 text-left">{response.email ||"--"}</td>
                    <td className="p-2 text-center flex gap-1 items-center"><RxCheckCircled className="text-green-500 text-lg"/> Success</td>
                    <td className="p-2 text-center">User created successfully</td>
                  </tr>
                ))
            }
              {
                responseModal.data.failed_data.map(response=>(
                    <tr className="border-y">
                    <td className="p-2 text-left">{response.email ||"--"}</td>
                    <td className="p-2 text-center flex gap-1 items-center"><RxCrossCircled className="text-red-500 text-lg"/> Failed</td>
                    <td className="p-2 text-center">{response.description}</td>
                  </tr>
                ))
            }
          </tbody>
            {/* {responseMap[data.schema_id]} */}
         </table>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
