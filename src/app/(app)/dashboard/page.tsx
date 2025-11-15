'use client';
import {
  Download,
  LogOut,
  Settings,
  HelpCircle,
  Languages,
} from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentPatients } from '@/components/dashboard/recent-patients';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/reports/date-range-picker';
import { Logo } from '@/components/icons';

export default function DashboardPage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    signOut(auth);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const handlePlaceholderClick = (feature: string) => {
    toast({
      title: 'Feature Not Implemented',
      description: `${feature} functionality is coming soon.`,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Logo className="size-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" onClick={() => handlePlaceholderClick('Language Toggle')}>
                <Languages className="mr-2" /> English
              </Button>
              <DatePickerWithRange />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.photoURL || ''} alt="User Avatar" />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handlePlaceholderClick('Settings')}
                >
                  <Settings className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePlaceholderClick('Support')}
                >
                  <HelpCircle className="mr-2" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
                 <div className="space-y-4">
                    <h2 className="font-semibold text-red-600">Live Alerts</h2>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <h3 className="font-bold text-red-800">🔴 Critical Lab Results (3)</h3>
                        <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
                            <li>K+ 6.8 (TZ-2025-1101)</li>
                            <li>Hb 5.2 (TZ-2025-1120)</li>
                            <li>Malaria (+) in child &lt;5y</li>
                        </ul>
                    </div>
                     <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <h3 className="font-bold text-yellow-800">⏰ Long Waits (8)</h3>
                         <p className="mt-1 text-sm text-yellow-700">OPD: 5 | ED: 3</p>
                    </div>
                     <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <h3 className="font-bold text-orange-800">💊 Drug Stockouts (2)</h3>
                         <ul className="mt-2 list-disc pl-5 text-sm text-orange-700">
                            <li>Amoxicillin 250mg Susp</li>
                            <li>IV Ceftriaxone 1g</li>
                        </ul>
                    </div>
                 </div>
            </div>
            <div className="lg:col-span-9">
                <StatsCards />
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OverviewChart />
          </div>
          <div className="lg:col-span-1">
            <RecentPatients />
          </div>
        </div>
      </main>
    </div>
  );
}
