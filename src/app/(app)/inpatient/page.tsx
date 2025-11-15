
'use client';

import { useState } from 'react';
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
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Task = {
  description: string;
  completed: boolean;
};

type Patient = {
  id: string;
  name: string;
  mrn: string;
  bed: string;
  admissionDate: string;
  dx: string;
  status: 'Stable' | 'Critical' | 'Observation' | 'Discharge Pending' | 'Discharged';
  bedStatus: 'Occupied' | 'Clean' | 'Dirty' | 'Blocked';
  encounterType: 'Inpatient' | 'Discharged';
  tasks?: Task[];
};

const statusColors = {
  Stable: 'bg-green-100 text-green-800',
  Critical: 'bg-red-100 text-red-800 animate-pulse',
  Observation: 'bg-yellow-100 text-yellow-800',
  'Discharge Pending': 'bg-blue-100 text-blue-800',
  'Discharged': 'bg-gray-100 text-gray-800',
};

const bedStatusColors = {
    Occupied: 'text-red-600',
    Clean: 'text-green-600',
    Dirty: 'text-yellow-600',
    Blocked: 'text-gray-500',
}

const wards = [
    { name: 'All Wards', prefix: '' },
    { name: 'Medical-Surgical', prefix: 'MS', totalBeds: 40 },
    { name: 'ICU', prefix: 'ICU', totalBeds: 10 },
    { name: 'Pediatrics', prefix: 'PED', totalBeds: 20 },
    { name: 'Maternity', prefix: 'MAT', totalBeds: 20 },
];

const defaultTasks: Task[] = [
    { description: 'Administer Morning Meds', completed: false },
    { description: 'Check Vitals (Q4H)', completed: false },
    { description: 'Ambulate Patient in Hallway', completed: false },
    { description: 'Change Wound Dressing', completed: false },
    { description: 'Patient/Family Education', completed: false },
];

export default function InpatientPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const patientsCollectionRef = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: allPatients, isLoading } = useCollection<Patient>(patientsCollectionRef);

  const [wardFilter, setWardFilter] = useState('All Wards');
  const [isAdmitting, setIsAdmitting] = useState(false);
  const [admitMrn, setAdmitMrn] = useState('');
  const [admitBed, setAdmitBed] = useState('');

  const [selectedPatientForTasks, setSelectedPatientForTasks] = useState<Patient | null>(null);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [customTask, setCustomTask] = useState('');


  const inpatientPatients = allPatients?.filter(p => p.encounterType === 'Inpatient');

  const displayedPatients = inpatientPatients?.filter(p => {
      if (wardFilter === 'All Wards') return true;
      const selectedWard = wards.find(w => w.name === wardFilter);
      return p.bed?.startsWith(selectedWard?.prefix || '---');
  });

  const wardStats = wards.filter(w => w.totalBeds).map(ward => {
      const occupiedCount = inpatientPatients?.filter(p => p.bed?.startsWith(ward.prefix)).length || 0;
      return {
          ...ward,
          occupancy: (occupiedCount / ward.totalBeds) * 100,
          beds: `${occupiedCount}/${ward.totalBeds}`,
      }
  });

  const totalBeds = wards.reduce((sum, ward) => sum + (ward.totalBeds || 0), 0);
  const totalOccupied = inpatientPatients?.length || 0;
  const overallOccupancy = totalBeds > 0 ? (totalOccupied / totalBeds) * 100 : 0;

  const handleDirectAdmit = () => {
    if (!admitMrn || !admitBed) {
      toast({
        variant: 'destructive',
        title: 'Admission Failed',
        description: 'Patient MRN and Bed Assignment are required.',
      });
      return;
    }
    const patientToAdmit = allPatients?.find(p => p.mrn === admitMrn);
    if (!patientToAdmit) {
      toast({
        variant: 'destructive',
        title: 'Patient Not Found',
        description: `No patient found with MRN: ${admitMrn}. Please register them first.`,
      });
      return;
    }

    const patientDocRef = doc(firestore, 'patients', patientToAdmit.id);
    const updateData = {
        encounterType: 'Inpatient',
        bed: admitBed,
        bedStatus: 'Occupied',
        status: 'Stable',
        admissionDate: new Date().toLocaleDateString('en-US'),
        dx: 'Observation',
    };
    updateDocumentNonBlocking(patientDocRef, updateData);

    toast({
        title: 'Patient Admitted',
        description: `${patientToAdmit.name} has been admitted to bed ${admitBed}.`
    });

    setIsAdmitting(false);
    setAdmitMrn('');
    setAdmitBed('');
  };

  const handleOpenTasks = (patient: Patient) => {
    setSelectedPatientForTasks(patient);
    const patientTasks = patient.tasks && patient.tasks.length > 0 ? patient.tasks : defaultTasks.map(t => ({...t}));
    setCurrentTasks(patientTasks);
  };
  
  const handleTaskChange = (index: number, checked: boolean) => {
      const newTasks = [...currentTasks];
      newTasks[index].completed = checked;
      setCurrentTasks(newTasks);
  };

  const handleAddCustomTask = () => {
      if (customTask.trim()) {
          setCurrentTasks([...currentTasks, { description: customTask, completed: false }]);
          setCustomTask('');
      }
  };

  const handleSaveTasks = () => {
      if (!selectedPatientForTasks) return;
      const patientDocRef = doc(firestore, 'patients', selectedPatientForTasks.id);
      updateDocumentNonBlocking(patientDocRef, { tasks: currentTasks });
      toast({
          title: 'Tasks Updated',
          description: `Tasks for ${selectedPatientForTasks.name} have been saved.`,
      });
      setSelectedPatientForTasks(null);
  };

  const handleDischarge = (patient: Patient) => {
      const patientDocRef = doc(firestore, 'patients', patient.id);
      const updateData = {
          status: 'Discharged',
          encounterType: 'Discharged',
          bedStatus: 'Dirty', // Mark bed for cleaning
      };
      updateDocumentNonBlocking(patientDocRef, updateData);

      toast({
          title: 'Patient Discharged',
          description: `${patient.name} has been discharged. Bed ${patient.bed} is now marked as dirty.`
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
                <Button variant="outline">
                  <Filter className="mr-2" /> {wardFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {wards.map((w) => (
                  <DropdownMenuItem key={w.name} onSelect={() => setWardFilter(w.name)}>{w.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isAdmitting} onOpenChange={setIsAdmitting}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2" /> Direct Admit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Direct Admit Patient</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                        <Label htmlFor="mrn">Patient MRN</Label>
                        <Input id="mrn" placeholder="Search by MRN..." value={admitMrn} onChange={(e) => setAdmitMrn(e.target.value)} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="bed">Assign Bed</Label>
                        <Input id="bed" placeholder="e.g., MS-304B" value={admitBed} onChange={(e) => setAdmitBed(e.target.value)} />
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDirectAdmit}>
                        <PlusCircle className="mr-2" /> Admit Patient
                    </Button>
                 </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Bed Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(overallOccupancy)}%</div>
              <p className="text-xs text-muted-foreground">
                {totalOccupied} of {totalBeds} beds occupied
              </p>
              <Progress value={overallOccupancy} className="mt-2" />
            </CardContent>
          </Card>
          {wardStats.map((ward) => (
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
              {wardFilter === 'All Wards' ? 'Real-time view of all inpatient beds and assigned patients.' : `Showing patients for: ${wardFilter}`}
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
                {displayedPatients?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No patients in this unit.
                        </TableCell>
                    </TableRow>
                )}
                {displayedPatients?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Bed className={cn("size-4", p.bedStatus ? bedStatusColors[p.bedStatus] : 'text-gray-400')} />
                        {p.bed || 'N/A'}
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
                            <Dialog open={selectedPatientForTasks?.id === p.id} onOpenChange={(open) => !open && setSelectedPatientForTasks(null)}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => handleOpenTasks(p)}>
                                        <ClipboardList className="mr-1 size-4" /> Tasks
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Nursing Tasks for {selectedPatientForTasks?.name}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-2 py-4">
                                        {currentTasks.map((task, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Checkbox id={`task-${index}`} checked={task.completed} onCheckedChange={(checked) => handleTaskChange(index, !!checked)} />
                                                <Label htmlFor={`task-${index}`}>{task.description}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex w-full gap-2">
                                        <Input placeholder="Add custom task..." value={customTask} onChange={(e) => setCustomTask(e.target.value)} />
                                        <Button onClick={handleAddCustomTask}>Add</Button>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">Cancel</Button>
                                        </DialogClose>
                                        <Button onClick={handleSaveTasks}>Save Tasks</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                             <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <LogOut className="mr-1 size-4" /> Discharge
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Discharge {p.name}?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will discharge the patient from their bed and mark it for cleaning. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDischarge(p)}>Confirm Discharge</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
