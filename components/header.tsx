"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function HeaderComponent() {
	const currentPath = usePathname();
	const pathSegments = currentPath.split("/").filter((segment) => segment);
	pathSegments.unshift("home");

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						{pathSegments.map((segment, index) => {
							const href =
								"/" +
								pathSegments.slice(1, index + 1).join("/");
							const isLast = index === pathSegments.length - 1;
							return (
								<React.Fragment key={segment}>
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage>
												{capitalizeFirstLetter(segment)}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink href={href}>
												{capitalizeFirstLetter(segment)}
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
