import React from "react";
import { Space, Table, Tag } from "antd";
import { FaCheck } from "react-icons/fa6";
import { format } from "date-fns";
import { useSelector } from "react-redux";


const ReviewTable = ({ tabData }) => {
  const userRole = useSelector((state) => state.user.user.role).toLowerCase();
  const hasActionColumn = tabData.some((record) => record.action);

  const columns = [
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      render: (_, record) => record.date.name,
      sorter: (a, b) => new Date(a.date.value) - new Date(b.date.value),
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
      onFilter: (value, record) => record.project_size.indexOf(value) === 0,
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
        return <Tag color={record.review_type[1]}>{record.review_type[0]}</Tag>;
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
      onFilter: (value, record) => record.review_type.indexOf(value) === 0,
    },
    hasActionColumn && {
      title: "ACTION",
      key: "action",
      dataIndex: "action",
      render: (_, record) => (
        <div title="mark review" onClick={() => record.action(record)} className="cursor-pointer text-lg flex justify-center text-slate-500">
          <FaCheck />
        </div>
      ),
    },
  ].filter(Boolean);
;
  
  return (
    <Table
      columns={columns}
      dataSource={tabData}
      pagination={{ pageSize: 5 }}
    />
  );
};
export default ReviewTable;
