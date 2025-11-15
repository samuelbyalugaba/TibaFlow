import {
  Download,
  SlidersHorizontal,
  BedDouble,
  Clock,
  FlaskConical,
  AlertTriangle,
  DollarSign,
  FileX,
  HeartPulse,
  TrendingUp,
  Activity,
  ShieldCheck,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/reports/date-range-picker';
import { OverviewChart } from '@/components/dashboard/overview-chart';

const kpis = {
  operations: [
    { name: 'Bed Occupancy %', value: '88%', icon: BedDouble },
    { name: 'Avg. Length of Stay', value: '4.2 Days', icon: Clock },
    { name: 'ED Door-to-Doctor', value: '24 min', icon: Clock },
  ],
  clinical: [
    { name: 'Lab TAT (Median)', value: '55 min', icon: FlaskConical },
    { name: 'Critical Result Alerts', value: '3', icon: AlertTriangle },
    { name: 'Readmission Rate <30d', value: '14%', icon: HeartPulse },
  ],
  finance: [
    { name: 'Daily Revenue', value: '$250K', icon: DollarSign },
    { name: 'Claim Denial Rate', value: '4.5%', icon: FileX },
    { name: 'A/R Days', value: '38', icon: TrendingUp },
  ],
  quality: [
    { name: 'HAI Cases', value: '2', icon: Activity },
    { name: 'Incident Reports', value: '5', icon: AlertTriangle },
    { name: 'Compliance Score', value: '98%', icon: ShieldCheck },
  ],
};

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Reporting & Analytics
          </h1>
          <p className="text-muted-foreground">
            Real-time KPIs & compliance dashboards.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>
              Filter data by date, ward, doctor, or payer.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-wrap gap-4 md:flex-row">
            <div className="flex-1">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange />
            </div>
            <div className="flex flex-1 gap-4">
              <div className="w-full">
                <label className="text-sm font-medium">Ward</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Wards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wards</SelectItem>
                    <SelectItem value="med-surg">Medical-Surgical</SelectItem>
                    <SelectItem value="icu">ICU</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <label className="text-sm font-medium">Doctor</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Doctors" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Doctors</SelectItem>
                    <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                    <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="w-full">
                <label className="text-sm font-medium">Payer</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Payers" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Payers</SelectItem>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="self-end">
              <Button size="lg" className="w-full md:w-auto">
                <Download className="mr-2" />
                Export PDF/Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Operations Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    {kpis.operations.map(kpi => (
                         <div key={kpi.name} className="flex items-center gap-4 rounded-lg bg-accent/30 p-4">
                            <kpi.icon className="size-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground">{kpi.name}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Clinical Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    {kpis.clinical.map(kpi => (
                         <div key={kpi.name} className="flex items-center gap-4 rounded-lg bg-accent/30 p-4">
                            <kpi.icon className="size-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground">{kpi.name}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Finance Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    {kpis.finance.map(kpi => (
                         <div key={kpi.name} className="flex items-center gap-4 rounded-lg bg-accent/30 p-4">
                            <kpi.icon className="size-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground">{kpi.name}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Quality Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    {kpis.quality.map(kpi => (
                         <div key={kpi.name} className="flex items-center gap-4 rounded-lg bg-accent/30 p-4">
                            <kpi.icon className="size-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground">{kpi.name}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Admissions Trend</CardTitle>
            <CardDescription>
              Visualizing patient admissions over the past 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
