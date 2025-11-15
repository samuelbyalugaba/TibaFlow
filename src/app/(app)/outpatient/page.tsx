
'use client';

import { useRouter } from 'next/navigation';
import {
  FilePlus,
  Search,
  Filter,
  User,
  FlaskConical,
  Pill,
  DollarSign,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';


type Patient = {
    id: string;
    mrn: string;
    name: string;
    doctor: string;
    doctorId: string;
    status: string;
    lastActionTimestamp: string;
    encounterType: string;
};

type Doctor = {
    id: string;
    firstName: string;
    lastName: string;
};

const statusColors: { [key: string]: string } = {
  'Queue': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Labs': 'bg-blue-100 text-blue-800',
  'Pharmacy': 'bg-orange-100 text-orange-800',
  'Done': 'bg-green-100 text-green-800',
  'Discharged': 'bg-gray-100 text-gray-800',
};

export default function OutpatientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const { data: allPatients, isLoading: loadingPatients } = useCollection<Patient>(
    useMemoFirebase(() => collection(firestore, 'patients'), [firestore])
  );

  const { data: doctors, isLoading: loadingDoctors } = useCollection<Doctor>(
    useMemoFirebase(() => collection(firestore, 'doctors'), [firestore])
  );

  const outpatientQueue = allPatients
    ?.filter(p => p.encounterType === 'OPD')
    .map(patient => {
        const assignedDoctor = doctors?.find(d => d.id === patient.doctorId);
        return {
            ...patient,
            doctorName: assignedDoctor ? `Dr. ${assignedDoctor.firstName} ${assignedDoctor.lastName}` : (patient.doctor || 'Unassigned'),
        };
    });

  const handlePlaceholderClick = (feature: string) => {
    toast({
      title: 'Feature Not Implemented',
      description: `${feature} functionality is coming soon.`,
    });
  };

  const isLoading = loadingPatients || loadingDoctors;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading Outpatient Department...</p>
      </div>
    );
  }

  const getStatusCount = (status: string) => outpatientQueue?.filter(p => p.status === status).length || 0;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Outpatient Department
          </h1>
          <p className="text-muted-foreground">
            Manage the entire patient journey from check-in to discharge.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Queue</CardTitle>
              <User className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('Queue')}</div>
              <p className="text-xs text-muted-foreground">Waiting for doctor</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Labs Pending</CardTitle>
              <FlaskConical className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('Labs')}</div>
              <p className="text-xs text-muted-foreground">Awaiting results</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pharmacy Queue</CardTitle>
              <Pill className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('Pharmacy')}</div>
              <p className="text-xs text-muted-foreground">Awaiting pickup</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready for Discharge</CardTitle>
              <DollarSign className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getStatusCount('Done')}</div>
              <p className="text-xs text-muted-foreground">Pending billing</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Visit Time</CardTitle>
              <User className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-- min</div>
              <p className="text-xs text-muted-foreground">Not yet calculated</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Journey Board</CardTitle>
                <CardDescription>
                  Real-time status of all outpatients for today.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by MRN or Name..."
                    className="pl-8 sm:w-[300px]"
                    onChange={() => handlePlaceholderClick('Search')}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" onClick={() => handlePlaceholderClick('Filter')}>
                      <Filter className="mr-2" /> Filter by Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    {Object.keys(statusColors).map((status) => (
                      <DropdownMenuItem key={status} onClick={() => handlePlaceholderClick('Filter')}>{status}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient (MRN)</TableHead>
                  <TableHead>Assigned Doctor</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outpatientQueue?.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {patient.mrn}
                      </div>
                    </TableCell>
                    <TableCell>{patient.doctorName}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[patient.status as keyof typeof statusColors] || statusColors['Queue']}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.lastActionTimestamp}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" onClick={() => router.push('/patients')}>
                        <ClipboardList className="mr-1 size-4" /> View Details
                      </Button>
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

    