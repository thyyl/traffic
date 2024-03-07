import React from "react";
import Image from "next/image";
import { PinContainer } from "./3d-pin";

interface WeatherCardProps {}

export const WeatherCard: React.FC<WeatherCardProps> = ({}) => {
  const images = {
    cloudy:
      "https://images.unsplash.com/uploads/14122598319144c6eac10/5f8e7ade?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return (
    <div className="h-[25rem] flex items-center justify-start">
      <PinContainer
        title="http://www.weather.gov.sg/"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            The weather now is cloudy
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              Cloudy conditions expected arpund 3:00 PM
            </span>
          </div>
          <Image
            src={images["cloudy"]}
            alt="cloudy"
            className="flex flex-1 w-full rounded-lg mt-4"
            width={300}
            height={300}
          />
        </div>
      </PinContainer>
    </div>
  );
};
