'use client';
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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

type Patient = {
  id: string;
  name: string;
  status: string;
  photo: string;
}

export function RecentPatients() {
  const firestore = useFirestore();
  const patientsQuery = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: patients, isLoading } = useCollection<Patient>(patientsQuery);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-headline">Recent Patients</CardTitle>
          <CardDescription>Loading patient movements...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    )
  }

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
            {patients?.slice(0, 5).map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={patient.photo} alt={patient.name} data-ai-hint="person face" />
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
                      patient.status === "Admitted" || patient.status === "In Progress"
                        ? "default"
                        : patient.status === "Discharged" || patient.status === "Done"
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
