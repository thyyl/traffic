import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSearches } from "@/lib/types";
import React, { Fragment } from "react";
import { Skeleton } from "./skeleton";

interface RecommendationSection extends React.ComponentProps<typeof Card> {
  className?: string;
  searches?: RecentSearches[];
  isLoading: boolean;
  handleRecommendationsPressed: (item: RecentSearches) => void;
}

export function RecommendationSection({
  className,
  searches,
  isLoading,
  handleRecommendationsPressed,
  ...props
}: RecommendationSection) {
  const formatLocation = (location: string) => {
    return location.split(",")[0];
  };

  const formatDate = (date: string) => {
    const currentDate = new Date(date);
    return `${currentDate.toLocaleDateString()}, ${currentDate.toLocaleTimeString()}`;
  };

  return (
    <Card
      className={cn(
        "w-[650px] h-[25rem] md:min-w-12 overflow-scroll",
        className
      )}
      {...props}
    >
      {searches ? (
        <Fragment>
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {searches.length ? (
              searches?.map((item, index) => (
                <Button
                  key={index + item.location}
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => handleRecommendationsPressed(item)}
                >
                  {formatLocation(item.location)}, at{" "}
                  {formatDate(item.dateSearched)}
                </Button>
              ))
            ) : (
              <p className="text-slate-100">
                No recent searches available for now. Please start searching!
              </p>
            )}
          </CardContent>
        </Fragment>
      ) : (
        <Skeleton className="w-[650px] h-[25rem] md:min-w-12" />
      )}
    </Card>
  );
}
