"use client";

import { AppSidebar } from "@/components/app-sidebar";
import HeaderComponent from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<HeaderComponent />
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
