import { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";
import toast from "react-hot-toast";
import { RxReset } from "react-icons/rx";
import Dropdown from "../Common/Dropdown";

export default function DisplayModal({ openModal, setOpenModal }) {
  const { data } = openModal;
  const { responses, counter_responses } = data;



  console.log(data)
    const booleanMap={
        true: "Yes",
        false: "No"
    }


    const responseMap = {
      "ongoing": <tbody>
        <tr className="border-y">
          <td className="p-2">Clear Expectations</td>
          <td className="p-2 text-center">{responses.clearExpectationsScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.clearExpectationsScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Error Score</td>
          <td className="p-2 text-center">{responses.errorsScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.errorsScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Manager Involvement Need</td>
          <td className="p-2 text-center">{responses.managerInvolvementNeedScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.managerInvolvementNeedScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Manager Involvement</td>
          <td className="p-2 text-center">{responses.managerInvolvementScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.managerInvolvementScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Responsibility</td>
          <td className="p-2 text-center">{responses.performedResponsibilitiesScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.performedResponsibilitiesScore ||"--"}</td>
        </tr>
      </tbody>,
      "endproj":<tbody>
      <tr className="border-y">
        <td className="p-2">Clear Expectations</td>
        <td className="p-2 text-center">{responses.clearExpectationsScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.clearExpectationsScore ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Error Score</td>
        <td className="p-2 text-center">{responses.errorsScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.errorsScore ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Manager Involvement Need</td>
        <td className="p-2 text-center">{responses.managerInvolvementNeedScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.managerInvolvementNeedScore ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Manager Involvement</td>
        <td className="p-2 text-center">{responses.managerInvolvementScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.managerInvolvementScore ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Manager Excessive</td>
        <td className="p-2 text-center">{responses.managerExcessiveScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.managerExcessiveScore ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Match Project</td>
        <td className="p-2 text-center">{responses.matchProjectNeedScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.matchProjectNeedScore ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Had Deadline</td>
        <td className="p-2 text-center">{booleanMap[responses.hadDeadline] ||"--"}</td>
        <td className="p-2 text-center">{booleanMap[counter_responses.hadDeadline] ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">On Schedule</td>
        <td className="p-2 text-center">{booleanMap[responses.onSchedule] ||"--"}</td>
        <td className="p-2 text-center">{booleanMap[counter_responses.onSchedule] ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Employee Substitue</td>
        <td className="p-2 text-center">{responses.employeeSubstituteScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.employeeSubstituteScore ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Bad Job</td>
        <td className="p-2 text-center">{booleanMap[responses.badJob] ||"--"}</td>
        <td className="p-2 text-center">{booleanMap[counter_responses.badJob] ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Self Involvement Need</td>
        <td className="p-2 text-center">{responses.selfInvolvementNeedScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.selfInvolvementNeedScore ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Self Involvement</td>
        <td className="p-2 text-center">{responses.selfInvolvementScore ||"--"}</td>
        <td className="p-2 text-center">{counter_responses.selfInvolvementScore ||"--"}</td>
      </tr>
    </tbody>,
      "midproj":<tbody>
         <tr className="border-y">
          <td className="p-2">Clear Expectations</td>
          <td className="p-2 text-center">{responses.clearExpectationsScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.clearExpectationsScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Helpful</td>
          <td className="p-2 text-center">{responses.helpfulScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.helpfulScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Manager Involvement</td>
          <td className="p-2 text-center">{responses.managerInvolvementScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.managerInvolvementScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Manager Helpful</td>
          <td className="p-2 text-center">{responses.managerEmployeeWorkHelpfulScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.managerEmployeeWorkHelpfulScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Manager Expectation Clear</td>
          <td className="p-2 text-center">{responses.managerExpectationsClearScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.managerExpectationsClearScore ||"--"}</td>
        </tr>
        <tr className="border-y">
          <td className="p-2">Self Involvement</td>
          <td className="p-2 text-center">{responses.selfInvolvementScore ||"--"}</td>
          <td className="p-2 text-center">{counter_responses.selfInvolvementScore ||"--"}</td>
        </tr>
        <tr className="border-y">
        <td className="p-2">Bad Job</td>
        <td className="p-2 text-center">{booleanMap[responses.badJob] ||"--"}</td>
        <td className="p-2 text-center">{booleanMap[counter_responses.badJob] ||"--"}</td>
      </tr>
      <tr className="border-y">
        <td className="p-2">Exceptional Job</td>
        <td className="p-2 text-center">{booleanMap[responses.exceptionalJob] ||"--"}</td>
        <td className="p-2 text-center">{booleanMap[counter_responses.exceptionalJob] ||"--"}</td>
      </tr>
      </tbody>
    }




  return (
    <Dialog
      as="div"
      className="bg-slate-100 bg-opacity-5 backdrop-blur-[2px] h-screen w-full fixed top-0 flex justify-center items-center z-40"
      open={openModal.status}
      onClose={() => setOpenModal({ status: false, data: {} })}
    >
      <Dialog.Panel className="bg-white w-[50vw] rounded-lg px-10 pb-10 pt-5 border border-slate-100 shadow-lg relative">
        <Dialog.Title className="text-center text-slate-700 font-medium text-lg mb-6">
          {data.project_name} <br/><span className="text-xs">(response)</span>
        </Dialog.Title>
        <RxCross1
          onClick={() => setOpenModal({ status: false, data: {} })}
          className="text-slate-600 absolute top-4 right-4 cursor-pointer"
        />
        <div className="rounded-lg overflow-hidden">

         <table className="w-full border">
          <thead>
            <tr className="border-y bg-slate-50">
            <th></th>
              <td className="p-2 text-center ">Employee's</td>
              <td className="p-2 text-center">Manager's</td>
            </tr>
          </thead>
            {responseMap[data.schema_id]}
         </table>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
