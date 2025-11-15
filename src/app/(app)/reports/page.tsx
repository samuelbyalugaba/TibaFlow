import { FileText, Calendar, Download, SlidersHorizontal, BarChart, LineChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/reports/date-range-picker";
import { OverviewChart } from "@/components/dashboard/overview-chart";


const favoriteReports = [
    { name: "Daily Census Report", icon: BarChart, category: "Administrative" },
    { name: "Monthly Billing Summary", icon: PieChart, category: "Financial" },
    { name: "OR Utilization Analysis", icon: LineChart, category: "Surgical" },
    { name: "Readmission Rate Tracker", icon: BarChart, category: "Clinical" },
];

const allReports = [
    { name: "Admission/Discharge/Transfer (ADT) Log", category: "Administrative" },
    { name: "Bed Occupancy Rate", category: "Administrative" },
    { name: "Average Length of Stay (ALOS)", category: "Clinical" },
    { name: "Infection Control Report", category: "Clinical" },
    { name: "Medication Administration Record (MAR)", category: "Clinical" },
    { name: "Accounts Receivable Aging", category: "Financial" },
    { name: "Revenue by Department", category: "Financial" },
    { name: "Surgical Case Volume", category: "Surgical" },
    { name: "Anesthesia Time Analysis", category: "Surgical" },
    { name: "Lab Turnaround Time (TAT) Report", category: "Labs" },
];

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Reporting & Analytics
            </h1>
            <p className="text-muted-foreground">
              Generate, view, and analyze hospital-wide data.
            </p>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Report Generator</CardTitle>
                <CardDescription>Select a report, set parameters, and run.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="text-sm font-medium">Select Report</label>
                     <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a report to run..." />
                        </SelectTrigger>
                        <SelectContent>
                            {allReports.map(report => (
                                <SelectItem key={report.name} value={report.name}>{report.name} ({report.category})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 md:flex-initial">
                    <label className="text-sm font-medium">Date Range</label>
                    <DatePickerWithRange />
                </div>
                <div className="flex-1 md:flex-initial">
                     <label className="text-sm font-medium">Advanced Filters</label>
                    <Button variant="outline" className="w-full justify-start">
                        <SlidersHorizontal className="mr-2"/>
                        <span>Set Filters</span>
                    </Button>
                </div>
                <div className="self-end">
                    <Button size="lg" className="w-full md:w-auto">
                        <Download className="mr-2" />
                        Generate & Download
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Favorite Reports</CardTitle>
                <CardDescription>Quick access to your most frequently used reports.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {favoriteReports.map((report) => (
                    <Card key={report.name} className="hover:bg-accent hover:cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className="rounded-full bg-primary/10 p-3">
                                <report.icon className="size-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-base">{report.name}</CardTitle>
                                <CardDescription>{report.category}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Patient Admissions Trend</CardTitle>
                <CardDescription>Visualizing patient admissions over the past 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <OverviewChart />
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
