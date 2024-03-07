"use client";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { setTheme } = useTheme();

  setTheme("dark");

  return (
    <div>
      <DatePicker />
      <TimePicker date={date} setDate={setDate} />
    </div>
  );
}
