"use client";

import { testSesstion } from "@/types/user";
import GridIcon from "@/assets/icons/GridIcon.svg";
import PeopleIcon from "@/assets/icons/PeopleIcon.svg";
import RowMoreIcon from "@/assets/icons/RowMoreIcon.svg";
import DashBoardCard from "./DashBoardCard";
import { useState } from "react";
import TableSetModal from "./TableSetModal";
import TestCodeModal from "./TestCodeModal";

type DashBoardSectionProps = {
  sesstionData: testSesstion;
};

const DashBoardSection = ({ sesstionData }: DashBoardSectionProps) => {
  const [row, setRow] = useState(5);
  const [column, setColumn] = useState(
    Math.ceil(sesstionData.examStudentNumber / row)
  );

  // row를 설정하면 column이 자동 계산
  const handleRowChange = (newRow: number) => {
    setRow(newRow);
    setColumn(Math.ceil(sesstionData.examStudentNumber / newRow));
  };

  // column을 설정하면 row가 자동 계산
  const handleColumnChange = (newColumn: number) => {
    setColumn(newColumn);
    setRow(Math.ceil(sesstionData.examStudentNumber / newColumn));
  };

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  return (
    <>
      {tableModalOpen && (
        <TableSetModal
          row={row}
          column={column}
          setColumn={setColumn}
          setRow={setRow}
          setTableModalOpen={setTableModalOpen}
        />
      )}
      {codeModalOpen && (
        <TestCodeModal setCodeModalOpen={setCodeModalOpen} code={"12345"} />
      )}
      <div className="grow bg-[#0E1D3C] text-white p-10">
        <div>
          <p className="text-[20px] font-bold">{sesstionData.examName}</p>
          <p className="text-[18px] font-bold">
            🕐 {sesstionData.examDuration}
          </p>
        </div>
        <div className="w-full flex justify-end items-center gap-5">
          <GridIcon onClick={() => setTableModalOpen(true)} />
          <PeopleIcon onClick={() => setCodeModalOpen(true)} />
          <RowMoreIcon />
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
    </>
  );
};

export default DashBoardSection;
