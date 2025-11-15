import { Calendar, Filter, PlusCircle, Scissors } from 'lucide-react';
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

const surgeries = [
  {
    caseId: 'CASE-001',
    patient: 'Michael Scott',
    procedure: 'Appendectomy',
    surgeon: 'Dr. Schrute',
    or: 'OR 3',
    time: '08:00 AM',
    status: 'Scheduled',
  },
  {
    caseId: 'CASE-002',
    patient: 'Pam Beesly',
    procedure: 'Cholecystectomy',
    surgeon: 'Dr. Halpert',
    or: 'OR 1',
    time: '09:30 AM',
    status: 'In Progress',
  },
  {
    caseId: 'CASE-003',
    patient: 'Jim Halpert',
    procedure: 'Knee Arthroscopy',
    surgeon: 'Dr. Bernard',
    or: 'OR 2',
    time: '11:00 AM',
    status: 'Post-Op',
  },
  {
    caseId: 'CASE-004',
    patient: 'Dwight Schrute',
    procedure: 'Coronary Artery Bypass',
    surgeon: 'Dr. Kapoor',
    or: 'OR 4 (Hybrid)',
    time: '12:00 PM',
    status: 'Scheduled',
  },
  {
    caseId: 'CASE-005',
    patient: 'Angela Martin',
    procedure: 'Cataract Surgery',
    surgeon: 'Dr. Hudson',
    or: 'OR 5',
    time: '02:00 PM',
    status: 'Cancelled',
  },
];

const statusStyles = {
  Scheduled: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800 animate-pulse',
  'Post-Op': 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
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
              Manage operating room schedules and surgical cases.
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
              <CardTitle className="text-sm font-medium">Total Cases Today</CardTitle>
              <Scissors className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">5 scheduled, 1 in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">OR Utilization</CardTitle>
              <div className="text-2xl font-bold">75%</div>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 w-3/4 rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">3 of 4 ORs currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Turnover Time</CardTitle>
              <Clock className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">35 min</div>
              <p className="text-xs text-muted-foreground">+5 min from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Date</CardTitle>
              <Calendar className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
              <p className="text-xs text-muted-foreground">{new Date().getFullYear()}</p>
            </CardContent>
          </Card>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Today's Surgical Schedule</CardTitle>
            <CardDescription>Live view of all scheduled operations for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>OR</TableHead>
                  <TableHead>Patient / Case ID</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Surgeon</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surgeries.map((surgery) => (
                  <TableRow key={surgery.caseId}>
                    <TableCell className="font-medium">{surgery.time}</TableCell>
                    <TableCell>{surgery.or}</TableCell>
                    <TableCell>
                      <div>{surgery.patient}</div>
                      <div className="text-xs text-muted-foreground">{surgery.caseId}</div>
                    </TableCell>
                    <TableCell>{surgery.procedure}</TableCell>
                    <TableCell>{surgery.surgeon}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={statusStyles[surgery.status as keyof typeof statusStyles]}>
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
import { Clock } from 'lucide-react';
