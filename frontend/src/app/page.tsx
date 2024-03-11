"use client";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { ErrorComponent } from "@/components/ui/error";
import { LocationContainer } from "@/container/location-container";
import { RecommendationContainer } from "@/container/recommendation-container";
import { TimePicker } from "@/components/ui/time-picker";
import { TrafficContainer } from "@/container/traffic-container";
import { useToast } from "@/components/ui/use-toast";
import { WeatherCard } from "@/components/ui/weather-card";
import { useLocationDetails } from "@/hooks/location-details";
import { useRecentSearches } from "@/hooks/recent-searches";
import { useTrafficLocations } from "@/hooks/traffic-location";
import { Steps, TrafficLocation } from "@/lib/types";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function Home() {
  // ==================== CONSTANTS
  const localStorageKey = "RECENT-SEARCHES";

  // ==================== STATES
  const [getLocationsDateTime, setGetLocationsDateTime] = useState<string>();
  const [steps, setSteps] = useState<Steps>(Steps.DATE);
  const [selectedLocation, setSelectedLocation] = useState<TrafficLocation>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<Date | undefined>();
  const { toast } = useToast();

  // ==================== HOOKS
  const { setTheme } = useTheme();
  setTheme("dark");

  const { data, isLoading, error, refetch } = useTrafficLocations({
    dateTime: getLocationsDateTime,
    enabled: !!getLocationsDateTime,
  });

  const {
    data: detailsData,
    isLoading: detailsIsLoading,
    error: detailsError,
  } = useLocationDetails({
    dateTime: getLocationsDateTime,
    enabled: !!getLocationsDateTime && !!selectedLocation,
    latitude: selectedLocation?.latitude,
    longitude: selectedLocation?.longitude,
    location: selectedLocation?.location,
  });

  const {
    data: recentSearches,
    isLoading: recentSearchesIsLoading,
    error: recentSearchError,
  } = useRecentSearches();

  // ==================== EVENTS
  const handleGetLocations = () => {
    setSelectedLocation(undefined);

    if (!date || !time) {
      toast({
        title: "Invalid Date/Time",
        description: "Please select a valid date and time",
        variant: "destructive",
      });
      return;
    }

    const dateSelected = format(date, "yyyy-MM-dd");
    const [timeSelected] = time?.toTimeString().split(" ");

    const formattedDate = `${dateSelected}T${timeSelected}`;

    if (getLocationsDateTime === formattedDate) {
      refetch();
    }

    handleLocalStorage(formattedDate);

    setSteps(Steps.LOCATION);
    setGetLocationsDateTime(formattedDate);
  };

  const handleLocalStorage = (formattedDate: string) => {
    const items = localStorage.getItem(localStorageKey);

    if (items) {
      const parsedItems: string[] = JSON.parse(items) ?? [];
      if (parsedItems.length >= 5) {
        parsedItems.pop();
      }
      parsedItems.unshift(formattedDate);
      localStorage.setItem(localStorageKey, JSON.stringify(parsedItems));
    } else {
      localStorage.setItem(localStorageKey, JSON.stringify([formattedDate]));
    }

    return;
  };

  const handleRecommendationsPressed = (dateSearched: string) => {
    setDate(new Date(dateSearched));
    setTime(new Date(dateSearched));

    const [dateSelected, rest] = dateSearched.split("T");
    const [timeSelected] = rest.split(".");

    setSteps(Steps.LOCATION);
    setGetLocationsDateTime(`${dateSelected}T${timeSelected}`);
  };

  const handleLocationSelected = (location: TrafficLocation) => {
    setSelectedLocation(location);
    setSteps(Steps.DETAILS);
  };

  // ==================== VIEWS
  return (
    <div className="flex flex-col justify-center items-start my-8 md:mx-32 gap-y-8">
      <div className="flex flex-row gap-x-8">
        <DatePicker date={date} setDate={setDate} />
        <TimePicker time={time} setTime={setTime} />
        <Button
          disabled={isLoading || detailsIsLoading}
          onClick={handleGetLocations}
        >
          Search
        </Button>
      </div>
      <ErrorComponent error={!!error || !!detailsError || !!recentSearchError}>
        <div className="gap-y-8 flex flex-col">
          {[Steps.DETAILS, Steps.LOCATION].includes(steps) ? (
            <div className="flex xl:flex-row flex-col w-full items-center">
              <LocationContainer
                trafficLocations={data}
                isLoading={isLoading || detailsIsLoading}
                handleLocationSelected={handleLocationSelected}
              />
              <WeatherCard
                isLoading={isLoading || detailsIsLoading}
                steps={steps}
                weather={selectedLocation?.weatherForecast}
                time={time}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full items-start gap-y-8">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Please start by selecting a date and time
              </h3>
              <RecommendationContainer
                searches={recentSearches}
                isLoading={recentSearchesIsLoading}
                title="Popular Searches"
                handleRecommendationsPressed={handleRecommendationsPressed}
              />
              <RecommendationContainer
                searches={JSON.parse(
                  localStorage.getItem(localStorageKey) ?? "[]"
                )}
                isLoading={recentSearchesIsLoading}
                title="Your Recent Searches"
                handleRecommendationsPressed={handleRecommendationsPressed}
              />
            </div>
          )}
          {detailsData && (
            <TrafficContainer
              location={selectedLocation?.location}
              time={time}
              image={detailsData?.image || ""}
            />
          )}
        </div>
      </ErrorComponent>
    </div>
  );
}
