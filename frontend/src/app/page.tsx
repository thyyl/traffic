"use client";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { LocationSection } from "@/components/ui/location-section";
import { TimePicker } from "@/components/ui/time-picker";
import { WeatherCard } from "@/components/ui/weather-card";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<Date | undefined>();

  const { setTheme } = useTheme();

  const tempData = [
    "Punggol",
    "AMK",
    "Punggol",
    "AMK",
    "Punggol",
    "AMK",
    "Punggol",
    "AMK",
    "Punggol",
    "AMK",
    "Punggol",
    "AMK",
    "Punggol",
    "AMK",
    "Punggol",
    "AMK",
  ];

  setTheme("dark");

  return (
    <main className="flex flex-col justify-center items-start my-8 mx-32 gap-y-8">
      <div className="flex flex-row gap-x-8">
        <DatePicker date={date} setDate={setDate} />
        <TimePicker time={time} setTime={setTime} />
        <Button onClick={() => console.log(date, time)}>Log</Button>
      </div>
      <div className="flex md:flex-row flex-col w-full items-center">
        <LocationSection locations={tempData} />
        <WeatherCard />
      </div>
    </main>
  );
}
