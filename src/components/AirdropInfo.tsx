import Image, { StaticImageData } from "next/image";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { formatUnits } from "viem";

import Tick from "@/assets/tick.svg";

type AirdropInfoType = {
  label: string;
  value: bigint | undefined;
  icon: React.ReactNode;
  symbol?: string;
  blue?: boolean;
  ticked?: boolean;
  item?: React.ReactNode;
  className?: string;
};

const AirdropInfo: React.FC<AirdropInfoType> = ({
  label,
  value,
  icon,
  blue,
  symbol,
  item,
  ticked,
  className,
}) => {
  return (
    <div
      className={`w-full p-4 border border-[#f7f8fa] dark:border-[#2c2f36] rounded-[20px] flex flex-col ${
        className ?? ""
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-start">{icon}</div>
        <div className="flex flex-col items-end">
          <span
            className={`${
              blue
                ? "text-[#4fd9ff] dark:text-[#bee8ff]"
                : "text-[#565a69] dark:text-[#c3c5cb]"
            } text-sm flex items-center text-right`}
          >
            {ticked && (
              <Image
                src={Tick.src}
                width={Tick.width}
                height={Tick.height}
                alt="tick"
                className="w-[16px] mr-1"
              />
            )}
            {label}
          </span>
          <span
            className={`${
              blue
                ? "text-[#00aedf] dark:text-[#00bbea]"
                : "text-black dark:text-white"
            } text-base font-medium text-right`}
          >
            {value
              ? parseFloat(formatUnits(value, 18)).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              : "-"}{" "}
            <span className="font-normal">{symbol}</span>
          </span>
        </div>
      </div>
      {Boolean(item) && <div className="flex w-full justify-end">{item}</div>}
    </div>
  );
};

export default AirdropInfo;
