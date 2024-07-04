import React, { useEffect, useState } from "react";
import Layout from "../../components/Admin/Layout";
import { format } from "date-fns";
import { Table } from "antd";
import { RxChevronDown } from "react-icons/rx";
import { LuSearch } from "react-icons/lu";
import UploadUserModal from "../../components/Admin/UploadUserModal";
import {IoIosAdd} from 'react-icons/io'
import axiosConfig from "../../axios/axiosConfig";

const AdminUserView = () => {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const tabs = ["Admins", "Managers", "Employees"];

  async function fetchAllUsers() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/user/fetch-users");
      console.log("users", res);
      const users = res.data.data;
      setAllUsers(
        users.map((user, index) => {
          const children = users
            .filter((e) => user.id == e.manager_id)
            .map((e) => {
              return {
                key: e.id,
                dateJoined: {
                  name: format(new Date(e.created_at), "dd-MM-yy"),
                  value: e.created_at,
                },
                name: e.first_name + " " + e.last_name,
                managerId: e.manager_id,
                role: e.role,
                title: e.title,
                id: e.id,
              };
            });
          const childrenArray = children.length > 0 ? children : undefined;
          return {
            key: index,
            dateJoined: {
              name: format(new Date(user.created_at), "dd-MM-yy"),
              value: user.created_at,
            },
            name: user.first_name + " " + user.last_name,
            managerId: user.manager_id,
            role: user.role,
            title: user.title,
            id: user.id,
            children: childrenArray,
          };
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  function searchFilter(e) {
    if (searchQuery) {
      console.log("search", e);
      return e.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else return true;
  }

  const findManagerName = (record, allUsers) => {
    if (record.role === "Employee") {
      // console.log("***", record, allUsers);
      const manager = allUsers.find((user) => user.id === record.managerId);
      //   console.log("***",manager)
      return manager ? manager.name : "";
    }
  };

  const columns = [
    {
      title: "DATE JOINED",
      dataIndex: "dateJoined",
      render: (_, record) => record.dateJoined.name,
      key: "dateJoined",
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
    },
    activeTab === 2 && {
      title: "MANAGER",
      key: "manager",
      render: (_, record) => findManagerName(record, allUsers),
    },
  ].filter(Boolean);

  useEffect(() => {
    fetchAllUsers();
  }, [refresh]);

  useEffect(() => {
    const filteredData = allUsers
      .filter((user) => {
        switch (activeTab) {
          case 0:
            return user.role === "Admin";
          case 1:
            return user.role === "Manager";
          case 2:
            return user.role === "Employee";
          default:
            return true;
        }
      })
      .filter(searchFilter);
    setFilteredData(filteredData);
  }, [allUsers, activeTab, searchQuery]);

  return (
    <Layout>
      {
        <UploadUserModal
          showModal={showUploadModal}
          setShowModal={setShowUploadModal}
          setRefresh={setRefresh}
          role={activeTab}
        />
      }
      <h1 className="text-xl font-semibold  mb-8 text-slate-800">
        Users Dashboard
      </h1>
      <div className="space-y-8">
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

          <div className="flex items-center justify-center gap-3">
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
           { !(activeTab===0 )&& <div
              onClick={() => {
                setShowUploadModal(true);
              }}
              className="bg-blue-500 text-white flex cursor-pointer p-1 px-3 text-sm gap-x-1 rounded-md w-fit"
            >
              
              <IoIosAdd size={20} />
              {activeTab ===1 ?"Upload Manager":"Upload User"}
            </div>}
          </div>
        </div>

        <Table columns={columns} dataSource={filteredData} />
      </div>
    </Layout>
  );
};

export default AdminUserView;
