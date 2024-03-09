import { LocationDetails } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  dateTime: string | undefined;
  longitude: number | undefined;
  latitude: number | undefined;
  location: string | undefined;
  enabled: boolean;
}

export const useLocationDetails = ({
  dateTime,
  enabled,
  latitude,
  longitude,
  location,
}: Props) => {
  const getLocationDetails = async () => {
    const baseUrl = "http://localhost:3001";
    const trafficLocationUrl = new URL(
      "/api/traffic/location-details",
      baseUrl
    );
    trafficLocationUrl.searchParams.append("dateTime", dateTime!);
    trafficLocationUrl.searchParams.append("latitude", latitude!.toString());
    trafficLocationUrl.searchParams.append("longitude", longitude!.toString());
    trafficLocationUrl.searchParams.append("location", location!);

    const res = await fetch(trafficLocationUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));

    return res as LocationDetails;
  };

  return useQuery({
    queryFn: getLocationDetails,
    queryKey:
      !!latitude && !!longitude
        ? ["location-details", `${latitude},${longitude}`]
        : ["locations-details"],
    enabled,
  });
};
