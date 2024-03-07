import React from "react";
import Image from "next/image";
import { PinContainer } from "./3d-pin";

interface TrafficContainerProps {
  image: string;
}

export const TrafficContainer: React.FC<TrafficContainerProps> = ({
  image,
}) => {
  return (
    <div className="border border-white/[0.1] rounded-2xl w-[30rem] h-[25rem] bg-black">
      <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2  ">
        <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
          Traffic Conditions At Punggol
        </h3>
        <div className="text-base !m-0 !p-0 font-normal">
          <span className="text-slate-500 ">
            Traffic Conditions Around 3:00 PM
          </span>
        </div>
        <Image
          src={image}
          alt="cloudy"
          className="flex flex-1 w-full rounded-lg mt-4"
          width={400}
          height={100}
        />
      </div>
    </div>
  );
};
