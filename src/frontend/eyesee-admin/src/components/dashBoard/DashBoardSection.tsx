"use client";

import { testSesstion } from "@/types/user";
import DashBoardIcon from "@/assets/icons/DashBoardIcon.svg";
import PeopleIcon from "@/assets/icons/PeopleIcon.svg";
import RowMoreIcon from "@/assets/icons/RowMoreIcon.svg";
import DashBoardCard from "./DashBoardCard";
import { useState } from "react";

type DashBoardSectionProps = {
  sesstionData: testSesstion;
};

const DashBoardSection = ({ sesstionData }: DashBoardSectionProps) => {
  const totalUsers = sesstionData.user.length;
  const [row, setRow] = useState(5);
  const [column, setColumn] = useState(Math.ceil(totalUsers / row));

  // row를 설정하면 column이 자동 계산
  const handleRowChange = (newRow: number) => {
    setRow(newRow);
    setColumn(Math.ceil(totalUsers / newRow));
  };

  // column을 설정하면 row가 자동 계산
  const handleColumnChange = (newColumn: number) => {
    setColumn(newColumn);
    setRow(Math.ceil(totalUsers / newColumn));
  };

  return (
    <div className="grow bg-[#0E1D3C] text-white p-10">
      <div>
        <p className="text-[20px] font-bold">{sesstionData.examName}</p>
        <p className="text-[18px] font-bold">🕐 {sesstionData.examDuration}</p>
      </div>
      <div className="w-full flex justify-end items-center gap-5">
        <DashBoardIcon />
        <PeopleIcon />
        <RowMoreIcon />
      </div>
      <div className="flex gap-4 mb-4">
        <label>
          Row:
          <input
            type="number"
            value={row}
            onChange={(e) => handleRowChange(Number(e.target.value))}
            min={1}
          />
        </label>
        <label>
          Column:
          <input
            type="number"
            value={column}
            onChange={(e) => handleColumnChange(Number(e.target.value))}
            min={1}
          />
        </label>
      </div>
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))`,
        }}
      >
        {sesstionData.user.map((user) => (
          <DashBoardCard key={user.userId} user={user} />
        ))}
      </div>
    </div>
  );
};

export default DashBoardSection;
