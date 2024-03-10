import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrafficLocation } from "@/lib/types";
import { Fragment } from "react";
import { Skeleton } from "../components/ui/skeleton";

interface LocationContainer extends React.ComponentProps<typeof Card> {
  className?: string;
  trafficLocations?: TrafficLocation[];
  isLoading: boolean;
  handleLocationSelected: (item: TrafficLocation) => void;
}

export function LocationContainer({
  className,
  trafficLocations,
  isLoading,
  handleLocationSelected,
  ...props
}: LocationContainer) {
  return (
    <Card
      className={cn(
        "w-[650px] h-[25rem] md:min-w-12 overflow-scroll bg-black",
        className
      )}
      {...props}
    >
      {trafficLocations ? (
        <Fragment>
          <CardHeader>
            <CardTitle>Locations Available</CardTitle>
            <CardDescription>
              There is {trafficLocations?.length} locations available
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {trafficLocations?.map((item, index) => (
              <Button
                key={index + item.location}
                variant="outline"
                disabled={isLoading}
                onClick={() => handleLocationSelected(item)}
              >
                {item.location}
              </Button>
            ))}
          </CardContent>
        </Fragment>
      ) : (
        <Skeleton className="w-[650px] h-[25rem] md:min-w-12" />
      )}
    </Card>
  );
}
