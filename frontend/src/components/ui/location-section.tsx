import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

interface LocationSection extends React.ComponentProps<typeof Card> {
  className?: string;
  locations: string[];
}

export function LocationSection({
  className,
  locations,
  ...props
}: LocationSection) {
  return (
    <Card
      className={cn(
        "w-[650px] h-[25rem] md:min-w-12 overflow-scroll",
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>Locations Available</CardTitle>
        <CardDescription>
          There is {locations.length} locations available
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {locations.map((location, index) => (
          <Button key={index} variant="outline">
            {location}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
