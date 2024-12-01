import { MonitoringCondition } from "@/constant/monitoring";
import { ExamRequest } from "@/types/exam";
import { Dispatch, SetStateAction } from "react";

type CheatingSettingProps = {
  examData: ExamRequest;
  handleToggleCondition: (condition: MonitoringCondition) => void;
  setCheatingModal: Dispatch<SetStateAction<boolean>>;
};
const CheatingSetting = ({
  examData,
  handleToggleCondition,
  setCheatingModal,
}: CheatingSettingProps) => {
  return (
    <div className="z-50 fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
      <div className="relative bg-[rgba(14,29,60,0.9)] rounded-[10px] flex flex-col gap-4 px-12 py-16 justify-center">
        {/* 저장 버튼 */}
        <button
          onClick={() => setCheatingModal(false)}
          className="absolute bottom-6 right-6 text-white text-[20px] bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
        >
          저장
        </button>

        {/* 부정행위 유형 */}
        {/* NOT_LOOKING_AROUND */}
        <div className="flex items-center gap-5">
          <div className="relative p-2">
            <div
              onClick={() =>
                handleToggleCondition(MonitoringCondition.NOT_LOOKING_AROUND)
              }
              className="border-2 border-white bg-slate-100 w-[35px] h-[15px] rounded-xl"
            >
              <div
                className={`${
                  examData.cheatingTypes.includes(
                    MonitoringCondition.NOT_LOOKING_AROUND
                  )
                    ? "right-0 bg-blue-500"
                    : "left-0 bg-gray-400"
                } absolute top-1 w-[22px] h-[22px] rounded-full transition-all duration-100 ease-in-out transform`}
              />
            </div>
          </div>
          <p className="text-white text-[24px]">
            아래를 보지 않은 상태에서 주변을 5초 이상 응시
          </p>
        </div>
        {/* REPEATED_GAZE */}
        <div className="flex items-center gap-5">
          <div className="relative p-2">
            <div
              onClick={() =>
                handleToggleCondition(MonitoringCondition.REPEATED_GAZE)
              }
              className="border-2 border-white bg-slate-100 w-[35px] h-[15px] rounded-xl"
            >
              <div
                className={`${
                  examData.cheatingTypes.includes(
                    MonitoringCondition.REPEATED_GAZE
                  )
                    ? "right-0 bg-blue-500"
                    : "left-0 bg-gray-400"
                } absolute top-1 w-[22px] h-[22px] rounded-full transition-all duration-100 ease-in-out transform`}
              />
            </div>
          </div>
          <p className="text-white text-[24px]">
            30초 이내에 아래를 보지 않은 상태에서 동일한 곳을 3초 이상 5번 응시
          </p>
        </div>
        {/* DEVICE_DETECTION */}
        <div className="flex items-center gap-5">
          <div className="relative p-2">
            <div
              onClick={() =>
                handleToggleCondition(MonitoringCondition.DEVICE_DETECTION)
              }
              className="border-2 border-white bg-slate-100 w-[35px] h-[15px] rounded-xl"
            >
              <div
                className={`${
                  examData.cheatingTypes.includes(
                    MonitoringCondition.DEVICE_DETECTION
                  )
                    ? "right-0 bg-blue-500"
                    : "left-0 bg-gray-400"
                } absolute top-1 w-[22px] h-[22px] rounded-full transition-all duration-100 ease-in-out transform`}
              />
            </div>
          </div>
          <p className="text-white text-[24px]">
            스마트폰, 작은 종이(시험지 제외)가 포착
          </p>
        </div>
        {/* OFF_SCREEN */}
        <div className="flex items-center gap-5">
          <div className="relative p-2">
            <div
              onClick={() =>
                handleToggleCondition(MonitoringCondition.OFF_SCREEN)
              }
              className="border-2 border-white bg-slate-100 w-[35px] h-[15px] rounded-xl"
            >
              <div
                className={`${
                  examData.cheatingTypes.includes(
                    MonitoringCondition.OFF_SCREEN
                  )
                    ? "right-0 bg-blue-500"
                    : "left-0 bg-gray-400"
                } absolute top-1 w-[22px] h-[22px] rounded-full transition-all duration-100 ease-in-out transform`}
              />
            </div>
          </div>
          <p className="text-white text-[24px]">화면에서 5초 이상 이탈</p>
        </div>
        {/* FREQUENT_OFF_SCREEN */}
        <div className="flex items-center gap-5">
          <div className="relative p-2">
            <div
              onClick={() =>
                handleToggleCondition(MonitoringCondition.FREQUENT_OFF_SCREEN)
              }
              className="border-2 border-white bg-slate-100 w-[35px] h-[15px] rounded-xl"
            >
              <div
                className={`${
                  examData.cheatingTypes.includes(
                    MonitoringCondition.FREQUENT_OFF_SCREEN
                  )
                    ? "right-0 bg-blue-500"
                    : "left-0 bg-gray-400"
                } absolute top-1 w-[22px] h-[22px] rounded-full transition-all duration-100 ease-in-out transform`}
              />
            </div>
          </div>
          <p className="text-white text-[24px]">
            30초 이내 화면에서 3초이상 5번 이탈
          </p>
        </div>
        {/* REPEATED_HAND_GESTURE */}
        <div className="flex items-center gap-5">
          <div className="relative p-2">
            <div
              onClick={() =>
                handleToggleCondition(MonitoringCondition.REPEATED_HAND_GESTURE)
              }
              className="border-2 border-white bg-slate-100 w-[35px] h-[15px] rounded-xl"
            >
              <div
                className={`${
                  examData.cheatingTypes.includes(
                    MonitoringCondition.REPEATED_HAND_GESTURE
                  )
                    ? "right-0 bg-blue-500"
                    : "left-0 bg-gray-400"
                } absolute top-1 w-[22px] h-[22px] rounded-full transition-all duration-100 ease-in-out transform`}
              />
            </div>
          </div>
          <p className="text-white text-[24px]">특정 손동작을 반복하는 경우</p>
        </div>
        {/* TURNING_AWAY */}
        <div className="flex items-center gap-5">
          <div className="relative p-2">
            <div
              onClick={() =>
                handleToggleCondition(MonitoringCondition.TURNING_AWAY)
              }
              className="border-2 border-white bg-slate-100 w-[35px] h-[15px] rounded-xl"
            >
              <div
                className={`${
                  examData.cheatingTypes.includes(
                    MonitoringCondition.TURNING_AWAY
                  )
                    ? "right-0 bg-blue-500"
                    : "left-0 bg-gray-400"
                } absolute top-1 w-[22px] h-[22px] rounded-full transition-all duration-100 ease-in-out transform`}
              />
            </div>
          </div>
          <p className="text-white text-[24px]">
            정면 하단이 아닌 고개를 돌리고 5초 이상 유지
          </p>
        </div>
        {/* SPECIFIC_POSITION_BEHAVIOR */}
        <div className="flex items-center gap-5">
          <div className="relative p-2">
            <div
              onClick={() =>
                handleToggleCondition(
                  MonitoringCondition.SPECIFIC_POSITION_BEHAVIOR
                )
              }
              className="border-2 border-white bg-slate-100 w-[35px] h-[15px] rounded-xl"
            >
              <div
                className={`${
                  examData.cheatingTypes.includes(
                    MonitoringCondition.SPECIFIC_POSITION_BEHAVIOR
                  )
                    ? "right-0 bg-blue-500"
                    : "left-0 bg-gray-400"
                } absolute top-1 w-[22px] h-[22px] rounded-full transition-all duration-100 ease-in-out transform`}
              />
            </div>
          </div>
          <p className="text-white text-[24px]">
            정면 하단을 제외한 특정 위치로 고개를 돌리는 행위를 30초 이내 3초
            이상 5번 수행
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheatingSetting;
