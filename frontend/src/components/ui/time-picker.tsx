"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { TimePickerInput } from "./time-picker-input";
import { Label } from "@radix-ui/react-label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimePickerProps {
  time: Date | undefined;
  setTime: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function TimePicker({ time, setTime }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[250px] justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? format(time, "HH:mm:ss") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex items-end gap-2 mx-6 my-4">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Hours
            </Label>
            <TimePickerInput
              picker="hours"
              date={time}
              setDate={setTime}
              ref={hourRef}
              onRightFocus={() => minuteRef.current?.focus()}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              Minutes
            </Label>
            <TimePickerInput
              picker="minutes"
              date={time}
              setDate={setTime}
              ref={minuteRef}
              onLeftFocus={() => hourRef.current?.focus()}
              onRightFocus={() => secondRef.current?.focus()}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="seconds" className="text-xs">
              Seconds
            </Label>
            <TimePickerInput
              picker="seconds"
              date={time}
              setDate={setTime}
              ref={secondRef}
              onLeftFocus={() => minuteRef.current?.focus()}
            />
          </div>
          <div className="flex h-10 items-center">
            <Clock className="ml-2 h-4 w-4" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
