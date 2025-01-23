import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "../auth/auth-context"

// This is sample data.
const data = {
  teams: [
    {
      name: "My Company",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "My System",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Kanban Board",
          url: "/kanban-board",
        },
      ],
    },
    {
      title: "Tasks Management",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Workspace",
          url: "/workspaces",
        },
        {
          title: "Project",
          url: "/projects",
        },
        {
          title: "Issue",
          url: "/issues",
        },
        {
          title: "Task",
          url: "/tasks",
        },
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "App User",
      url: "/app-user",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();

  const currentUser = {
    name: user?.appUser?.userName ?? "Invalid User",
    email: user?.appUser?.email ?? "",
    avatar: "/avatar.jpg",
    logout,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
