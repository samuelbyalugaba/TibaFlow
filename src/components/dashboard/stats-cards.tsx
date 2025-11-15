import { BedDouble, Clock, FlaskConical, Scissors } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Bed Occupancy",
    value: "85%",
    change: "+2.3% from last month",
    icon: <BedDouble className="size-5 text-muted-foreground" />,
  },
  {
    title: "Avg. ED Wait Time",
    value: "28 min",
    change: "-5% from yesterday",
    icon: <Clock className="size-5 text-muted-foreground" />,
  },
  {
    title: "OR Utilization",
    value: "92%",
    change: "3 upcoming surgeries",
    icon: <Scissors className="size-5 text-muted-foreground" />,
  },
  {
    title: "Avg. Lab TAT",
    value: "4 hours",
    change: "on track",
    icon: <FlaskConical className="size-5 text-muted-foreground" />,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
