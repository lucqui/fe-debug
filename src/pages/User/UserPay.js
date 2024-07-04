import React, { useEffect, useState } from "react";
import Layout from "../../components/User/Layout";
import { LuSearch } from "react-icons/lu";
import PayTable from "../../components/Common/PayTable";
import { useSelector } from "react-redux";
import axiosConfig from "../../axios/axiosConfig";
// import Card from "../../components/Common/Card";

const UserPay = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [budgetData, setBudgetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user.user.id);
  const userTitle = useSelector((state) => state.user.user.title).toLowerCase();
  const tabs = ["My Data", "Employees"];

  async function fetchAllPay() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/compensation");
      const arr = res.data.Description;
      console.log(arr);
      const adminIndex = arr.findIndex((user) => user.role === "Admin");
      console.log(userId);
      if (adminIndex !== -1) {
        arr.splice(adminIndex, 1);
      }
      setBudgetData(arr);
      console.log(arr);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function fetchPayById(){
    try {
        setLoading(true);
        const res = await axiosConfig.get(`/apis/compensation/${userId}`);
        setEmployeeData(res.data.Description);
        console.log(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
  }

  const columns = [
    {
      title: "NAME ",
      dataIndex: "name",
      key: "name",
      // render: (_, record) => record.date.name,
      // sorter: (a, b) => new Date(a.date.value) - new Date(b.date.value),
    },
    {
      title: "BASE PAY ",
      dataIndex: "basePay",
      key: "basePay",
    },
    {
      title: "TARGET COMMISSION ",
      dataIndex: "targetCommission",
      key: "targetCommission",
    },
    {
      title: "VARIABLE PAY ",
      dataIndex: "variablePay",
      key: "variablePay",
    },
  ];

  useEffect(() => {
    if(userTitle === "manager"){
        fetchAllPay();
    }else{
        fetchPayById();
    }
  }, []);

  useEffect(() => {

    if (activeTab === 0) {
      setFilteredData(
        budgetData
          .filter((user) => user.user_id === userId)
          .map((item) => {
            return {
              // name : `${item.first_name} ${item.last_name}`,
              name: item.user_id,
              basePay: item.base_pay,
              targetCommission: item.target_commissions,
              variablePay: item.variable_pay,
            };
          })
      );
    } else if (activeTab === 1) {
      setFilteredData(
        budgetData
          .filter((user) => user.user_id !== userId)
          .map((item) => {
            return {
              // name : `${item.first_name} ${item.last_name}`,
              name: item.user_id,
              basePay: item.base_pay,
              targetCommission: item.target_commissions,
              variablePay: item.variable_pay,
            };
          })
      );
    }

  }, [activeTab, budgetData]);

  return (
    <Layout>
      <h1 className="text-xl font-semibold  mb-8 text-slate-800">
        Pay Dashboard
      </h1>
      { userTitle === "manager" ?
      <>
      <div className="flex justify-between items-center">
        <div className=" w-fit space-x-3 text-sm pb-[2px]">
          {tabs.map((e, index) => {
            return (
              <span
                className={`pb-[2px] cursor-pointer px-4 ${
                  activeTab == index
                    ? "border-b-2 border-blue-500 text-blue-500 "
                    : "text-slate-600"
                }`}
                onClick={() => setActiveTab(index)}
              >
                {e}
              </span>
            );
          })}
        </div>
        <div className="relative flex items-center">
          <LuSearch className="absolute left-1 text-slate-300" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white pl-5 rounded-full border border-slate-300 text-sm py-[2px] focus:outline-none text-slate-700 w-[10rem]"
            placeholder="Search"
            type="text"
            name="search"
          />
        </div>
      </div>
      <PayTable columns={columns} tabData={filteredData} />      
      </> 
      :
       <div className="grid grid-cols-3 gap-x-5">
            <h1 className=" bg-white p-3 rounded-lg space-y-4 text-lg text-slate-700 flex flex-col font-semibold justify-center items-center">Your Base Pay : <span className="text-base font-normal"> {employeeData.base_pay} </span></h1>
            <h1 className=" bg-white p-3 rounded-lg space-y-4 text-lg text-slate-700 flex flex-col font-semibold justify-center items-center">Your  Target Commissions : <span className="text-base font-normal"> {employeeData.target_commissions} </span></h1>
            <h1 className=" bg-white p-3 rounded-lg space-y-4 text-lg text-slate-700 flex flex-col font-semibold justify-center items-center">Your Variable Pay : <span className="text-base font-normal"> {employeeData.variable_pay} </span></h1>
       </div>
}
    </Layout>
  );
};

export default UserPay;
