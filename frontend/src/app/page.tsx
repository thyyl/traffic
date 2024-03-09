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
import { RecentSearches, Steps, TrafficLocation } from "@/lib/types";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Home() {
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

  const { data, isLoading, error } = useTrafficLocations({
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
    if (!date || !time) {
      toast({
        title: "Invalid Date/Time",
        description: "Please select a valid date and time",
        variant: "destructive",
      });
      return;
    }

    const [dateSelected] = date?.toISOString().split("T");
    const [timeSelected] = time?.toTimeString().split(" ");

    setSteps(Steps.LOCATION);
    setGetLocationsDateTime(`${dateSelected}T${timeSelected}`);
  };

  const handleRecommendationsPressed = ({
    dateSearched,
    location,
    latitude,
    longitude,
  }: RecentSearches) => {
    setDate(new Date(dateSearched));
    setTime(new Date(dateSearched));

    const [dateSelected, rest] = dateSearched.split("T");
    const [timeSelected] = rest.split(".");

    setSteps(Steps.LOCATION);
    setGetLocationsDateTime(`${dateSelected}T${timeSelected}`);

    setSelectedLocation({
      location,
      latitude,
      longitude,
      weatherForecast: "cloudy",
    });
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
            <div className="flex lg:flex-row flex-col w-full items-center">
              <LocationContainer
                trafficLocations={data}
                isLoading={isLoading || detailsIsLoading}
                setSelectedLocation={setSelectedLocation}
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
