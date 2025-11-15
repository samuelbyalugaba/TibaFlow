'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Check,
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast"
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


// --- DATA TYPES ---

// Base types from backend.json
type PatientEntity = {
    mrn: string;
    name: string;
    dob: string;
    sex: string;
    age: number;
    bloodType: string;
    photo: string;
    phone: string;
    status: string;
    doctor: string;
    waitTime: number;
    criticalAlert: string | null;
    lastAction: string;
    lastActionTimestamp: string;
    encounterType: string;
    timeline: TimelineStep[];
};

type TimelineStep = {
    step: string;
    time: string | null;
    by: string;
    status: 'completed' | 'processing' | 'pending';
    details?: string;
};

// Firestore document type
type Patient = PatientEntity & { id: string };

const kanbanColumns = ['Queue', 'In Progress', 'Labs', 'Pharmacy', 'Done'];


const getBorderColor = (patient: Patient) => {
  if (patient.criticalAlert) return 'border-red-500';
  if (patient.waitTime > 30) return 'border-yellow-500';
  return 'border-green-500';
};

// --- COMPONENTS ---

function PatientCard({ patient, onSelect }: { patient: Patient, onSelect: (p: Patient) => void }) {
  const { toast } = useToast();

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    toast({ title: `${action} clicked`, description: `Action for ${patient.name}` });
  };
  
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
            <Button size="sm" variant="outline" className="h-7 text-xs w-full" onClick={() => onSelect(patient)}>Open</Button>
            <Button size="sm" variant="secondary" className="h-7 text-xs w-full" onClick={(e) => handleAction(e, 'Call')}><Phone className="size-3 mr-1"/>Call</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SelectedPatientTimeline({ patient, onAction, onSelect }: { patient: Patient | null, onAction: (action: string, newStatus: string) => void, onSelect: (p: Patient | null) => void }) {
    const { toast } = useToast();
    if (!patient) return null;

    const handleGenericAction = (action: string) => {
        toast({
            title: `Action: ${action}`,
            description: `This action for ${patient.name} is a placeholder.`
        });
    };

    const handlePatientUpdate = (newStatus: string, actionText: string) => {
      onAction(actionText, newStatus);
    }

    return (
        <Card className={cn(
            "fixed bottom-0 z-20 w-full rounded-t-lg border-t-4 border-primary bg-background shadow-2xl",
            "md:left-[--sidebar-width] md:w-[calc(100vw_-_var(--sidebar-width))]",
            "peer-data-[state=collapsed]:md:left-[--sidebar-width-icon] peer-data-[state=collapsed]:md:w-[calc(100vw_-_var(--sidebar-width-icon))]",
            "peer-data-[variant=inset]:bottom-auto peer-data-[variant=inset]:md:left-[calc(var(--sidebar-width)_+_0.5rem)] peer-data-[variant=inset]:md:w-[calc(100vw_-_var(--sidebar-width)_-_1rem)] peer-data-[variant=inset]:md:rounded-lg",
            "peer-data-[state=collapsed]:peer-data-[variant=inset]:md:left-[calc(var(--sidebar-width-icon)_+_0.5rem)] peer-data-[state=collapsed]:peer-data-[variant=inset]:md:w-[calc(100vw_-_var(--sidebar-width-icon)_-_1rem)]"
            )}>
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
                        <p className="text-sm text-muted-foreground">Arrived: {patient.timeline[0].time} | Wait: {patient.waitTime} min</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Separator className="my-2"/>
                <div className="mb-2">
                    <h4 className="font-semibold text-sm mb-2">Chain Timeline</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                        {patient.timeline.map((item: TimelineStep) => (
                            <div key={item.step} className="flex items-center gap-1 cursor-pointer" onClick={() => handleGenericAction(`View step: ${item.step}`)}>
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
                         <Button size="sm" variant="outline" onClick={() => handlePatientUpdate('In Progress', 'Start Visit')}><User className="mr-1"/>Start Visit</Button>
                         <Button size="sm" variant="outline" onClick={() => handlePatientUpdate('Labs', 'Order Labs')}><FlaskConical className="mr-1"/>Order Labs</Button>
                         <Button size="sm" variant="outline" onClick={() => handlePatientUpdate('Pharmacy', 'e-Prescribe')}><Pill className="mr-1"/>e-Prescribe</Button>
                         <Button size="sm" variant="outline" onClick={() => handlePatientUpdate('Done', 'Generate Bill')}><DollarSign className="mr-1"/>Generate Bill</Button>
                         <Button size="sm" variant="secondary" onClick={() => handleGenericAction('Print Summary')}><Printer className="mr-1"/>Print Summary</Button>
                         <Button size="sm" variant="secondary" onClick={() => handleGenericAction('SMS Patient')}><Phone className="mr-1"/>SMS Patient</Button>
                     </div>
                </div>
            </CardContent>
        </Card>
    );
}

function NewPatientModal({ open, onOpenChange, onRegister }: { open: boolean, onOpenChange: (open: boolean) => void, onRegister: (patient: Partial<PatientEntity>) => void }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
      name: '',
      dob: '',
      phone: '',
      sex: 'M',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({...prev, [id]: value}));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({...prev, sex: value}));
  };

  const handleRegister = () => {
    if (!formData.name) {
        toast({
            variant: "destructive",
            title: "Registration Error",
            description: "Name is required."
        });
        return;
    }
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
    const newPatient: Partial<PatientEntity> = {
        mrn: `TZ-2025-${Math.floor(Math.random() * 9000) + 1000}`,
        name: formData.name,
        dob: formData.dob,
        sex: formData.sex,
        age: formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : 0,
        bloodType: 'O+',
        photo: `https://picsum.photos/seed/${Math.random()}/100/100`,
        phone: formData.phone,
        status: 'Queue',
        doctor: 'Dr. Juma',
        waitTime: 1,
        criticalAlert: null,
        lastAction: 'Registered',
        lastActionTimestamp: currentTime,
        encounterType: 'OPD',
        timeline: [
            { step: 'Registered', time: currentTime, by: 'Fatuma', status: 'processing' },
            { step: 'Vitals', time: null, by: 'Nurse', status: 'pending' },
            { step: 'Labs Ordered', time: null, by: 'Doctor', status: 'pending' },
            { step: 'Pharmacy', time: null, by: 'Pharmacist', status: 'pending' },
            { step: 'Billing', time: null, by: 'Reception', status: 'pending' },
            { step: 'Discharged', time: null, by: 'Reception', status: 'pending' },
        ]
    };
    onRegister(newPatient);
    toast({
        title: "Patient Registered",
        description: `${newPatient.name} has been added to the queue.`
    })
    onOpenChange(false);
    setFormData({ name: '', dob: '', phone: '', sex: 'M'});
  };

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
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Upload Photo clicked" })}>Upload Photo</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name} onChange={handleChange} /></div>
             <div className="space-y-1"><Label htmlFor="phone">Phone</Label><Input id="phone" placeholder="+255..." value={formData.phone} onChange={handleChange}/></div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="dob">Date of Birth</Label><Input id="dob" type="date" value={formData.dob} onChange={handleChange}/></div>
            <div className="space-y-1"><Label htmlFor="sex">Sex</Label>
              <Select onValueChange={handleSelectChange} defaultValue={formData.sex}>
                <SelectTrigger id="sex"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleRegister}>Register & Print Wristband</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


// --- MAIN PAGE COMPONENT ---

export default function PatientsPage() {
  const firestore = useFirestore();
  const patientsCollectionRef = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: patients, isLoading } = useCollection<Patient>(patientsCollectionRef);
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeEncounterFilter, setActiveEncounterFilter] = useState('OPD');
  const [quickFilters, setQuickFilters] = useState({
      critical: false,
      waiting: false,
      labsPending: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set initial selected patient when data loads
    if (!selectedPatient && patients && patients.length > 0) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  const handleRegisterPatient = (newPatientData: Partial<PatientEntity>) => {
      addDocumentNonBlocking(patientsCollectionRef, newPatientData);
  };
  
  const handleQuickFilterChange = (filter: keyof typeof quickFilters) => {
    setQuickFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleAction = (actionText: string, newStatus: string) => {
    if (!selectedPatient) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
    
    const getTimelineItemStatus = (step: TimelineStep, status: string) => {
      const isCurrentStep = selectedPatient.timeline.findIndex(s => s.step === step.step)
      const newStatusIndex = selectedPatient.timeline.findIndex(s => s.step.replace(/\s/g, '') === status.replace(/\s/g, ''));
      
      if(isCurrentStep < newStatusIndex) return 'completed';
      if(isCurrentStep === newStatusIndex) return 'processing';
      
      return 'pending';
    }
    
    const updatedPatient: Patient = {
      ...selectedPatient,
      status: newStatus,
      lastAction: actionText,
      lastActionTimestamp: currentTime,
      timeline: selectedPatient.timeline.map(step => ({
        ...step,
        status: getTimelineItemStatus(step, newStatus),
        time: step.status === 'pending' && getTimelineItemStatus(step, newStatus) === 'processing' ? currentTime : step.time,
      }))
    };
    
    const patientDocRef = doc(firestore, 'patients', selectedPatient.id);
    updateDocumentNonBlocking(patientDocRef, updatedPatient);

    setSelectedPatient(updatedPatient);

    toast({
        title: `Action: ${actionText}`,
        description: `Patient ${selectedPatient?.name} moved to ${newStatus}.`
    });
  };

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    return patients
      .filter(p => {
        if (activeEncounterFilter === 'All') return true;
        return p.encounterType === activeEncounterFilter;
      })
      .filter(p => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(lowerSearch) || p.mrn.toLowerCase().includes(lowerSearch);
      })
      .filter(p => {
        if (quickFilters.critical && !p.criticalAlert) return false;
        if (quickFilters.waiting && p.waitTime <= 30) return false;
        if (quickFilters.labsPending && p.status !== 'Labs') return false;
        return true;
      });
  }, [patients, searchTerm, activeEncounterFilter, quickFilters]);

  const patientsByColumn = useMemo(() => {
    return kanbanColumns.reduce((acc, col) => {
      acc[col] = filteredPatients.filter(p => p.status === col || (col === 'Done' && p.status === 'Discharged'));
      return acc;
    }, {} as Record<string, Patient[]>);
  }, [filteredPatients]);
  
  const encounterCounts = useMemo(() => {
    if (!patients) return { opd: 0, emergency: 0, inpatient: 0, discharged: 0, all: 0 };
    return {
        opd: patients.filter(p => p.encounterType === 'OPD').length,
        emergency: patients.filter(p => p.encounterType === 'Emergency').length,
        inpatient: patients.filter(p => p.encounterType === 'Inpatient').length,
        discharged: patients.filter(p => p.encounterType === 'Discharged').length,
        all: patients.length,
      }
  }, [patients]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40">
        <p>Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-1 flex-col relative">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-headline text-xl font-bold">Patients</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Global Search (MRN, Name...)" className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <Button onClick={() => setIsRegistering(true)}>
                        <FilePlus className="mr-2 size-4" />
                        New Patient
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-x-auto p-4 pb-[300px]">
                <Card className="mb-4">
                  <CardContent className="flex flex-wrap items-center gap-4 p-2">
                    <div className="flex items-center gap-2">
                      <Label>Encounter:</Label>
                      <Button variant={activeEncounterFilter === 'All' ? 'default' : 'ghost'} size="sm" className="h-7" onClick={() => setActiveEncounterFilter('All')}>All ({encounterCounts.all})</Button>
                      <Button variant={activeEncounterFilter === 'OPD' ? 'default' : 'ghost'} size="sm" className="h-7" onClick={() => setActiveEncounterFilter('OPD')}>OPD ({encounterCounts.opd})</Button>
                      <Button variant={activeEncounterFilter === 'Emergency' ? 'default' : 'ghost'} size="sm" className="h-7" onClick={() => setActiveEncounterFilter('Emergency')}>Emergency ({encounterCounts.emergency})</Button>
                      <Button variant={activeEncounterFilter === 'Inpatient' ? 'default' : 'ghost'} size="sm" className="h-7" onClick={() => setActiveEncounterFilter('Inpatient')}>Inpatient ({encounterCounts.inpatient})</Button>
                      <Button variant={activeEncounterFilter === 'Discharged' ? 'default' : 'ghost'} size="sm" className="h-7" onClick={() => setActiveEncounterFilter('Discharged')}>Discharged ({encounterCounts.discharged})</Button>
                    </div>
                    <Separator orientation="vertical" className="h-6"/>
                    <div className="flex items-center gap-2">
                      <Label>Date:</Label>
                       <Select defaultValue="today">
                        <SelectTrigger className="h-7 w-auto text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="this-week">This Week</SelectItem>
                          <SelectItem value="this-month">This Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator orientation="vertical" className="h-6"/>
                     <div className="flex items-center gap-2 text-sm">
                      <Label>Quick Filters:</Label>
                       <div className="flex items-center space-x-2"><Checkbox id="critical" checked={quickFilters.critical} onCheckedChange={() => handleQuickFilterChange('critical')}/><Label htmlFor="critical">Critical Alerts ({patients?.filter(p=>p.criticalAlert).length || 0})</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="waiting" checked={quickFilters.waiting} onCheckedChange={() => handleQuickFilterChange('waiting')} /><Label htmlFor="waiting">Waiting >30 min ({patients?.filter(p=>p.waitTime > 30).length || 0})</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="labs-pending" checked={quickFilters.labsPending} onCheckedChange={() => handleQuickFilterChange('labsPending')} /><Label htmlFor="labs-pending">Labs Pending ({patients?.filter(p=>p.status === 'Labs').length || 0})</Label></div>
                    </div>

                  </CardContent>
                </Card>

                <div className="grid grid-cols-5 gap-4 min-w-[1200px]">
                    {kanbanColumns.map(col => (
                        <div key={col} className="bg-muted rounded-lg p-2">
                            <h3 className="font-semibold text-sm px-2 py-1">{col} ({patientsByColumn[col]?.length || 0})</h3>
                            <div className="mt-2 space-y-2 h-[calc(100vh-360px)] overflow-y-auto">
                                {patientsByColumn[col]?.map(p => (
                                    <PatientCard key={p.id} patient={p} onSelect={setSelectedPatient} />
                                ))}
                                {patientsByColumn[col]?.length === 0 && <p className="text-xs text-center text-muted-foreground p-4">No patients in this stage.</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        <NewPatientModal open={isRegistering} onOpenChange={setIsRegistering} onRegister={handleRegisterPatient} />
        <SelectedPatientTimeline patient={selectedPatient} onAction={handleAction} onSelect={setSelectedPatient} />
        </div>
    </div>
  );
}
