import { Clock, UserPlus, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

const triageLevels = {
  "1": { name: "Resuscitation", color: "bg-red-600 text-white" },
  "2": { name: "Emergent", color: "bg-orange-500 text-white" },
  "3": { name: "Urgent", color: "bg-yellow-400 text-black" },
  "4": { name: "Less Urgent", color: "bg-green-500 text-white" },
  "5": { name: "Non-Urgent", color: "bg-blue-500 text-white" },
};

const erPatients = [
  {
    name: "John Smith",
    mrn: "MRN789012",
    triage: "2",
    complaint: "Chest Pain",
    eta: "5 min (Ambulance)",
    status: "Pending",
  },
  {
    name: "Jane Doe",
    mrn: "MRN345678",
    triage: "3",
    complaint: "Broken Arm",
    eta: "Walk-in",
    status: "With Triage Nurse",
  },
  {
    name: "Carlos Garcia",
    mrn: "MRN123987",
    triage: "1",
    complaint: "Unresponsive",
    eta: "Arrived",
    status: "In Trauma Bay 1",
  },
  {
    name: "Aisha Khan",
    mrn: "MRN654321",
    triage: "4",
    complaint: "Sore Throat",
    eta: "Walk-in",
    status: "Waiting Room",
  },
];

export default function EmergencyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Emergency Department
            </h1>
            <p className="text-muted-foreground">
              Real-time ER dashboard and patient tracking.
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2" /> Quick Register
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
              <Clock className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22 min</div>
              <p className="text-xs text-muted-foreground">-3 min from last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients in Waiting</CardTitle>
              <Users className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">3 high priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beds Occupied</CardTitle>
              <BedDouble className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18 / 20</div>
              <p className="text-xs text-muted-foreground">90% capacity</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inbound Ambulances</CardTitle>
              <Ambulance className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">ETA: 5 min, 12 min</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ER Patient Tracker</CardTitle>
            <CardDescription>Live feed of all patients in the emergency department.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Triage Level</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Arrival / ETA</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {erPatients.map((patient) => (
                  <TableRow key={patient.mrn}>
                    <TableCell className="font-medium">{patient.name}<br/><span className="text-xs text-muted-foreground">{patient.mrn}</span></TableCell>
                    <TableCell>
                      <Badge
                        className={cn("text-white", triageLevels[patient.triage as keyof typeof triageLevels].color)}
                      >
                        {triageLevels[patient.triage as keyof typeof triageLevels].name}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.complaint}</TableCell>
                    <TableCell>{patient.eta}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
import { Users, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";
