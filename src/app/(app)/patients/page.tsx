
'use client';

import { useState, useMemo } from 'react';
import {
  FilePlus,
  Search,
  Upload,
  Printer,
  MoreVertical,
  FlaskConical,
  Pill,
  DollarSign,
  Phone,
  User,
  Clock,
  ChevronDown,
  Filter,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

// --- MOCK DATA AND TYPES ---

const mockPatients = [
  {
    mrn: 'TZ-2025-1101',
    name: 'Amina Hassan',
    dob: '1997-03-15',
    sex: 'F',
    age: 28,
    bloodType: 'O+',
    photo: 'https://picsum.photos/seed/patient1/100/100',
    phone: '+255 784 123 456',
    status: 'Labs',
    doctor: 'Dr. Juma',
    waitTime: 12,
    criticalAlert: 'K+ 6.2 (Critical)',
    lastAction: 'Sample Collected',
    lastActionTimestamp: '09:25',
    encounterType: 'OPD',
    timeline: [
      { step: 'Registered', time: '09:00', by: 'Fatuma', status: 'completed' },
      { step: 'Vitals', time: '09:15', by: 'Nurse Akida', status: 'completed', details: 'BP 140/90, Temp 38.1°C' },
      { step: 'Labs Ordered', time: '09:20', by: 'Dr. Juma', status: 'completed', details: 'CBC, Malaria RDT' },
      { step: 'Sample Collected', time: '09:25', by: 'Lab Tech Ali', status: 'processing' },
      { step: 'Results Ready', time: '09:45', by: 'Lab System', status: 'pending', details: 'Hb 9.8, Malaria (+), K+ 6.2' },
      { step: 'e-Prescription', time: '09:52', by: 'Dr. Juma', status: 'pending', details: 'Artemether 80mg, Calcium Gluconate' },
      { step: 'Pharmacy', time: null, by: 'Pharmacist', status: 'pending' },
      { step: 'Billing', time: null, by: 'Reception', status: 'pending', details: 'TZS 28,000' },
      { step: 'Discharged', time: null, by: 'Reception', status: 'pending' },
    ],
  },
  {
    mrn: 'TZ-2025-1102',
    name: 'John Williams',
    dob: '1982-08-25',
    sex: 'M',
    age: 42,
    bloodType: 'A-',
    photo: 'https://picsum.photos/seed/patient2/100/100',
    phone: '+255 688 987 654',
    status: 'In Progress',
    doctor: 'Dr. Evelyn',
    waitTime: 5,
    criticalAlert: null,
    lastAction: 'Vitals Taken',
    lastActionTimestamp: '10:05',
    encounterType: 'OPD',
    timeline: [
        { step: 'Registered', time: '10:00', by: 'Fatuma', status: 'completed' },
        { step: 'Vitals', time: '10:05', by: 'Nurse Akida', status: 'processing' },
    ]
  },
    {
    mrn: 'TZ-2025-1103',
    name: 'Maria Sanchez',
    dob: '2001-01-20',
    sex: 'F',
    age: 24,
    bloodType: 'B+',
    photo: 'https://picsum.photos/seed/patient3/100/100',
    phone: '+255 715 111 222',
    status: 'Queue',
    doctor: 'Dr. Juma',
    waitTime: 2,
    criticalAlert: null,
    lastAction: 'Registered',
    lastActionTimestamp: '10:10',
    encounterType: 'OPD',
    timeline: [
        { step: 'Registered', time: '10:10', by: 'Fatuma', status: 'processing' },
    ]
  },
];

const kanbanColumns = ['Queue', 'In Progress', 'Labs', 'Pharmacy', 'Done'];

type Patient = (typeof mockPatients)[0];

const getBorderColor = (patient: Patient) => {
  if (patient.criticalAlert) return 'border-red-500';
  if (patient.waitTime > 30) return 'border-yellow-500';
  return 'border-green-500';
};

// --- COMPONENTS ---

function PatientCard({ patient, onSelect }: { patient: Patient, onSelect: (p: Patient) => void }) {
  return (
    <Card className={cn("mb-4 cursor-pointer hover:shadow-lg", getBorderColor(patient), "border-l-4")} onClick={() => onSelect(patient)}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="font-bold text-sm">{patient.name}</div>
          {patient.criticalAlert && <Badge variant="destructive" className="text-xs">CRITICAL</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">MRN: {patient.mrn} | {patient.age}{patient.sex} | {patient.bloodType}</p>
        <div className="flex justify-between items-center mt-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>Wait: {patient.waitTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="size-3" />
            <span>{patient.doctor}</span>
          </div>
        </div>
        {patient.criticalAlert && <p className="text-xs text-red-500 font-semibold mt-1">{patient.criticalAlert}</p>}
         <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="h-7 text-xs w-full">Open</Button>
            <Button size="sm" variant="secondary" className="h-7 text-xs w-full"><Phone className="size-3 mr-1"/>Call</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SelectedPatientTimeline({ patient }: { patient: Patient | null }) {
    if (!patient) return null;

    return (
        <Card className="fixed bottom-0 left-0 right-0 z-20 w-full rounded-t-lg border-t-4 border-primary shadow-2xl">
            <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                         <Image data-ai-hint="person face" src={patient.photo} alt={patient.name} width={50} height={50} className="rounded-full border-2 border-primary"/>
                        <div>
                            <CardTitle className="text-xl font-headline">{patient.name}</CardTitle>
                            <CardDescription>MRN: {patient.mrn} | {patient.age}{patient.sex} | Blood Type: {patient.bloodType}</CardDescription>
                        </div>
                    </div>
                     <div className="text-right">
                        <p className="text-sm">Assigned: <span className="font-semibold">{patient.doctor}</span></p>
                        <p className="text-sm text-muted-foreground">Arrived: 09:00 | Wait: {patient.waitTime} min</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Separator className="my-2"/>
                <div className="mb-2">
                    <h4 className="font-semibold text-sm mb-2">Chain Timeline</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                        {patient.timeline.map(item => (
                            <div key={item.step} className="flex items-center gap-1 cursor-pointer">
                                {item.status === 'completed' && <Badge className="bg-green-500 size-4 p-0"><Check className="size-3"/></Badge>}
                                {item.status === 'processing' && <Badge className="bg-yellow-500 size-4 p-0 animate-pulse"></Badge>}
                                {item.status === 'pending' && <Badge variant="outline" className="size-4 p-0"></Badge>}
                                <span className={cn(item.status === 'pending' ? 'text-muted-foreground' : 'font-medium')}>{item.time ? `${item.time} -` : ''} {item.step}</span>
                                {item.details?.includes('Critical') && <Badge variant="destructive" className="ml-1">⚠️</Badge>}
                            </div>
                        ))}
                    </div>
                </div>
                <Separator className="my-2"/>
                <div>
                     <h4 className="font-semibold text-sm mb-2">Role-Based Actions</h4>
                     <div className="flex flex-wrap gap-2">
                         <Button size="sm" variant="outline"><User className="mr-1"/>Open Chart</Button>
                         <Button size="sm" variant="outline"><FlaskConical className="mr-1"/>View Labs</Button>
                         <Button size="sm" variant="outline"><Pill className="mr-1"/>e-Prescribe</Button>
                         <Button size="sm" variant="outline"><DollarSign className="mr-1"/>Generate Bill</Button>
                         <Button size="sm" variant="secondary"><Printer className="mr-1"/>Print Summary</Button>
                         <Button size="sm" variant="secondary"><Phone className="mr-1"/>SMS Patient</Button>
                     </div>
                </div>
            </CardContent>
        </Card>
    );
}

function NewPatientModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Patient Registration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="size-24 rounded-full bg-muted flex items-center justify-center">
                <Upload className="text-muted-foreground"/>
            </div>
            <Button variant="outline" size="sm">Upload Photo</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="firstName">First Name</Label><Input id="firstName"/></div>
            <div className="space-y-1"><Label htmlFor="lastName">Last Name</Label><Input id="lastName"/></div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="dob">Date of Birth</Label><Input id="dob" type="date"/></div>
            <div className="space-y-1"><Label htmlFor="phone">Phone</Label><Input id="phone" placeholder="+255..."/></div>
          </div>
          <div className="space-y-1"><Label htmlFor="nationalId">National ID</Label><Input id="nationalId"/></div>
        </div>
        <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => onOpenChange(false)}>Register & Print Wristband</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


// --- MAIN PAGE COMPONENT ---

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(mockPatients[0]);
  const [isRegistering, setIsRegistering] = useState(false);

  const patientsByColumn = useMemo(() => {
    return kanbanColumns.reduce((acc, col) => {
      acc[col] = mockPatients.filter(p => p.status === col);
      return acc;
    }, {} as Record<string, Patient[]>);
  }, [mockPatients]);

  return (
    <div className="flex h-screen w-full bg-muted/40">
        {/* Filters Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-4 text-sm">
                <div className="space-y-2">
                    <Label>Encounter Type</Label>
                    <div className="flex items-center space-x-2"><Checkbox id="opd" defaultChecked/><Label htmlFor="opd">OPD (12)</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="emergency"/><Label htmlFor="emergency">Emergency (3)</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="inpatient"/><Label htmlFor="inpatient">Inpatient (1)</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="discharged"/><Label htmlFor="discharged">Discharged (34)</Label></div>
                </div>
                <Separator/>
                <div className="space-y-2">
                    <Label>Date</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">Today <ChevronDown className="size-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>This Week</DropdownMenuItem>
                            <DropdownMenuItem>This Month</DropdownMenuItem>
                            <DropdownMenuItem>Custom Range</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                 <Separator/>
                 <div className="space-y-2">
                    <Label>Quick Filters</Label>
                    <div className="flex items-center space-x-2"><Checkbox id="critical"/><Label htmlFor="critical">Critical Alerts (1)</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="waiting"/><Label htmlFor="waiting">Waiting >30 min (0)</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox id="labs-pending"/><Label htmlFor="labs-pending">Labs Pending (1)</Label></div>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-headline text-xl font-bold">Patients</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Global Search (MRN, Name...)" className="pl-8" />
                    </div>
                    <Button onClick={() => setIsRegistering(true)}>
                        <FilePlus className="mr-2 size-4" />
                        New Patient
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-x-auto p-4">
                <div className="grid grid-cols-5 gap-4 min-w-[1200px]">
                    {kanbanColumns.map(col => (
                        <div key={col} className="bg-muted rounded-lg p-2">
                            <h3 className="font-semibold text-sm px-2 py-1">{col} ({patientsByColumn[col]?.length || 0})</h3>
                            <div className="mt-2 space-y-2 h-[calc(100vh-250px)] overflow-y-auto">
                                {patientsByColumn[col]?.map(p => (
                                    <PatientCard key={p.mrn} patient={p} onSelect={setSelectedPatient} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
        <NewPatientModal open={isRegistering} onOpenChange={setIsRegistering} />
        <SelectedPatientTimeline patient={selectedPatient} />
    </div>
  );
}
