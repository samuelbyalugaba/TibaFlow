"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bed,
  Boxes,
  FlaskConical,
  LayoutDashboard,
  Scissors,
  Settings,
  Siren,
  Users,
  Route,
} from "lucide-react";

import { useUser } from "@/firebase";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const SIDEBAR_ITEMS = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/outpatient",
    icon: Route,
    label: "Outpatient",
  },
  {
    href: "/patients",
    icon: Users,
    label: "Patients",
  },
  {
    href: "/emergency",
    icon: Siren,
    label: "Emergency",
  },
  {
    href: "/surgery",
    icon: Scissors,
    label: "Surgery",
  },
  {
    href: "/inpatient",
    icon: Bed,
    label: "Inpatient",
  },
  {
    href: "/labs",
    icon: FlaskConical,
    label: "Labs & Radiology",
  },
  {
    href: "/inventory",
    icon: Boxes,
    label: "Inventory",
  },
  {
    href: "/reports",
    icon: BarChart3,
    label: "Reports",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const avatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
  const userInitials = user?.email?.charAt(0).toUpperCase() || "U";
  
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 justify-center">
        <Logo className="size-32" />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="items-center">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/settings"}
              tooltip={{ children: "Settings" }}
            >
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div
          className={cn(
            "flex w-full items-center gap-3 p-2",
            "group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-0"
          )}
        >
          <Avatar className="size-8">
            <AvatarImage src={user?.photoURL || avatar?.imageUrl} alt="User Avatar" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">{user?.displayName || user?.email}</span>
            <span className="text-xs text-muted-foreground">Staff</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
