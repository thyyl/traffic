import React, { Fragment, ReactNode } from "react";
import Image from "next/image";
import { PinContainer } from "./3d-pin";
import { getNearestQuarter } from "@/lib/time-utils";
import { Steps } from "@/lib/types";
import { Skeleton } from "./skeleton";

interface WeatherCardProps {
  weather?: string;
  time?: Date;
  steps: Steps;
  isLoading?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  time,
  steps,
  isLoading,
}) => {
  const renderSteps = (): ReactNode => {
    return steps === Steps.DETAILS ? (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <Image src="/images/empty.png" height={144} width={144} alt="empty" />
        <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
          No weather data available
        </h3>
      </div>
    ) : (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
          Please start by selecting a location
        </h3>
      </div>
    );
  };

  return (
    <div className="h-[15rem] flex items-center justify-start">
      {isLoading ? (
        <Skeleton className="h-[15rem]" />
      ) : (
        <PinContainer
          title="http://www.weather.gov.sg/"
          href="http://www.weather.gov.sg/"
        >
          <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[38rem] xl:w-[20rem] h-[10rem] ">
            {weather ? (
              <Fragment>
                <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                  The weather now is {weather}
                </h3>
                <div className="text-base !m-0 !p-0 font-normal">
                  <span className="text-slate-500 ">
                    {weather} conditions expected around{" "}
                    {getNearestQuarter(time!)}
                  </span>
                </div>
              </Fragment>
            ) : (
              renderSteps()
            )}
          </div>
        </PinContainer>
      )}
    </div>
  );
};
