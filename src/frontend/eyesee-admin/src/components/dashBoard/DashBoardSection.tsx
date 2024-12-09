"use client";

import { testSesstion } from "@/types/user";
import GridIcon from "@/assets/icons/GridIcon.svg";
import PeopleIcon from "@/assets/icons/PeopleIcon.svg";
import RowMoreIcon from "@/assets/icons/RowMoreIcon.svg";
import DashBoardCard from "./DashBoardCard";
import { useState } from "react";
import TableSetModal from "./TableSetModal";
import TestCodeModal from "./TestCodeModal";
import TestInfo from "./TestInfo";

type DashBoardSectionProps = {
  sesstionData: testSesstion;
  children?: React.ReactNode;
};

const DashBoardSection = ({
  sesstionData,
  children,
}: DashBoardSectionProps) => {
  const [column, setColumn] = useState(5);
  const [row, setRow] = useState(
    Math.ceil(sesstionData.examStudentNumber / column)
  );

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  return (
    <>
      {tableModalOpen && (
        <TableSetModal
          examStudentNumber={sesstionData.examStudentNumber}
          row={row}
          column={column}
          setColumn={setColumn}
          setRow={setRow}
          setTableModalOpen={setTableModalOpen}
        />
      )}
      {codeModalOpen && (
        <TestCodeModal
          setCodeModalOpen={setCodeModalOpen}
          code={sesstionData.examCode}
        />
      )}
      <div className="grow bg-[#0E1D3C] text-white p-10 h-screen overflow-scroll">
        <TestInfo
          examDuration={sesstionData.examDuration}
          examName={sesstionData.examName}
        >
          {children}
        </TestInfo>
        <div className="flex items-center w-full justify-end gap-5 mb-5">
          <GridIcon
            className="cursor-pointer"
            onClick={() => setTableModalOpen(true)}
          />
          <PeopleIcon
            className="cursor-pointer"
            onClick={() => setCodeModalOpen(true)}
          />
          <RowMoreIcon />
        </div>
        <div
          className="grid gap-5 justify-center items-center"
          style={{
            gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))`,
          }}
        >
          {sesstionData.user.map((user) => (
            <div key={user.userId} className="flex justify-center">
              <DashBoardCard
                user={user}
                exam={{
                  name: sesstionData.examName,
                  duration: sesstionData.examDuration,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashBoardSection;
