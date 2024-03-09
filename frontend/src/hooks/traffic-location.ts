import { TrafficLocation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  dateTime: string | undefined;
  enabled: boolean;
}

export const useTrafficLocations = ({ dateTime, enabled }: Props) => {
  const getTrafficLocations = async () => {
    const baseUrl = "http://localhost:3001";
    const trafficLocationUrl = new URL("/api/traffic/locations", baseUrl);
    trafficLocationUrl.searchParams.append("dateTime", dateTime!);

    const res = await fetch(trafficLocationUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));

    return res as TrafficLocation[];
  };

  return useQuery({
    queryFn: getTrafficLocations,
    queryKey: dateTime
      ? ["traffic-locations", dateTime]
      : ["traffic-locations"],
    enabled,
  });
};
