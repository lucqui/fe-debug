import React from "react";
import { Space, Table, Tag } from "antd";

const PayTable = ({columns, tabData}) => {
  return (
    <Table
    className="my-8"
      columns={columns}
      dataSource={tabData}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default PayTable;
