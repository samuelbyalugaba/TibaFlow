'use client';
import {
  Boxes,
  PackagePlus,
  Truck,
  Search,
  AlertCircle,
  FileDown,
  Package,
  DollarSign,
  Pill,
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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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

type Medication = {
  id: string;
  name: string;
  category: string; // Assuming 'form' or a new field for category
  location: string; // Not in schema, but needed for UI
  stock: number; // Assuming 'quantity' from MedicationBatch
  par: number; // Not in schema, will be static for now
  form: string;
};

type Prescription = {
  id: string;
  patientId: string; // Need to fetch patient name
  medicationId: string; // Need to fetch medication name
  doctorId: string; // Need to fetch doctor name
  status: 'Pending' | 'Dispensed'; // Added for UI
};

export default function InventoryPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const { data: medications, isLoading: loadingMeds } = useCollection<Medication>(
    useMemoFirebase(() => collection(firestore, 'medications'), [firestore])
  );
  
  const { data: prescriptions, isLoading: loadingPrescriptions } = useCollection<Prescription>(
    useMemoFirebase(() => collection(firestore, 'prescriptions'), [firestore])
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
  
  // Augmenting prescription data with names
  const pharmacyQueue = prescriptions?.filter(p => p.status !== 'Dispensed').map(rx => {
    const patient = patients?.find(p => p.id === rx.patientId);
    const medication = medications?.find(m => m.id === rx.medicationId);
    const doctor = doctors?.find(d => d.id === rx.doctorId);
    return {
      ...rx,
      patientName: patient?.name || 'Unknown Patient',
      medicationName: medication?.name || 'Unknown Medication',
      doctorName: `Dr. ${doctor?.firstName || ''} ${doctor?.lastName || 'Unknown'}`,
    }
  });
  
  // Creating inventory items from medications
  const inventoryItems = medications?.map(med => ({
      ...med,
      id: med.id,
      category: med.form,
      location: 'Main Pharmacy', // Static for now
      stock: med.stock || Math.floor(Math.random() * 300), // Mock stock
      par: 200, // Mock par
  }));

  const itemsBelowPar = inventoryItems?.filter(i => i.stock < i.par).length || 0;
  
  const isLoading = loadingMeds || loadingPrescriptions;

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><p>Loading Inventory & Pharmacy...</p></div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Inventory & Pharmacy
            </h1>
            <p className="text-muted-foreground">
              Track supplies, manage pharmaceuticals, and process prescriptions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handlePlaceholderClick('Receive Shipment')}>
              <Truck className="mr-2" /> Receive Shipment
            </Button>
            <Button onClick={() => handlePlaceholderClick('New Item')}>
              <PackagePlus className="mr-2" /> New Item
            </Button>
          </div>
        </header>

        <Tabs defaultValue="pharmacy">
          <TabsList>
            <TabsTrigger value="pharmacy">
              <Pill className="mr-2" /> Pharmacy Queue
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Boxes className="mr-2" />
              Inventory Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pharmacy" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Prescriptions</CardTitle>
                <CardDescription>
                  Queue of e-prescriptions waiting to be dispensed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rx ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Prescriber</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pharmacyQueue?.map((rx) => (
                      <TableRow key={rx.id}>
                        <TableCell className="font-mono text-xs">{rx.id.substring(0,8)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{rx.patientName}</div>
                        </TableCell>
                        <TableCell>{rx.medicationName}</TableCell>
                        <TableCell>{rx.doctorName}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">Dispense</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Dispense Medication</DialogTitle>
                                <DialogDescription>
                                  Scan patient wristband to confirm identity.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4 text-center">
                                <Label>Scan Wristband for {rx.patientName}</Label>
                                <Input
                                  placeholder="Waiting for barcode scan..."
                                  className="mt-2 text-center"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                  Medication: {rx.medicationName}
                                </p>
                              </div>
                              <DialogFooter>
                                <Button className="w-full" onClick={() => handlePlaceholderClick('Confirm & Dispense')}>
                                  <CheckCircle className="mr-2" /> Confirm & Dispense
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
          </TabsContent>
          <TabsContent value="inventory" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Item SKUs
                  </CardTitle>
                  <Boxes className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{medications?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all departments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Items Below Par
                  </CardTitle>
                  <AlertCircle className="size-5 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{itemsBelowPar}</div>
                  <p className="text-xs text-muted-foreground">
                    Action required to reorder
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Inventory Value
                  </CardTitle>
                  <DollarSign className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$...</div>
                  <p className="text-xs text-muted-foreground">
                    Calculation pending
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Orders
                  </CardTitle>
                  <Package className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    From various suppliers
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Stock Levels</CardTitle>
                    <CardDescription>
                      Live view of all inventory items.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search items..."
                        className="pl-8 sm:w-[300px]"
                        onChange={() => handlePlaceholderClick('Search')}
                      />
                    </div>
                    <Button variant="outline" onClick={() => handlePlaceholderClick('Export')}>
                      <FileDown className="mr-2" /> Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Stock Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems?.map((item) => (
                      <TableRow
                        key={item.id}
                        className={
                          item.stock < item.par
                            ? 'bg-red-50 dark:bg-red-900/20'
                            : ''
                        }
                      >
                        <TableCell className="font-mono text-xs">
                          {item.id.substring(0,8)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={`font-bold ${
                                item.stock < item.par ? 'text-destructive' : ''
                              }`}
                            >
                              {item.stock}
                            </span>
                            <span className="text-muted-foreground">
                              / {item.par}
                            </span>
                          </div>
                          <Progress
                            value={(item.stock / item.par) * 100}
                            className="mt-1 h-2"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
