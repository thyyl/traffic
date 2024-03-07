"use client";
import { Calendar } from "@/components/ui/calendar";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { setTheme } = useTheme();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}
