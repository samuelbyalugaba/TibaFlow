'use client';

import {
  Calendar,
  Filter,
  PlusCircle,
  Scissors,
  Clock,
  ClipboardCheck,
  UserCheck,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const surgeries = [
  {
    caseId: 'CASE-001',
    patient: 'Michael Scott',
    procedure: 'Appendectomy',
    surgeon: 'Dr. Schrute',
    anesthetist: 'Dr. Martin',
    or: 'OR 3',
    time: '08:00 AM',
    status: 'Scheduled',
    checklist: {
      consent: true,
      fasting: true,
      blood: false,
      implant: false,
    },
  },
  {
    caseId: 'CASE-002',
    patient: 'Pam Beesly',
    procedure: 'Cholecystectomy',
    surgeon: 'Dr. Halpert',
    anesthetist: 'Dr. Hudson',
    or: 'OR 1',
    time: '09:30 AM',
    status: 'In Progress',
    checklist: {
      consent: true,
      fasting: true,
      blood: true,
      implant: false,
    },
  },
  {
    caseId: 'CASE-003',
    patient: 'Jim Halpert',
    procedure: 'Knee Arthroscopy',
    surgeon: 'Dr. Bernard',
    anesthetist: 'Dr. Martin',
    or: 'OR 2',
    time: '11:00 AM',
    status: 'Post-Op',
    checklist: {
      consent: true,
      fasting: true,
      blood: false,
      implant: true,
    },
  },
  {
    caseId: 'CASE-004',
    patient: 'Dwight Schrute',
    procedure: 'Coronary Artery Bypass',
    surgeon: 'Dr. Kapoor',
    anesthetist: 'Dr. Hudson',
    or: 'OR 4 (Hybrid)',
    time: '12:00 PM',
    status: 'Pre-Op',
    checklist: {
      consent: true,
      fasting: false,
      blood: true,
      implant: false,
    },
  },
  {
    caseId: 'CASE-005',
    patient: 'Angela Martin',
    procedure: 'Cataract Surgery',
    surgeon: 'Dr. Hudson',
    anesthetist: 'Dr. Martin',
    or: 'OR 5',
    time: '02:00 PM',
    status: 'Cancelled',
    checklist: {
      consent: false,
      fasting: false,
      blood: false,
      implant: false,
    },
  },
];

const statusStyles = {
  Scheduled: 'bg-blue-100 text-blue-800',
  'Pre-Op': 'bg-purple-100 text-purple-800',
  'In Progress': 'bg-yellow-100 text-yellow-800 animate-pulse',
  'Post-Op': 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const ChecklistProgress = ({ checklist }: { checklist: any }) => {
    const total = Object.keys(checklist).length;
    const completed = Object.values(checklist).filter(Boolean).length;
    const percentage = (completed / total) * 100;
    return <Progress value={percentage} className="h-2 w-24" />;
};

export default function SurgeryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Surgical Dashboard
            </h1>
            <p className="text-muted-foreground">
              End-to-end operating room management.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Scheduled</DropdownMenuItem>
                <DropdownMenuItem>Pre-Op</DropdownMenuItem>
                <DropdownMenuItem>In Progress</DropdownMenuItem>
                <DropdownMenuItem>Post-Op</DropdownMenuItem>
                <DropdownMenuItem>Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <PlusCircle className="mr-2" /> Book New Case
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Cases Today
              </CardTitle>
              <Scissors className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                1 in progress, 2 in pre-op
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">OR Utilization</CardTitle>
               <Progress value={75} aria-label="75% utilized" className="w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">
                3 of 4 ORs currently active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Turnover Time
              </CardTitle>
              <Clock className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">35 min</div>
              <p className="text-xs text-muted-foreground">
                +5 min from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Date</CardTitle>
              <Calendar className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date().getFullYear()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>OR Schedule</CardTitle>
            <CardDescription>
              Drag-and-drop to reschedule. Click a case for details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>OR</TableHead>
                  <TableHead>Patient / Case ID</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Surgical Team</TableHead>
                  <TableHead>Pre-Op Checklist</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surgeries.map((surgery) => (
                  <TableRow key={surgery.caseId} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{surgery.time}</TableCell>
                    <TableCell>{surgery.or}</TableCell>
                    <TableCell>
                      <div>{surgery.patient}</div>
                      <div className="text-xs text-muted-foreground">
                        {surgery.caseId}
                      </div>
                    </TableCell>
                    <TableCell>{surgery.procedure}</TableCell>
                    <TableCell>
                      <div>{surgery.surgeon} (Surgeon)</div>
                      <div className="text-xs text-muted-foreground">{surgery.anesthetist} (Anes.)</div>
                    </TableCell>
                    <TableCell>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <ChecklistProgress checklist={surgery.checklist} />
                                </div>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Pre-Op Checklist for {surgery.patient}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="consent" checked={surgery.checklist.consent} />
                                        <Label htmlFor="consent">Informed Consent Signed</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="fasting" checked={surgery.checklist.fasting} />
                                        <Label htmlFor="fasting">NPO (Fasting) Confirmed</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="blood" checked={surgery.checklist.blood} />
                                        <Label htmlFor="blood">Blood Products Reserved</Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <Checkbox id="implant" checked={surgery.checklist.implant} />
                                        <Label htmlFor="implant">Implants/Prosthetics Confirmed</Label>
                                    </div>
                                    <Separator />
                                     <h3 className="font-semibold">WHO Surgical Safety Checklist</h3>
                                     <div className="flex justify-around">
                                        <Button variant="outline"><UserCheck className="mr-2"/> Sign In</Button>
                                        <Button variant="outline"><Clock className="mr-2"/> Time Out</Button>
                                        <Button variant="outline"><ClipboardCheck className="mr-2"/> Sign Out</Button>
                                     </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={cn(
                          statusStyles[surgery.status as keyof typeof statusStyles]
                        )}
                      >
                        {surgery.status}
                      </Badge>
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
