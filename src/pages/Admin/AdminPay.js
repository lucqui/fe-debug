import React, { useEffect, useState } from "react";
import Layout from "../../components/Admin/Layout";
import { LuSearch } from "react-icons/lu";
import PayTable from "../../components/Common/PayTable";
import axiosConfig from "../../axios/axiosConfig";
// import Card from "../../components/Common/Card";

const Pay = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [budgetData, setBudgetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const tabs = ["Managers", "Employees"];

  async function fetchAllPay() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/compensation/budget");
      const arr = res.data.Description;
      const adminIndex = arr.findIndex((user) => user.role === "Admin");
      if (adminIndex !== -1) {
        arr.splice(adminIndex, 1);
      }
      setBudgetData(arr);
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
      title: "VARIABLE PAY ",
      dataIndex: "variablePay",
      key: "variablePay",
    },
    {
      title: "TARGET COMMISSIONS ",
      dataIndex: "targetCommissions",
      key: "targetCommissions",
    },
    {
      title: "SCORE ",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "REPLACEABILITY SCORE ",
      dataIndex: "replaceScore",
      key: "replaceScore",
    },
  ];

  useEffect(() => {
    fetchAllPay();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      setFilteredData(
        budgetData
          .filter((user) => user.role.toLowerCase() === "manager")
          .map((item) => {
            return {
              name: `${item.first_name} ${item.last_name}`,
              basePay: item.base_pay ? item.base_pay : "NA",
              score: item.score ? item.score : "NA",
              replaceScore: item.replaceability_score
                ? item.replaceability_score
                : "NA",
              variablePay: item.variable_pay ? item.variable_pay : "NA",
              targetCommissions: item.target_commissions
                ? item.target_commissions
                : "NA",
            };
          })
      );
    } else if (activeTab === 1) {
      setFilteredData(
        budgetData
          .filter((user) => user.role.toLowerCase() === "employee")
          .map((item) => {
            return {
              name: `${item.first_name} ${item.last_name}`,
              basePay: item.base_pay,
              score: item.score,
              replaceScore: item.replaceability_score
                ? item.replaceability_score
                : "NA",
              variablePay: item.variable_pay ? item.variable_pay : "NA",
              targetCommissions: item.target_commissions
                ? item.target_commissions
                : "NA",
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
    </Layout>
  );
};

export default Pay;
