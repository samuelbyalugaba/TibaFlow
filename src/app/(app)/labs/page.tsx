'use client';
import {
  Beaker,
  Microscope,
  TestTube,
  Filter,
  FileDown,
  Clock,
  AlertTriangle,
  CheckCircle,
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
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


type LabOrder = {
  id: string;
  patientId: string;
  testType: string;
  orderDate: string;
  status: 'Completed' | 'Pending Results' | 'Processing' | 'Received' | 'Collected' | 'Ordered';
  isCritical?: boolean;
  doctorId: string;
};

const statusStyles: { [key: string]: string } = {
  Completed: 'bg-green-100 text-green-800',
  'Pending Results': 'bg-blue-100 text-blue-800',
  Processing: 'bg-yellow-100 text-yellow-800 animate-pulse',
  Received: 'bg-indigo-100 text-indigo-800',
  Collected: 'bg-purple-100 text-purple-800',
  Ordered: 'bg-gray-100 text-gray-800',
};

export default function LabsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const { data: labOrders, isLoading: loadingLabs } = useCollection<LabOrder>(
    useMemoFirebase(() => collection(firestore, 'labOrders'), [firestore])
  );

  const { data: patients } = useCollection<{id: string, name: string}>(
    useMemoFirebase(() => collection(firestore, 'patients'), [firestore])
  );

  const { data: doctors } = useCollection<{id: string, firstName: string, lastName: string}>(
    useMemoFirebase(() => collection(firestore, 'doctors'), [firestore])
  );

  const handlePlaceholderClick = (feature: string) => {
    toast({
        title: "Feature not implemented",
        description: `${feature} is coming soon.`,
    });
  };

  const augmentedLabResults = labOrders?.map(order => {
    const patient = patients?.find(p => p.id === order.patientId);
    const doctor = doctors?.find(d => d.id === order.doctorId);
    return {
      ...order,
      orderId: order.id,
      patient: patient?.name || 'Unknown Patient',
      test: order.testType,
      orderedBy: `Dr. ${doctor?.firstName || ''} ${doctor?.lastName || 'Unknown'}`,
      collectionTime: new Date(order.orderDate).toLocaleString(),
    }
  });

  const pendingLabCount = labOrders?.filter(o => o.status !== 'Completed' && o.testType.toLowerCase().includes('lab')).length || 0;
  const pendingRadiologyCount = labOrders?.filter(o => o.status !== 'Completed' && o.testType.toLowerCase().includes('rad')).length || 0;
  const criticalResultsCount = labOrders?.filter(o => o.isCritical && o.status !== 'Completed').length || 0;

  if (loadingLabs) {
    return <div className="flex h-screen w-full items-center justify-center"><p>Loading Labs & Radiology...</p></div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Labs & Radiology
            </h1>
            <p className="text-muted-foreground">
              Track and manage diagnostic test orders from order to result.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Patient Name or Order ID..."
              className="w-64"
              onChange={() => handlePlaceholderClick('Search')}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" onClick={() => handlePlaceholderClick('Filter')}>
                  <Filter className="mr-2" /> Filter by Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(statusStyles).map((status) => (
                  <DropdownMenuItem key={status} onClick={() => handlePlaceholderClick('Filter')}>{status}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <TestTube className="mr-2" /> New Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Lab/Radiology Order</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-1">
                    <Label htmlFor="patient-mrn">Patient MRN</Label>
                    <Input id="patient-mrn" placeholder="Enter MRN..." />
                  </div>
                   <div className="space-y-1">
                    <Label htmlFor="test-name">Test/Scan Name</Label>
                    <Input id="test-name" placeholder="e.g., CBC, Chest X-Ray" />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full" onClick={() => handlePlaceholderClick('New Order')}>Submit Order & Print Label</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Lab Tests
              </CardTitle>
              <Microscope className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLabCount}</div>
              <p className="text-xs text-muted-foreground">3 are STAT orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Radiology
              </CardTitle>
              <Beaker className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRadiologyCount}</div>
              <p className="text-xs text-muted-foreground">1 requires pre-auth</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Lab TAT
              </CardTitle>
              <Clock className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58 min</div>
              <p className="text-xs text-muted-foreground">For routine CBC</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Results
              </CardTitle>
              <AlertTriangle className="size-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{criticalResultsCount}</div>
              <p className="text-xs text-muted-foreground">
                Pending provider acknowledgement
              </p>
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {augmentedLabResults?.map((order) => (
                  <TableRow
                    key={order.orderId}
                    className={order.isCritical ? 'bg-red-50' : ''}
                  >
                    <TableCell className="font-mono text-xs">
                      {order.orderId.substring(0,8)}
                    </TableCell>
                    <TableCell className="font-medium">{order.patient}</TableCell>
                    <TableCell>
                      {order.isCritical && (
                        <AlertTriangle className="mr-2 inline-block size-4 text-red-500" />
                      )}
                      {order.test}
                    </TableCell>
                    <TableCell>{order.orderedBy}</TableCell>
                    <TableCell>{order.collectionTime}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusStyles[order.status as keyof typeof statusStyles]
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="sm">
                            {order.status === "Completed" ? "View" : "Update"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Lab Result for {order.patient}</DialogTitle>
                            <DialogDescription>{order.test}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label htmlFor="wbc">WBC</Label>
                                <Input id="wbc" defaultValue="15.2" />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="rbc">RBC</Label>
                                <Input id="rbc" defaultValue="4.8" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="notes">Lab Tech Notes</Label>
                              <Input id="notes" defaultValue="High white blood cell count indicates infection." />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input type="checkbox" id="critical-result" className="h-4 w-4" defaultChecked={order.isCritical} />
                                <Label htmlFor="critical-result" className="text-red-600 font-bold">Flag as CRITICAL result</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => handlePlaceholderClick('Cancel')}>Cancel</Button>
                            <Button onClick={() => handlePlaceholderClick('Finalize')}>
                              <CheckCircle className="mr-2" />
                              Finalize & Notify Doctor
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
