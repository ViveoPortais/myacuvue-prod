import React from "react";
import Button from "../button/Button";
import Image from "next/image";

interface ContentCardProps {
  isCustomBg?: boolean;
  bgColor?: string;
  title: string;
  subtitle?: string;
  titleTwo?: string;
  subtitleTwo?: string;
}

const ContentCardNew = ({
  isCustomBg,
  bgColor,
  title,
  subtitle,
  titleTwo,
  subtitleTwo,
}: ContentCardProps) => {
  return (
    <div
      className={`w-full rounded-xl lg:h-52 ${
        isCustomBg
          ? "bg-[url('/')] bg-contain bg-no-repeat bg-careDarkBlue scale-x-[-1]"
          : `${bgColor}`
      } `}
    >
      <div
        className={`${isCustomBg && "scale-x-[-1]"} flex flex-col h-full p-4`}
      >
        <div className="text-white w-full md:px-10">
          <div className="flex flex-col w-full">
            <span className="w-full text-2xl">{title}</span>
            <span className="text-base mt-2 opacity-80">{subtitle}</span>
          </div>
          <div className="flex flex-col mt-5 w-[45%]">
            <hr />
          </div>
          <div className="flex flex-col w-full mt-5">
            <span className="w-full text-base text-careLightBlue font-bold">
              {titleTwo}
            </span>
            <span className="text-base text-careLightBlue font-bold">
              {subtitleTwo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCardNew;
