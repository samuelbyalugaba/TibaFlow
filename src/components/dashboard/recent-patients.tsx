import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const patients = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: "https://picsum.photos/seed/2/40/40",
    status: "Admitted",
    admitted: "2024-07-21",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: "https://picsum.photos/seed/3/40/40",
    status: "Discharged",
    admitted: "2024-07-20",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "https://picsum.photos/seed/4/40/40",
    status: "Admitted",
    admitted: "2024-07-19",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "https://picsum.photos/seed/5/40/40",
    status: "Observation",
    admitted: "2024-07-18",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatar: "https://picsum.photos/seed/6/40/40",
    status: "Discharged",
    admitted: "2024-07-17",
  },
];

export function RecentPatients() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Recent Patients</CardTitle>
        <CardDescription>A list of recent patient movements.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                      <AvatarFallback>
                        {patient.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{patient.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      patient.status === "Admitted"
                        ? "default"
                        : patient.status === "Discharged"
                        ? "secondary"
                        : "outline"
                    }
                    className={patient.status === "Admitted" ? "bg-accent text-accent-foreground" : ""}
                  >
                    {patient.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
