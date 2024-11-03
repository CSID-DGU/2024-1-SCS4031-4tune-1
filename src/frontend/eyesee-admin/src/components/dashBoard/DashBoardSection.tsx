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
};

const DashBoardSection = ({ sesstionData }: DashBoardSectionProps) => {
  const [row, setRow] = useState(5);
  const [column, setColumn] = useState(
    Math.ceil(sesstionData.examStudentNumber / row)
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
        <TestCodeModal setCodeModalOpen={setCodeModalOpen} code={"12345"} />
      )}
      <div className="grow bg-[#0E1D3C] text-white p-10">
        <TestInfo
          examDuration={sesstionData.examDuration}
          examName={sesstionData.examName}
        >
          <GridIcon onClick={() => setTableModalOpen(true)} />
          <PeopleIcon onClick={() => setCodeModalOpen(true)} />
          <RowMoreIcon />
        </TestInfo>
        <div
          className="grid gap-5 justify-center items-center"
          style={{
            gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))`,
          }}
        >
          {sesstionData.user.map((user) => (
            <div key={user.userId} className="flex justify-center">
              <DashBoardCard
                key={user.userId}
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
