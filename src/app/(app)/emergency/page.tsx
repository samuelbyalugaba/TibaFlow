'use client';

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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const triageLevels = {
  '1': { name: 'ESI 1 - Resuscitation', color: 'bg-red-600 text-white' },
  '2': { name: 'ESI 2 - Emergent', color: 'bg-orange-500 text-white' },
  '3': { name: 'ESI 3 - Urgent', color: 'bg-yellow-400 text-black' },
  '4': { name: 'ESI 4 - Less Urgent', color: 'bg-green-500 text-white' },
  '5': { name: 'ESI 5 - Non-Urgent', color: 'bg-blue-500 text-white' },
};

const erPatients = [
  {
    name: 'Carlos Garcia',
    mrn: 'MRN123987',
    triage: '1',
    complaint: 'Unresponsive',
    doorToDoc: '5 min',
    location: 'Trauma 1',
  },
  {
    name: 'John Smith',
    mrn: 'MRN789012',
    triage: '2',
    complaint: 'Chest Pain',
    doorToDoc: '12 min',
    location: 'ER Bed 4',
  },
  {
    name: 'Jane Doe',
    mrn: 'MRN345678',
    triage: '3',
    complaint: 'Broken Arm',
    doorToDoc: '28 min',
    location: 'With Triage Nurse',
  },
  {
    name: 'Aisha Khan',
    mrn: 'MRN654321',
    triage: '4',
    complaint: 'Sore Throat',
    doorToDoc: '45 min',
    location: 'Fast-Track',
  },
  {
    name: 'Benny Carter',
    mrn: 'MRN456123',
    triage: '5',
    complaint: 'Suture Removal',
    doorToDoc: '62 min',
    location: 'Waiting Room',
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
              Fast triage and time-critical patient care dashboard.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Rabbit className="mr-2" /> Fast-Track Queue
            </Button>
            <Button>
              <UserPlus className="mr-2" /> Quick Register
            </Button>
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
              <div className="text-2xl font-bold">18 min</div>
              <p className="text-xs text-muted-foreground">
                -2 min from last hour
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
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">3 high priority</p>
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
              <div className="text-2xl font-bold">3 / 4</div>
              <p className="text-xs text-muted-foreground">75% capacity</p>
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
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">ETA: 8 min</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Triage Board</CardTitle>
            <CardDescription>
              Live feed of all patients in the emergency department.
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
                {erPatients.map((patient) => (
                  <TableRow
                    key={patient.mrn}
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
                          ].color
                        )}
                      >
                        {
                          triageLevels[
                            patient.triage as keyof typeof triageLevels
                          ].name
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="mr-2">
                            <HeartPulse className="mr-1 size-4" /> Vitals/Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Quick Vitals & Note for {patient.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-3 gap-4 py-4">
                            <div>
                              <Label htmlFor="bp">BP (SYS/DIA)</Label>
                              <Input id="bp" placeholder="e.g., 120/80" />
                            </div>
                            <div>
                              <Label htmlFor="hr">HR (bpm)</Label>
                              <Input id="hr" placeholder="e.g., 75" />
                            </div>
                            <div>
                              <Label htmlFor="spo2">SpO2 (%)</Label>
                              <Input id="spo2" placeholder="e.g., 98" />
                            </div>
                            <div className="col-span-3">
                              <Label htmlFor="note">Triage Note</Label>
                              <Textarea
                                id="note"
                                placeholder="Enter brief note..."
                              />
                            </div>
                          </div>
                          <Button className="w-full">Save Vitals & Note</Button>
                        </DialogContent>
                      </Dialog>

                      <Button variant="secondary" size="sm">
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
