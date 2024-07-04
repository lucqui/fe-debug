import React, { useState } from "react";
import { Flex, Rate } from "antd";

const Rating = ({label, handleRateChange,value}) => {
  const [data, setData] = useState(2);
  const desc = [
    "Abysmal",
    "Poor",
    "Below Expectations",
    "Adequate",
    "Satisfactory",
    "Above Expectations",
    "Good",
    "Excellent",
    "Outstanding",
    "Exceptional",
  ];
  function handleChange(value){
    setData(value);
    handleRateChange(label, value)
  }
  return (
    <div>
      <Flex gap="middle" vertical>
        <Rate
          tooltips={desc}
          allowClear={false}
          value={value}
          onChange={handleChange}
          className="text-slate-600 flex justify-evenly w-[70%] mx-auto rounded-md py-2"
          defaultValue={2}
          character={({ index = 0 }) => index + 1}
          count={10}
        />
      </Flex>
    </div>
  );
};

export default Rating;
