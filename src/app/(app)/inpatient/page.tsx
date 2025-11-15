import { Bed, BedDouble, Filter, UserPlus } from 'lucide-react';
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

const wards = [
  { name: 'Medical-Surgical', occupancy: 85, beds: '34/40' },
  { name: 'ICU', occupancy: 90, beds: '9/10' },
  { name: 'Pediatrics', occupancy: 60, beds: '12/20' },
  { name: 'Maternity', occupancy: 75, beds: '15/20' },
];

const patients = [
  {
    name: 'Eleanor Vance',
    mrn: 'MRN-EV-001',
    bed: 'MS-301A',
    admissionDate: '2023-07-18',
    dx: 'Pneumonia',
    status: 'Stable',
  },
  {
    name: 'Marcus Thorne',
    mrn: 'MRN-MT-002',
    bed: 'ICU-02B',
    admissionDate: '2023-07-20',
    dx: 'Post-CABG',
    status: 'Critical',
  },
  {
    name: 'Seraphina Moon',
    mrn: 'MRN-SM-003',
    bed: 'PED-105',
    admissionDate: '2023-07-21',
    dx: 'Asthma Exacerbation',
    status: 'Observation',
  },
  {
    name: 'Julian Arbor',
    mrn: 'MRN-JA-004',
    bed: 'MAT-202',
    admissionDate: '2023-07-21',
    dx: 'Pre-eclampsia',
    status: 'Stable',
  },
];

const statusColors = {
  Stable: 'bg-green-100 text-green-800',
  Critical: 'bg-red-100 text-red-800 animate-pulse',
  Observation: 'bg-yellow-100 text-yellow-800',
};

export default function InpatientPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Inpatient Management
            </h1>
            <p className="text-muted-foreground">
              Oversee bed assignments and inpatient census.
            </p>
          </div>
          <div className="flex items-center gap-2">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2" /> Filter by Ward
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {wards.map(w => <DropdownMenuItem key={w.name}>{w.name}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <UserPlus className="mr-2" /> Direct Admit
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Overall Bed Occupancy</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">70 of 90 beds occupied</p>
                    <Progress value={78} className="mt-2" />
                </CardContent>
            </Card>
            {wards.map(ward => (
                 <Card key={ward.name}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{ward.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ward.occupancy}%</div>
                        <p className="text-xs text-muted-foreground">{ward.beds} beds occupied</p>
                        <Progress value={ward.occupancy} className="mt-2" />
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inpatient Census</CardTitle>
            <CardDescription>
              List of all currently admitted patients.
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
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.mrn}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Bed className="size-4 text-muted-foreground" />
                        {p.bed}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.mrn}</div>
                    </TableCell>
                    <TableCell>{p.admissionDate}</TableCell>
                    <TableCell>{p.dx}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={cn(statusColors[p.status as keyof typeof statusColors])}>
                        {p.status}
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
