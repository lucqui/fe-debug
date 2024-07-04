import React, { useEffect, useState } from "react";
import Layout from "../../components/Admin/Layout";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { LuSearch } from "react-icons/lu";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Table, Tag } from "antd";
import { FaRegEye } from "react-icons/fa";
import DisplayModal from "../../components/Common/DisplayModal";
import axiosConfig from "../../axios/axiosConfig";

const AdminReview = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.user.role).toLowerCase();
  const tabs = ["Pending", "Completed"];
  const [activeTab, setActiveTab] = useState(0);
  const [reviewData, setReviewData] = useState([]);
  const [tabData, setTabData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState({ status: false, data: {} });
  const projectSizeMap = {
    1: "Small",
    2: "Medium",
    3: "Large",
    4: "Existential",
  };
  const reviewTypeMap = {
    endproj_manager: ["End Project", "green", "endproj_manager"],
    endproj: ["End Project", "green", "endproj"],
    midproj_manager: ["Mid Project", "yellow", "midproj_manager"],
    midproj: ["Mid Project", "yellow", "midproj"],
    ongoing_manager: ["Ongoing Project", "orange", "ongoing_manager"],
    ongoing: ["Ongoing Project", "orange", "ongoing"],
  };

  async function fetchAllReviews() {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/apis/reviews/admin");
      console.log(res.data);
      setReviewData(res.data.map((data) => ({ ...data, showModalData })));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  function showModalData(data) {
    console.log(data);
    setOpenModal({
      status: true,
      data: data,
    });
  }

  function searchFilter(e) {
    if (searchQuery)
      return e.project_name.toLowerCase().includes(searchQuery.toLowerCase());
    else return true;
  }

  const columns = [
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      render: (_, record) => format(new Date(record.submitted_at), "dd-MM-yy"),
      sorter: (a, b) => new Date(a.submitted_at) - new Date(b.submitted_at),
    },
    {
      title: "PROJECT NAME",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "PROJECT SIZE",
      dataIndex: "project_size",
      key: "project_size",
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
      onFilter: (value, record) => projectSizeMap[record.project_size].indexOf(value) === 0,
      render: (_, record) => projectSizeMap[record.project_size],
    },
    (userRole == "manager" || userRole == "admin") && {
      title: "SUBMITTED BY",
      key: "submitted_by",
      dataIndex: "employee_name",
    },
    {
      title: "REVIEW TYPE",
      key: "review_type",
      dataIndex: "review_type",
      render: (_, record) => {
        return (
          <Tag color={reviewTypeMap[record.schema_id][1]}>
            {reviewTypeMap[record.schema_id][0]}
          </Tag>
        );
      },
      filters: [
        {
          text: "End Project",
          value: "End Project",
        },
        {
          text: "Mid Project",
          value: "Mid Project",
        },
        {
          text: "Ongoing Project",
          value: "Ongoing Project",
        },
      ],
      onFilter: (value, record) => reviewTypeMap[record.schema_id][0].indexOf(value) === 0,
    },
    {
      title: "ACTION",
      key: "action",
      dataIndex: "action",
      render: (_, record) => (
        <div
          title="show review"
          onClick={() => record.showModalData(record)}
          className="cursor-pointer text-lg flex justify-center text-slate-500"
        >
          <FaRegEye />
        </div>
      ),
    },
  ].filter(Boolean);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Rings height={150} width={150} color="#3b82f6" />
        </div>
      ) : (
        <div>
          {openModal.status && <DisplayModal openModal={openModal} setOpenModal={setOpenModal} />}
          <h1 className="text-xl font-semibold  mb-8 text-slate-800">
            Reviews{" "}
          </h1>
          {
            <div className="space-y-10">
              <div className="flex justify-end items-center">
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
              <Table
                columns={columns}
                dataSource={reviewData}
                pagination={{ pageSize: 5 }}
              />
            </div>
          }
        </div>
      )}
    </Layout>
  );
};

export default AdminReview;
