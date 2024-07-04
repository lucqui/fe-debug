import React from "react";

const ScoreBar = ({ score = 8.8, width = 40, height = '2rem' }) => {
  // Calculate the percentage based on the score out of 10
  const percentage = (score / 10) * 100;

  return (
    <div style={{ width: width + '%' }} className="bg-slate-200 h-fit rounded-md overflow-hidden border border-slate-300">
      <div
        style={{ width: percentage + "%" }}
        className={`bg-blue-500 min-h-[1rem] h-[${height}] raise`}
      >
      </div>
    </div>
  );
};

export default ScoreBar;
