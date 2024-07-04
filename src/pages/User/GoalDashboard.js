import React, { useEffect, useState } from "react";
import Layout from "../../components/User/Layout";
import { FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import { Rings } from "react-loader-spinner";
import { Table } from "antd";
import { LuSearch } from "react-icons/lu";
import axiosConfig from "../../axios/axiosConfig";

const GoalDashboardUser = () => {
  const [allGoals, setAllGoals] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function searchFilter(e) {
    if (searchQuery) {
      console.log("search", e);
      return e.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else return true;
  }

  async function fetchAllGoal() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/goals");
      console.log("goals", res);
      setAllGoals(
        res.data.data.filter(searchFilter).map((item) => {
          return {
            date: format(new Date(item.created_at), "dd-MM-yy"),
            name: item.name,
            description: item.description,
          };
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  const columns = [
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (_, record) => {
        return <span className="whitespace-nowrap">{record.date}</span>;
      },
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <span className="whitespace-nowrap">{record.name}</span>;
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
  ];

  useEffect(() => {
    setFilteredData(allGoals.filter(searchFilter));
  }, [searchQuery, allGoals]);

  useEffect(() => {
    fetchAllGoal();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Rings height={150} width={150} color="#3b82f6" />
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-semibold  mb-8 text-slate-800">
            Goal Dashboard{" "}
          </h1>
          <div className="relative flex items-center float-end mb-3">
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
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
          />

        </div>
      )}
    </Layout>
  );
};
export default GoalDashboardUser;
