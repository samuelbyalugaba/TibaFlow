'use client';
import {
  BedDouble,
  Clock,
  FlaskConical,
  Scissors,
  Route,
  DollarSign,
  FileX,
  Activity,
  User,
  Heart,
  Star,
  TrendingDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, where, query } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type Patient = {
  id: string;
  encounterType?: string;
  doorToDoc?: string;
  status?: string;
};

type Surgery = {
  id: string;
  status: string;
};

type LabOrder = {
  id: string;
  orderDate: string; // Assuming ISO string
  completionDate?: string; // Assuming ISO string
};

const wardsConfig = {
  'Medical-Surgical': 40,
  ICU: 10,
  Pediatrics: 20,
  Maternity: 20,
};
const totalBeds = Object.values(wardsConfig).reduce(
  (acc, val) => acc + val,
  0
);

const kpiTargets = {
  opd: { warn: 100, bad: 120 },
  ed: { warn: 20, bad: 30 },
  ipd: { goodMin: 70, goodMax: 85 },
  or: { good: 60, bad: 50 },
  labs: { warn: 45, bad: 60 },
  revenue: { good: 4.5, warn: 3 },
  claims: { warn: 8, bad: 10 },
  alos: { warn: 4.0, bad: 4.5 },
  nps: { good: 80, warn: 70 },
  readmit: { warn: 7, bad: 8 },
};

const getKpiColor = (value: number, type: keyof typeof kpiTargets) => {
  const targets = kpiTargets[type];
  if ('good' in targets) { // Higher is better
    if (value >= targets.good) return 'bg-green-100 text-green-800';
    if ('bad' in targets && value < targets.bad) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  } else if ('bad' in targets) { // Lower is better
    if (value > targets.bad) return 'bg-red-100 text-red-800';
    if (value > targets.warn) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  } else if('goodMin' in targets && 'goodMax' in targets) { // In range is better
     if (value >= targets.goodMin && value <= targets.goodMax) return 'bg-green-100 text-green-800';
     return 'bg-yellow-100 text-yellow-800';
  }
  return 'bg-gray-100 text-gray-800';
};

export function StatsCards() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const { data: allPatients, isLoading: loadingPatients } =
    useCollection<Patient>(
      useMemoFirebase(() => collection(firestore, 'patients'), [firestore])
    );
  const { data: surgeries, isLoading: loadingSurgeries } =
    useCollection<Surgery>(
      useMemoFirebase(() => collection(firestore, 'surgeries'), [firestore])
    );
  const { data: labOrders, isLoading: loadingLabs } = useCollection<LabOrder>(
    useMemoFirebase(() => collection(firestore, 'labOrders'), [firestore])
  );

  const isLoading = loadingPatients || loadingSurgeries || loadingLabs;
  
  const opdPatientsToday = allPatients?.filter(p => p.encounterType === 'OPD').length || 0;
  const ipdPatients = allPatients?.filter(p => p.encounterType === 'Inpatient');
  const edPatients = allPatients?.filter(p => p.encounterType === 'Emergency' && p.doorToDoc);
  
  // Bed Occupancy
  const bedOccupancy = totalBeds > 0 ? Math.round(((ipdPatients?.length || 0) / totalBeds) * 100) : 0;

  // Avg. ED Wait Time
  const avgEDWait = edPatients && edPatients.length > 0 ? Math.round(edPatients.reduce((acc, p) => acc + (parseInt(p.doorToDoc || '0')), 0) / edPatients.length) : 0;

  // OR Utilization
  const activeSurgeries = surgeries?.filter(s => s.status === 'In Progress').length || 0;
  const totalORs = 4;
  const orUtilization = Math.round((activeSurgeries / totalORs) * 100);

  // Avg. Lab TAT
  const completedLabs = labOrders?.filter(l => l.completionDate);
  const avgLabTAT = completedLabs && completedLabs.length > 0 ? Math.round(completedLabs.reduce((acc, l) => {
        const start = new Date(l.orderDate).getTime();
        const end = l.completionDate ? new Date(l.completionDate).getTime() : start;
        return acc + (end - start);
      }, 0) / completedLabs.length / (1000 * 60)) : 0;
      
  const handlePlaceholderClick = (feature: string) => {
    toast({
        title: "Feature Not Implemented",
        description: `${feature} functionality is coming soon.`,
    });
  };

  const kpis = [
    { title: 'OPD', value: opdPatientsToday, target: `<120`, metric: 'patients today', icon: Route, color: getKpiColor(opdPatientsToday, 'opd') },
    { title: 'ED', value: avgEDWait, target: '<30 min', metric: 'door-to-doc', icon: Clock, color: getKpiColor(avgEDWait, 'ed') },
    { title: 'IPD', value: bedOccupancy, target: '70-85%', metric: 'occupancy', icon: BedDouble, color: getKpiColor(bedOccupancy, 'ipd') },
    { title: 'OR', value: orUtilization, target: '>60%', metric: 'utilization', icon: Scissors, color: getKpiColor(orUtilization, 'or') },
    { title: 'Labs', value: avgLabTAT, target: '<60 min', metric: 'TAT (CBC)', icon: FlaskConical, color: getKpiColor(avgLabTAT, 'labs') },
    { title: 'Revenue', value: '4.2M', target: '5M', metric: 'TZS today', icon: DollarSign, color: getKpiColor(4.2, 'revenue') },
    { title: 'Claims', value: 8, target: '<10%', metric: 'denial rate', icon: FileX, color: getKpiColor(8, 'claims') },
    { title: 'Quality', value: 2, target: '0', metric: 'HAI cases', icon: Activity, color: 'bg-red-100 text-red-800' },
    { title: 'Staff', value: 42, target: '>90%', metric: 'on duty (42/48)', icon: User, color: 'bg-green-100 text-green-800' },
    { title: 'ALOS', value: 3.8, target: '<4.0d', metric: 'days', icon: Heart, color: getKpiColor(3.8, 'alos') },
    { title: 'NPS', value: 84, target: '>80', metric: 'satisfaction', icon: Star, color: getKpiColor(84, 'nps') },
    { title: 'Readmit', value: 6.2, target: '<8%', metric: '30-day rate', icon: TrendingDown, color: getKpiColor(6.2, 'readmit') },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className={`cursor-pointer hover:shadow-lg ${kpi.color}`} onClick={() => handlePlaceholderClick(`${kpi.title} Tab`)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading && kpi.title.match(/OPD|ED|IPD|OR|Labs/) ? '...' : kpi.value}</div>
            <p className="text-xs text-muted-foreground">{kpi.metric}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
