'use client';

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
} from '@/components/ui/dropdown-menu';

const patientQueue = [
  {
    mrn: 'MRN-OPD-001',
    name: 'Sarah Connor',
    doctor: 'Dr. Kyle Reese',
    status: 'Waiting for Doctor',
    lastUpdate: '10 min ago',
  },
  {
    mrn: 'MRN-OPD-002',
    name: 'John Doe',
    doctor: 'Dr. Evelyn',
    status: 'Labs Pending',
    lastUpdate: '5 min ago',
  },
  {
    mrn: 'MRN-OPD-003',
    name: 'Jane Smith',
    doctor: 'Dr. Alan Grant',
    status: 'Results Ready',
    lastUpdate: '2 min ago',
  },
  {
    mrn: 'MRN-OPD-004',
    name: 'Peter Pan',
    doctor: 'Dr. Wendy Darling',
    status: 'Pharmacy Pickup',
    lastUpdate: '1 hour ago',
  },
  {
    mrn: 'MRN-OPD-005',
    name: 'Alice Wonder',
    doctor: 'Dr. Mad Hatter',
    status: 'Ready for Discharge',
    lastUpdate: '30 min ago',
  },
];

const statusColors: { [key: string]: string } = {
  'Waiting for Doctor': 'bg-yellow-100 text-yellow-800',
  'Labs Pending': 'bg-blue-100 text-blue-800',
  'Results Ready': 'bg-purple-100 text-purple-800',
  'Pharmacy Pickup': 'bg-orange-100 text-orange-800',
  'Ready for Discharge': 'bg-green-100 text-green-800',
  Discharged: 'bg-gray-100 text-gray-800',
};

export default function OutpatientPage() {
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
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Waiting for doctor</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Labs Pending</CardTitle>
              <FlaskConical className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Awaiting results</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pharmacy Queue</CardTitle>
              <Pill className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Awaiting pickup</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready for Discharge</CardTitle>
              <DollarSign className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Pending billing</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Visit Time</CardTitle>
              <User className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1h 15m</div>
              <p className="text-xs text-muted-foreground">Door-to-door</p>
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
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2" /> Filter by Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    {Object.keys(statusColors).map((status) => (
                      <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
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
                {patientQueue.map((patient) => (
                  <TableRow key={patient.mrn}>
                    <TableCell>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {patient.mrn}
                      </div>
                    </TableCell>
                    <TableCell>{patient.doctor}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[patient.status]}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.lastUpdate}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm">
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
