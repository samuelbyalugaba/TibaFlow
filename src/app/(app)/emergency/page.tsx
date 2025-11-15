'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  UserPlus,
  Ambulance,
  HeartPulse,
  Users,
  BedDouble,
  Rabbit,
  ClipboardList,
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
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, addDoc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const triageLevels = {
  '1': { name: 'ESI 1 - Resuscitation', color: 'bg-red-600 text-white' },
  '2': { name: 'ESI 2 - Emergent', color: 'bg-orange-500 text-white' },
  '3': { name: 'ESI 3 - Urgent', color: 'bg-yellow-400 text-black' },
  '4': { name: 'ESI 4 - Less Urgent', color: 'bg-green-500 text-white' },
  '5': { name: 'ESI 5 - Non-Urgent', color: 'bg-blue-500 text-white' },
};

type Patient = {
  id: string;
  name: string;
  mrn: string;
  triage: string;
  complaint: string;
  doorToDoc: string;
  location: string;
  encounterType: string;
  timeline: any[];
  dob: string;
  sex: string;
  age: number;
  photo: string;
  phone: string;
  status: string;
  doctor: string;
  waitTime: number;
  criticalAlert: string | null;
  lastAction: string;
  lastActionTimestamp: string;
};

type VitalSign = {
  patientId: string;
  dateTime: string;
  type: string;
  value: string;
  unit: string;
}


export default function EmergencyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  
  const patientsCollectionRef = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: allPatients, isLoading } = useCollection<Patient>(patientsCollectionRef);
  
  const erPatients = allPatients?.filter(p => p.encounterType === 'Emergency');

  const [isRegistering, setIsRegistering] = useState(false);
  const [fastTrackFilter, setFastTrackFilter] = useState(false);
  
  const [vitalsPatient, setVitalsPatient] = useState<Patient | null>(null);
  const [vitalsData, setVitalsData] = useState({ bp: '', hr: '', spo2: '', note: '' });


  const handleSaveVitals = () => {
    if (!vitalsPatient || !user) return;

    const vitalsCollectionRef = collection(firestore, `patients/${vitalsPatient.id}/vitalSigns`);
    const now = new Date().toISOString();

    const vitalSignsToSave: Omit<VitalSign, 'id'>[] = [
        { patientId: vitalsPatient.id, dateTime: now, type: 'Blood Pressure', value: vitalsData.bp, unit: 'mmHg' },
        { patientId: vitalsPatient.id, dateTime: now, type: 'Heart Rate', value: vitalsData.hr, unit: 'bpm' },
        { patientId: vitalsPatient.id, dateTime: now, type: 'SpO2', value: vitalsData.spo2, unit: '%' },
    ];
    
    vitalsToSave.forEach(vital => {
        if (vital.value) {
            addDocumentNonBlocking(vitalsCollectionRef, vital);
        }
    });

    toast({
      title: "Vitals Saved",
      description: `Vitals and note have been saved for ${vitalsPatient.name}.`,
    });
    setVitalsPatient(null);
  };

  const handleRegisterPatient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const complaint = formData.get('complaint') as string;
    const triage = formData.get('triage') as string;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
    
    const newPatient: Partial<Patient> = {
        name,
        complaint,
        triage,
        mrn: `EMG-${Math.floor(Math.random() * 9000) + 1000}`,
        doorToDoc: '0 min',
        location: 'Waiting Room',
        encounterType: 'Emergency',
        status: 'Queue',
        lastAction: 'Registered',
        lastActionTimestamp: currentTime,
        timeline: [
            { step: 'Registered', time: currentTime, by: user?.email || 'Admin', status: 'completed' },
            { step: 'Vitals', time: null, by: 'Nurse', status: 'pending' },
            { step: 'Doctor', time: null, by: 'Doctor', status: 'pending' },
        ],
        photo: `https://picsum.photos/seed/${Math.random()}/100/100`,
        doctor: 'Dr. Ayo',
        waitTime: 0,
        age: 30, // Default age
        sex: 'U', // Default sex
    };

    addDocumentNonBlocking(patientsCollectionRef, newPatient);
    
    toast({
      title: "Patient Registered",
      description: `${name} has been added to the triage board.`,
    });
    setIsRegistering(false);
  };

  const displayedPatients = erPatients?.filter(p => fastTrackFilter ? ['4', '5'].includes(p.triage) : true);

  const avgDoorToDoc = erPatients ? Math.round(erPatients.reduce((acc, p) => acc + (parseInt(p.doorToDoc) || 0), 0) / erPatients.length) || 0 : 0;

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><p>Loading Emergency Dashboard...</p></div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Emergency Department
            </h1>
            <p className="text-muted-foreground">
              Fast triage and time-critical patient care dashboard.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant={fastTrackFilter ? "default" : "outline"} onClick={() => setFastTrackFilter(!fastTrackFilter)}>
              <Rabbit className="mr-2" /> {fastTrackFilter ? "Show All" : "Fast-Track Queue"}
            </Button>
            <Dialog open={isRegistering} onOpenChange={setIsRegistering}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2" /> Quick Register
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quick Register ER Patient</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegisterPatient}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Patient Name</Label>
                      <Input id="name" name="name" placeholder="e.g., John Doe" required />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="complaint">Chief Complaint</Label>
                      <Input id="complaint" name="complaint" placeholder="e.g., Chest Pain" required />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="triage">Triage (ESI)</Label>
                       <Select name="triage" defaultValue="3" required>
                        <SelectTrigger id="triage">
                          <SelectValue placeholder="Select ESI Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(triageLevels).map(([level, {name}]) => (
                             <SelectItem key={level} value={level}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Register Patient</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Door-to-Doctor
              </CardTitle>
              <Clock className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDoorToDoc} min</div>
              <p className="text-xs text-muted-foreground">
                Based on current patients
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Patients in Waiting
              </CardTitle>
              <Users className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{erPatients?.filter(p => p.location === 'Waiting Room').length || 0}</div>
              <p className="text-xs text-muted-foreground">{erPatients?.filter(p => p.location === 'Waiting Room' && ['1', '2'].includes(p.triage)).length || 0} high priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Observation Unit
              </CardTitle>
              <BedDouble className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1 / 8</div>
              <p className="text-xs text-muted-foreground">13% capacity</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inbound Ambulances
              </CardTitle>
              <Ambulance className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No active ETAs</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Triage Board</CardTitle>
            <CardDescription>
              {fastTrackFilter ? "Showing only fast-track patients (ESI 4 & 5)." : "Live feed of all patients in the emergency department."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Triage (ESI)</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Door-to-Doc</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPatients?.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className={
                      patient.triage === '1' ? 'bg-red-50' : ''
                    }
                  >
                    <TableCell className="font-medium">
                      {patient.name}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {patient.mrn}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'font-bold',
                          triageLevels[
                            patient.triage as keyof typeof triageLevels
                          ]?.color
                        )}
                      >
                        {
                          triageLevels[
                            patient.triage as keyof typeof triageLevels
                          ]?.name
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.complaint}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        {patient.doorToDoc}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.location}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog onOpenChange={(open) => !open && setVitalsPatient(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="mr-2" onClick={() => setVitalsPatient(patient)}>
                            <HeartPulse className="mr-1 size-4" /> Vitals/Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Quick Vitals & Note for {vitalsPatient?.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-3 gap-4 py-4">
                            <div>
                              <Label htmlFor="bp">BP (SYS/DIA)</Label>
                              <Input id="bp" placeholder="e.g., 120/80" value={vitalsData.bp} onChange={(e) => setVitalsData({...vitalsData, bp: e.target.value})} />
                            </div>
                            <div>
                              <Label htmlFor="hr">HR (bpm)</Label>
                              <Input id="hr" placeholder="e.g., 75" value={vitalsData.hr} onChange={(e) => setVitalsData({...vitalsData, hr: e.target.value})} />
                            </div>
                            <div>
                              <Label htmlFor="spo2">SpO2 (%)</Label>
                              <Input id="spo2" placeholder="e.g., 98" value={vitalsData.spo2} onChange={(e) => setVitalsData({...vitalsData, spo2: e.target.value})} />
                            </div>
                            <div className="col-span-3">
                              <Label htmlFor="note">Triage Note</Label>
                              <Textarea
                                id="note"
                                placeholder="Enter brief note..."
                                value={vitalsData.note} 
                                onChange={(e) => setVitalsData({...vitalsData, note: e.target.value})}
                              />
                            </div>
                          </div>
                           <DialogFooter>
                            <DialogClose asChild>
                              <Button onClick={handleSaveVitals}>
                                Save Vitals & Note
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="secondary" size="sm" onClick={() => router.push('/patients')}>
                        <ClipboardList className="mr-1 size-4" /> Details
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
