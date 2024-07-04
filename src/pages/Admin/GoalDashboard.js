import React, { useEffect, useState } from "react";
import Layout from "../../components/Admin/Layout";
import { Rings } from "react-loader-spinner";
import { IoIosAdd, IoIosCreate } from "react-icons/io";
import AddGoalModal from "../../components/Admin/AddGoalModal";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Table } from "antd";
import { LuSearch } from "react-icons/lu";
import axiosConfig from "../../axios/axiosConfig";

const GoalDashboardAdmin = () => {
  const [allGoals, setAllGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [openAddGoalModal, setopenAddGoalModal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);

  async function fetchAllGoal() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/goals");
      console.log("goals", res);
      setAllGoals(
        res.data.data.map((item) => {
          return {
            ...item,
            date: format(new Date(item.created_at), "dd-MM-yy"),
          };
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function createNewGoal(data) {
    try {
      const promise = axiosConfig.post("/apis/goals", data);
      toast.promise(promise, {
        loading: "Adding Goal",
        success: "Goal Added Successfully",
        error: "Something went wrong",
      });
      await promise;
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateGoal(data) {
    try {
      const goalId = currentGoal.id; // Ensure your goal data model includes `id`
      const promise = axiosConfig.put(`/apis/goals/${goalId}`, data);
      toast.promise(promise, {
        loading: "Updating Goal",
        success: "Goal Updated Successfully",
        error: "Error updating goal",
      });
      await promise;
      setRefresh((prev) => !prev);
      setCurrentGoal(null); // Reset currentGoal to exit edit mode
    } catch (error) {
      console.error(error);
    }
  }

  const handleEditClick = (goal) => {
    setCurrentGoal(goal);
    setopenAddGoalModal(true);
  };

  const columns = [
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <IoIosCreate
          size={20}
          onClick={() => handleEditClick(record)}
          className="cursor-pointer text-blue-500"
        />
      ),
    },
  ];

  useEffect(() => {
    fetchAllGoal();
  }, [refresh]);

  useEffect(() => {
    setFilteredData(allGoals.filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, allGoals]);

  return (
    <Layout>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Rings height={150} width={150} color="#3b82f6" />
        </div>
      ) : (
        <div>
          <AddGoalModal
            isOpen={openAddGoalModal}
            setIsOpen={setopenAddGoalModal}
            submit={currentGoal ? updateGoal : createNewGoal}
            currentGoal={currentGoal}
            setRefresh={setRefresh}
          />
          <h1 className="text-xl font-semibold mb-8 text-slate-800">Goal Dashboard</h1>
          <div className="flex justify-end gap-x-5">
            <div className="relative flex items-center mb-3">
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
            <div
              onClick={() => {
                setopenAddGoalModal(true);
                setCurrentGoal(null); // Ensure we're in "add" mode
              }}
              className="bg-blue-500 text-white flex cursor-pointer p-1 px-3 text-sm gap-x-1 rounded-md w-fit mb-3"
            >
              <IoIosAdd size={20} />
              Add Goal
              </div>
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
export default GoalDashboardAdmin;
