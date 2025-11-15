'use client';

import {
  Bed,
  Filter,
  UserPlus,
  ClipboardList,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


type Patient = {
  id: string;
  name: string;
  mrn: string;
  bed: string;
  admissionDate: string;
  dx: string;
  status: string;
  bedStatus: 'Occupied' | 'Clean' | 'Dirty' | 'Blocked';
  encounterType: string;
};

const statusColors = {
  Stable: 'bg-green-100 text-green-800',
  Critical: 'bg-red-100 text-red-800 animate-pulse',
  Observation: 'bg-yellow-100 text-yellow-800',
  'Discharge Pending': 'bg-blue-100 text-blue-800',
};

const bedStatusColors = {
    Occupied: 'text-red-600',
    Clean: 'text-green-600',
    Dirty: 'text-yellow-600',
    Blocked: 'text-gray-500',
}


export default function InpatientPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const patientsCollectionRef = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: allPatients, isLoading } = useCollection<Patient>(patientsCollectionRef);

  const patients = allPatients?.filter(p => p.encounterType === 'Inpatient');

  const wards = [
    { name: 'Medical-Surgical', occupancy: patients?.filter(p => p.bed?.startsWith('MS')).length / 40 * 100 || 0, beds: `${patients?.filter(p => p.bed?.startsWith('MS')).length || 0}/40` },
    { name: 'ICU', occupancy: patients?.filter(p => p.bed?.startsWith('ICU')).length / 10 * 100 || 0, beds: `${patients?.filter(p => p.bed?.startsWith('ICU')).length || 0}/10` },
    { name: 'Pediatrics', occupancy: patients?.filter(p => p.bed?.startsWith('PED')).length / 20 * 100 || 0, beds: `${patients?.filter(p => p.bed?.startsWith('PED')).length || 0}/20` },
    { name: 'Maternity', occupancy: patients?.filter(p => p.bed?.startsWith('MAT')).length / 20 * 100 || 0, beds: `${patients?.filter(p => p.bed?.startsWith('MAT')).length || 0}/20` },
  ];

  const handlePlaceholderClick = (feature: string) => {
    toast({
        title: "Feature not implemented",
        description: `${feature} is coming soon.`,
    });
  };
  
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><p>Loading Inpatient Dashboard...</p></div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Inpatient Management
            </h1>
            <p className="text-muted-foreground">
              Oversee bed assignments, nursing tasks, and patient flow.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" onClick={() => handlePlaceholderClick('Filter by Ward')}>
                  <Filter className="mr-2" /> Filter by Ward
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {wards.map((w) => (
                  <DropdownMenuItem key={w.name} onClick={() => handlePlaceholderClick('Filter by Ward')}>{w.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2" /> Direct Admit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admit Patient</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                        <Label htmlFor="mrn">Patient MRN</Label>
                        <Input id="mrn" placeholder="Search by MRN..." />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="bed">Assign Bed</Label>
                        <Input id="bed" placeholder="e.g., MS-304B" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="nurse">Assign Nurse</Label>
                        <Input id="nurse" placeholder="Search nurse name..." />
                    </div>
                </div>
                 <Button className="w-full" onClick={() => handlePlaceholderClick('Admit Patient')}>
                    <PlusCircle className="mr-2" /> Admit Patient
                  </Button>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Bed Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(wards.reduce((acc, w) => acc + w.occupancy, 0) / wards.length) || 0}%</div>
              <p className="text-xs text-muted-foreground">
                {patients?.length || 0} of 90 beds occupied
              </p>
              <Progress value={Math.round(wards.reduce((acc, w) => acc + w.occupancy, 0) / wards.length) || 0} className="mt-2" />
            </CardContent>
          </Card>
          {wards.map((ward) => (
            <Card key={ward.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {ward.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(ward.occupancy)}%</div>
                <p className="text-xs text-muted-foreground">
                  {ward.beds} beds occupied
                </p>
                <Progress value={ward.occupancy} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bed Board & Patient Census</CardTitle>
            <CardDescription>
              Real-time view of all inpatient beds and assigned patients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bed</TableHead>
                  <TableHead>Patient (MRN)</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Working Diagnosis</TableHead>
                  <TableHead>Patient Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Bed className={cn("size-4", bedStatusColors[p.bedStatus as keyof typeof bedStatusColors])} />
                        {p.bed}
                      </div>
                       <div className="text-xs text-muted-foreground">{p.bedStatus}</div>
                    </TableCell>
                    <TableCell>
                      {p.name ? (
                        <>
                          <div>{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.mrn}
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Unoccupied</span>
                      )}
                    </TableCell>
                    <TableCell>{p.admissionDate}</TableCell>
                    <TableCell>{p.dx}</TableCell>
                    <TableCell>
                      {p.status && (
                        <Badge
                          className={cn(
                            statusColors[p.status as keyof typeof statusColors]
                          )}
                        >
                          {p.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                       {p.name && (
                         <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePlaceholderClick('Tasks')}>
                                <ClipboardList className="mr-1 size-4" /> Tasks
                            </Button>
                             <Button variant="outline" size="sm" onClick={() => handlePlaceholderClick('Discharge')}>
                                <LogOut className="mr-1 size-4" /> Discharge
                            </Button>
                         </div>
                       )}
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
