'use client';
import { BedDouble, Clock, FlaskConical, Scissors } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

type Patient = {
  id: string;
  encounterType?: string;
  doorToDoc?: string;
};

type Surgery = {
  id: string;
  status: string;
};

type LabOrder = {
  id: string;
  orderDate: string; // Assuming ISO string
  completionDate?: string; // Assuming ISO string
};

const wardsConfig = {
    'Medical-Surgical': 40,
    'ICU': 10,
    'Pediatrics': 20,
    'Maternity': 20,
};
const totalBeds = Object.values(wardsConfig).reduce((acc, val) => acc + val, 0);

export function StatsCards() {
  const firestore = useFirestore();

  const { data: patients, isLoading: loadingPatients } = useCollection<Patient>(
    useMemoFirebase(() => collection(firestore, 'patients'), [firestore])
  );
  
  const { data: surgeries, isLoading: loadingSurgeries } = useCollection<Surgery>(
    useMemoFirebase(() => collection(firestore, 'surgeries'), [firestore])
  );

  const { data: labOrders, isLoading: loadingLabs } = useCollection<LabOrder>(
    useMemoFirebase(() => collection(firestore, 'labOrders'), [firestore])
  );

  const isLoading = loadingPatients || loadingSurgeries || loadingLabs;
  
  // Bed Occupancy
  const occupiedBeds = patients?.filter(p => p.encounterType === 'Inpatient').length || 0;
  const bedOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Avg. ED Wait Time
  const edPatients = patients?.filter(p => p.encounterType === 'Emergency' && p.doorToDoc);
  const avgEDWait = edPatients && edPatients.length > 0
    ? Math.round(edPatients.reduce((acc, p) => acc + (parseInt(p.doorToDoc || '0')), 0) / edPatients.length)
    : 0;

  // OR Utilization
  const activeSurgeries = surgeries?.filter(s => s.status === 'In Progress').length || 0;
  const totalORs = 4; // Assuming 4 operating rooms
  const orUtilization = Math.round((activeSurgeries / totalORs) * 100);

  // Avg. Lab TAT
  const completedLabs = labOrders?.filter(l => l.completionDate);
  const avgLabTAT = completedLabs && completedLabs.length > 0
    ? Math.round(completedLabs.reduce((acc, l) => {
        const start = new Date(l.orderDate).getTime();
        const end = l.completionDate ? new Date(l.completionDate).getTime() : start;
        return acc + (end - start);
      }, 0) / completedLabs.length / (1000 * 60)) // in minutes
    : 0;


  const stats = [
    {
      title: "Bed Occupancy",
      value: isLoading ? "..." : `${bedOccupancy}%`,
      change: `${occupiedBeds} of ${totalBeds} beds`,
      icon: <BedDouble className="size-5 text-muted-foreground" />,
    },
    {
      title: "Avg. ED Wait Time",
      value: isLoading ? "..." : `${avgEDWait} min`,
      change: `${edPatients?.length || 0} active patients`,
      icon: <Clock className="size-5 text-muted-foreground" />,
    },
    {
      title: "OR Utilization",
      value: isLoading ? "..." : `${orUtilization}%`,
      change: `${activeSurgeries} surgeries in progress`,
      icon: <Scissors className="size-5 text-muted-foreground" />,
    },
    {
      title: "Avg. Lab TAT",
      value: isLoading ? "..." : `${avgLabTAT} min`,
      change: "for completed labs",
      icon: <FlaskConical className="size-5 text-muted-foreground" />,
    },
  ];

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
