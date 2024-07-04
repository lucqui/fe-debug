import React, { useEffect, useState } from "react";
import Layout from "../../components/Admin/Layout";
import { Rings } from "react-loader-spinner";
import { IoIosAdd } from "react-icons/io";
// import AddProjectModal from "../../components/User/AddProjectModal";
import toast from "react-hot-toast";
import { Table } from "antd";
import { LuSearch } from "react-icons/lu";
import { useSelector } from "react-redux";
import axiosConfig from "../../axios/axiosConfig";

const AdminProject = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [allProject, setAllProject] = useState([]);
  const [allGoals, setAllGoals] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
//   const tabs = ["My Projects", "Other Projects"];
  const userId = useSelector((state) => state.user.user.id);
  const userRole = useSelector((state) => state.user.user.role).toLowerCase();
  const managerId = useSelector((state) => state.user.user.manager_id);
  const projectSizeMap = {
    1: { name: "Small", value: 1 },
    2: { name: "Medium", value: 2 },
    3: { name: "Large", value: 3 },
    4: { name: "Existential", value: 4 },
  };
  function searchFilter(e) {
    if (searchQuery) {
      console.log("search", e);
      return e.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else return true;
  }

  async function submit(data) {
    try {
      setLoading(true);
      const promise = axiosConfig.post("/apis/projects", data);
      toast.promise(promise, {
        loading: "Adding Project",
        success: "Project Added Successfully",
        error: "Something went wrong",
      });
      const res = await promise;
      if (res.status === 200) {
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllProject() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/projects");
      console.log(
        res.data.data.map((item) => {
          return {
            ...item,
            size: projectSizeMap[item.size],
          };
        })
      );
      setAllProject(
        res.data.data.map((item) => {
          return {
            ...item,
            size: projectSizeMap[item.size],
          };
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function fetchAllGoal() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/goals");
      console.log("goals", res);
      setAllGoals(
        res.data.data.map((item) => {
          return {
            name: item.name,
            value: item.id,
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
      title: "NAME",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <span className=" whitespace-nowrap">{record.name}</span>;
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "SIZE",
      dataIndex: "size",
      key: "size",
      filters: [
        {
          text: "Small",
          value: "Small",
        },
        {
          text: "Medium",
          value: "Medium",
        },
        {
          text: "Large",
          value: "Large",
        },
        {
          text: "Existential",
          value: "Existential",
        },
      ],
      onFilter: (value, record) => record.size.name.indexOf(value) === 0,
      render: (_, record) => {
        return record.size.name;
      },
    },
    {
        title: "GOAL",
        dataIndex: "goal_name",
        key: "goal_name",
      },
   {
      title: "CREATED BY",
      dataIndex: "created_by_full_name",
      key: "created_by_full_name",
      sorter: (a, b) =>
        a.created_by_full_name.localeCompare(b.created_by_full_name),
    },
  ].filter(Boolean);

  useEffect(() => {
    fetchAllProject();
    fetchAllGoal();
  }, [refresh]);

  useEffect(() => {
    // if (activeTab == 0) {
      setFilteredData(
        allProject
          .filter(searchFilter))
      
    // } else {
    //   setFilteredData(
        // allProject
        //   .filter(searchFilter)
        //   .filter((e) => e.created_by_id !== userId)
    //   );
    // }
  }, [searchQuery, allProject, activeTab]);

  useEffect(() => {
    console.log("*", filteredData);
  }, [filteredData]);

  return (
    <Layout>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Rings height={150} width={150} color="#3b82f6" />
        </div>
      ) : (
        <>
          {/* {isOpen && (
            <AddProjectModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              submit={submit}
              allGoals={allGoals}
            />
          )} */}
          <h1 className="text-xl font-semibold  mb-8 text-slate-800">
            Projects
          </h1>
          <div className="space-y-10 ">
            <div className="flex justify-between items-center">
              {/* <div className=" w-fit space-x-3 text-sm pb-[2px]">
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
              </div> */}
              <div className="flex justify-end gap-x-5  w-full">
                <div className="relative flex items-center float-end">
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
            </div>

            <div>
              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default AdminProject;
