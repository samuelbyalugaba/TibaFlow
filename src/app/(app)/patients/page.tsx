'use client';

import { useState, useMemo } from 'react';
import {
  FilePlus,
  Search,
  Upload,
  Link as LinkIcon,
  Printer,
  MoreVertical,
  FlaskConical,
  Pill,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

// Mock data - we'll replace this with real data later
const mockPatients = [
  {
    mrn: 'MRN001',
    name: 'Liam Johnson',
    dob: '1985-04-12',
    phone: '555-0101',
    bloodType: 'O+',
    photo: 'https://picsum.photos/seed/patient1/100/100',
    allergies: ['Peanuts', 'Penicillin'],
    activeProblems: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    encounters: [
      {
        id: 'ENC001',
        type: 'OPD',
        date: '2023-10-26',
        chiefComplaint: 'Annual Checkup',
        status: 'Discharged',
      },
      {
        id: 'ENC002',
        type: 'OPD',
        date: '2024-07-22',
        chiefComplaint: 'Fever and Cough',
        status: 'Results Ready',
      },
    ],
  },
  {
    mrn: 'MRN002',
    name: 'Olivia Williams',
    dob: '1992-08-25',
    phone: '555-0102',
    bloodType: 'A-',
    photo: 'https://picsum.photos/seed/patient2/100/100',
    allergies: ['None'],
    activeProblems: ['Asthma'],
    medications: ['Albuterol Inhaler'],
    encounters: [
      {
        id: 'ENC003',
        type: 'IPD',
        date: '2023-11-30',
        chiefComplaint: 'Pneumonia',
        status: 'Discharged',
      },
    ],
  },
];

type Patient = (typeof mockPatients)[0];
type Encounter = Patient['encounters'][0];

const statusColors: { [key: string]: string } = {
  'Waiting for Doctor': 'bg-yellow-100 text-yellow-800',
  'Labs Pending': 'bg-blue-100 text-blue-800',
  'Results Ready': 'bg-purple-100 text-purple-800',
  'Pharmacy Pickup': 'bg-orange-100 text-orange-800',
  'Ready for Discharge': 'bg-green-100 text-green-800',
  Discharged: 'bg-gray-100 text-gray-800',
};

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    mockPatients[0]
  );
  const [isRegistering, setIsRegistering] = useState(false);

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return [];
    return mockPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mrn.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchQuery('');
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Patient Management
          </h1>
          <p className="text-muted-foreground">
            Search for patients or register a new one.
          </p>
        </header>

        {/* Search and Register Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search or Register Patient</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by MRN, Name..."
                  className="w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && filteredPatients.length > 0 && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
                    {filteredPatients.map((p) => (
                      <div
                        key={p.mrn}
                        className="cursor-pointer p-2 hover:bg-accent"
                        onClick={() => handleSelectPatient(p)}
                      >
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-muted-foreground">
                          MRN: {p.mrn} - DOB: {p.dob}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Dialog open={isRegistering} onOpenChange={setIsRegistering}>
                <DialogTrigger asChild>
                  <Button>
                    <FilePlus className="mr-2" />
                    Register New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>New Patient Registration</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dob" className="text-right">
                        DOB
                      </Label>
                      <Input id="dob" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone
                      </Label>
                      <Input id="phone" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="id" className="text-right">
                        Govt. ID
                      </Label>
                      <Input id="id" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="photo" className="text-right">
                        Photo
                      </Label>
                      <div className="col-span-3">
                        <Button variant="outline">
                          <Upload className="mr-2" /> Upload Image
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsRegistering(false)}
                    className="w-full"
                  >
                    Register Patient
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {selectedPatient ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Patient Details Column */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="bg-accent p-4 text-center">
                  <div className="mx-auto w-fit rounded-full border-4 border-background">
                    <Image
                      data-ai-hint="person face"
                      src={selectedPatient.photo}
                      alt={selectedPatient.name}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-headline">
                    {selectedPatient.name}
                  </CardTitle>
                  <CardDescription>
                    MRN: {selectedPatient.mrn}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-around text-center text-sm">
                    <div>
                      <p className="font-semibold">DOB</p>
                      <p className="text-muted-foreground">
                        {selectedPatient.dob}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Blood Type</p>
                      <p className="text-muted-foreground">
                        {selectedPatient.bloodType}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-muted-foreground">
                        {selectedPatient.phone}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full">
                      <Printer className="mr-2" /> Print Wristband
                    </Button>
                    <Button variant="outline" className="w-full">
                      <LinkIcon className="mr-2" /> Send Portal Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Medical Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold">Active Problems</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {selectedPatient.activeProblems.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Allergies</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {selectedPatient.allergies.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Current Medications</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {selectedPatient.medications.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Encounter History Column */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline">
                      Encounter History
                    </CardTitle>
                    <CardDescription>
                      Timeline of all patient visits.
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <FilePlus className="mr-2" /> New Encounter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Start OPD Encounter</DropdownMenuItem>
                      <DropdownMenuItem>Start ED Encounter</DropdownMenuItem>
                      <DropdownMenuItem>Start IPD Encounter</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Encounter ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Chief Complaint</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPatient.encounters.map((enc: Encounter) => (
                        <TableRow key={enc.id}>
                          <TableCell className="font-medium">
                            {enc.id}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                enc.type === 'ED' ? 'destructive' : 'secondary'
                              }
                            >
                              {enc.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{enc.date}</TableCell>
                          <TableCell>{enc.chiefComplaint}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[enc.status]}>
                              {enc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <EncounterActions encounter={enc} patient={selectedPatient}/>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                No Patient Selected
              </h3>
              <p className="text-sm text-muted-foreground">
                Search for a patient or register a new one to see their
                details.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function EncounterActions({ encounter, patient }: { encounter: Encounter, patient: Patient }) {
  const [isLabModalOpen, setLabModalOpen] = useState(false);
  const [isRxModalOpen, setRxModalOpen] = useState(false);
  
  const getAction = () => {
    switch (encounter.status) {
      case 'Results Ready':
        return (
          <>
            <Button size="sm" onClick={() => setRxModalOpen(true)}>
              <Pill className="mr-2" />
              e-Prescribe
            </Button>
            <Dialog open={isRxModalOpen} onOpenChange={setRxModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create e-Prescription for {patient.name}</DialogTitle>
                  <CardDescription>Final Diagnosis: Fever and Cough</CardDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="medication">Medication</Label>
                    <Input id="medication" placeholder="e.g., Amoxicillin 500mg" />
                  </div>
                  <div>
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input id="dosage" placeholder="e.g., 1 tablet 3 times a day for 7 days" />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes for Pharmacist</Label>
                    <Textarea id="notes" placeholder="Any special instructions..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setRxModalOpen(false)} className="w-full">Send to Pharmacy</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      case 'Waiting for Doctor':
      case 'Labs Pending':
        return (
           <>
            <Button size="sm" onClick={() => setLabModalOpen(true)}>
              <FlaskConical className="mr-2" />
              Order Labs
            </Button>
             <Dialog open={isLabModalOpen} onOpenChange={setLabModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Order Labs for {patient.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                     <Input id="cbc" type="checkbox" className="h-4 w-4"/>
                    <Label htmlFor="cbc">Complete Blood Count (CBC)</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                     <Input id="bmp" type="checkbox" className="h-4 w-4"/>
                    <Label htmlFor="bmp">Basic Metabolic Panel (BMP)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Input id="malaria" type="checkbox" className="h-4 w-4"/>
                    <Label htmlFor="malaria">Malaria Smear</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setLabModalOpen(false)} className="w-full">Submit Order & Print Label</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )
      case 'Ready for Discharge':
         return (
            <Button size="sm">
              <DollarSign className="mr-2" />
              Generate Invoice
            </Button>
        )
      default:
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Add Note</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
    }
  };

  return getAction();
}
