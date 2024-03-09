import { RecentSearches, TrafficLocation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useRecentSearches = () => {
  const getRecentSearches = async () => {
    const baseUrl = "http://localhost:3001";
    const recentSearchesUrl = new URL("/api/system/recent-searches", baseUrl);

    const res = await fetch(recentSearchesUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));

    return res as RecentSearches[];
  };

  return useQuery({
    queryFn: getRecentSearches,
    queryKey: ["recent-searches"],
    enabled: true,
  });
};
