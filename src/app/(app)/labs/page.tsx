import { Beaker, Microscope, TestTube, Filter, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const labResults = [
  {
    orderId: "ORD-LAB-001",
    patient: "Walter White",
    test: "Complete Blood Count (CBC)",
    orderedBy: "Dr. Goodman",
    collectionTime: "2023-10-27 09:00",
    status: "Completed",
  },
  {
    orderId: "ORD-RAD-001",
    patient: "Jesse Pinkman",
    test: "Chest X-Ray, 2 Views",
    orderedBy: "Dr. Fring",
    collectionTime: "2023-10-27 09:15",
    status: "Pending Results",
  },
  {
    orderId: "ORD-LAB-002",
    patient: "Skyler White",
    test: "Basic Metabolic Panel (BMP)",
    orderedBy: "Dr. Goodman",
    collectionTime: "2023-10-27 09:30",
    status: "In-Progress",
  },
  {
    orderId: "ORD-LAB-003",
    patient: "Hank Schrader",
    test: "Lipid Panel",
    orderedBy: "Dr. Ehrmantraut",
    collectionTime: "2023-10-27 10:00",
    status: "Collected",
  },
  {
    orderId: "ORD-RAD-002",
    patient: "Saul Goodman",
    test: "CT Head w/o contrast",
    orderedBy: "Dr. Fring",
    collectionTime: "2023-10-27 10:30",
    status: "Ordered",
  },
];

const statusStyles = {
  Completed: "bg-green-100 text-green-800",
  "Pending Results": "bg-blue-100 text-blue-800",
  "In-Progress": "bg-yellow-100 text-yellow-800 animate-pulse",
  Collected: "bg-purple-100 text-purple-800",
  Ordered: "bg-gray-100 text-gray-800",
};


export default function LabsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Labs & Radiology
            </h1>
            <p className="text-muted-foreground">
              Track and manage diagnostic test orders.
            </p>
          </div>
           <div className="flex items-center gap-2">
            <Input placeholder="Search by Patient Name or Order ID..." className="w-64"/>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Completed</DropdownMenuItem>
                <DropdownMenuItem>Pending Results</DropdownMenuItem>
                <DropdownMenuItem>In-Progress</DropdownMenuItem>
                 <DropdownMenuItem>Collected</DropdownMenuItem>
                <DropdownMenuItem>Ordered</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <FileDown className="mr-2" /> Export
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Lab Tests</CardTitle>
              <TestTube className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 are STAT orders</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Radiology</CardTitle>
              <Beaker className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">1 requires pre-auth</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Lab TAT</CardTitle>
              <Clock className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58 min</div>
              <p className="text-xs text-muted-foreground">For routine CBC</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Results</CardTitle>
              <AlertTriangle className="size-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">2</div>
              <p className="text-xs text-muted-foreground">Pending provider acknowledgement</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Master Log</CardTitle>
            <CardDescription>
              Live feed of all lab and radiology orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test/Scan</TableHead>
                  <TableHead>Ordered By</TableHead>
                  <TableHead>Collection Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labResults.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-mono text-xs">{order.orderId}</TableCell>
                    <TableCell className="font-medium">{order.patient}</TableCell>
                    <TableCell>{order.test}</TableCell>
                    <TableCell>{order.orderedBy}</TableCell>
                    <TableCell>{order.collectionTime}</TableCell>
                    <TableCell className="text-right">
                       <Badge className={statusStyles[order.status as keyof typeof statusStyles]}>
                        {order.status}
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
import { Clock, AlertTriangle } from 'lucide-react';
