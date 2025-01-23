import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useLocation } from "react-router-dom";

export default function Home() {
    const location = useLocation();
    const endpoint = location.pathname;
    const page = endpoint.slice(1)
    const defaultPage = page ?? "Dashboard"

    return (
        <>
            {/* Wrap Sidebar and Content in SidebarProvider */}
            <SidebarProvider>
                {/* Sidebar */}
                <AppSidebar />

                {/* Main Content */}
                <SidebarInset>
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Page
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{defaultPage}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <Outlet />

                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
