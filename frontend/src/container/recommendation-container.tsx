import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSearches } from "@/lib/types";
import React, { Fragment } from "react";
import { Skeleton } from "../components/ui/skeleton";

interface RecommendationContainer extends React.ComponentProps<typeof Card> {
  className?: string;
  searches?: RecentSearches[] | string[];
  isLoading: boolean;
  handleRecommendationsPressed: (date: string) => void;
  title: string;
}

export function RecommendationContainer({
  className,
  searches,
  isLoading,
  handleRecommendationsPressed,
  title,
  ...props
}: RecommendationContainer) {
  const formatDate = (date: string) => {
    const currentDate = new Date(date);
    return `${currentDate.toLocaleDateString()}, ${currentDate.toLocaleTimeString()}`;
  };

  return (
    <Card
      className={cn(
        "w-[650px] h-[20rem] md:min-w-12 overflow-scroll",
        className
      )}
      {...props}
    >
      {searches ? (
        <Fragment>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {searches.length ? (
              searches?.map((item, index) => {
                const date =
                  typeof item === "string" ? item : item.dateSearched;

                return (
                  <Button
                    key={index}
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => handleRecommendationsPressed(date)}
                  >
                    {formatDate(date)}
                  </Button>
                );
              })
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
