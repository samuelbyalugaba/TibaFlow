'use client';
import { Download, LogOut, Settings, HelpCircle } from "lucide-react";
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentPatients } from "@/components/dashboard/recent-patients";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const avatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    signOut(auth);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handlePlaceholderClick = (feature: string) => {
    toast({
      title: "Feature Not Implemented",
      description: `${feature} functionality is coming soon.`,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, here&apos;s a summary of hospital activities.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => handlePlaceholderClick('Download Report')}>
              <Download className="mr-2" />
              Download Report
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  {avatar && (
                    <AvatarImage src={user?.photoURL || avatar.imageUrl} alt="User Avatar" />
                  )}
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handlePlaceholderClick('Settings')}>
                  <Settings className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePlaceholderClick('Support')}>
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

        <StatsCards />

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
