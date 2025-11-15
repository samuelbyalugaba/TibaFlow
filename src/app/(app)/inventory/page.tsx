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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const inventoryItems = [
  {
    id: 'INV-001',
    name: 'N95 Masks (Box of 50)',
    category: 'PPE',
    location: 'Central Supply - Aisle 3',
    stock: 250,
    par: 200,
  },
  {
    id: 'INV-002',
    name: 'IV Start Kits',
    category: 'Medical Supplies',
    location: 'ER Storage',
    stock: 75,
    par: 100,
  },
  {
    id: 'INV-003',
    name: 'Atorvastatin 20mg',
    category: 'Pharmacy',
    location: 'Main Pharmacy',
    stock: 500,
    par: 400,
  },
  {
    id: 'INV-004',
    name: 'Saline Bags 1000ml',
    category: 'Medical Supplies',
    location: 'Central Supply - Aisle 1',
    stock: 150,
    par: 150,
  },
  {
    id: 'INV-005',
    name: 'Sterile Gauze (4x4)',
    category: 'Wound Care',
    location: 'OR Core',
    stock: 45,
    par: 100,
  },
];

const pharmacyQueue = [
  {
    rxId: 'RX-001',
    patient: 'Jane Smith',
    mrn: 'MRN-OPD-003',
    medication: 'Amoxicillin 500mg',
    prescriber: 'Dr. Alan Grant',
    status: 'Pending',
  },
  {
    rxId: 'RX-002',
    patient: 'John Appleseed',
    mrn: 'MRN-OPD-006',
    medication: 'Ibuprofen 200mg',
    prescriber: 'Dr. Alan Grant',
    status: 'Pending',
  },
];

export default function InventoryPage() {
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
            <Button variant="outline">
              <Truck className="mr-2" /> Receive Shipment
            </Button>
            <Button>
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
                      <TableHead>Patient (MRN)</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Prescriber</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pharmacyQueue.map((rx) => (
                      <TableRow key={rx.rxId}>
                        <TableCell className="font-mono">{rx.rxId}</TableCell>
                        <TableCell>
                          <div className="font-medium">{rx.patient}</div>
                          <div className="text-xs text-muted-foreground">
                            {rx.mrn}
                          </div>
                        </TableCell>
                        <TableCell>{rx.medication}</TableCell>
                        <TableCell>{rx.prescriber}</TableCell>
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
                                <Label>Scan Wristband for {rx.patient}</Label>
                                <Input
                                  placeholder="Waiting for barcode scan..."
                                  className="mt-2 text-center"
                                />
                                <p className="mt-4 text-sm text-muted-foreground">
                                  Medication: {rx.medication}
                                </p>
                              </div>
                              <DialogFooter>
                                <Button className="w-full">
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
                  <div className="text-2xl font-bold">1,284</div>
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
                  <div className="text-2xl font-bold text-destructive">52</div>
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
                  <div className="text-2xl font-bold">$1.2M</div>
                  <p className="text-xs text-muted-foreground">
                    Estimated on-hand value
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
                  <div className="text-2xl font-bold">15</div>
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
                      />
                    </div>
                    <Button variant="outline">
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
                    {inventoryItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className={
                          item.stock < item.par
                            ? 'bg-red-50 dark:bg-red-900/20'
                            : ''
                        }
                      >
                        <TableCell className="font-mono text-xs">
                          {item.id}
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
