import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { A, useLocation } from "@solidjs/router";
import ModeToggle from "./ModeToggle";
import LayoutDashboard from "lucide-solid/icons/layout-dashboard";
import Folder from "lucide-solid/icons/folder";
import LogOut from "lucide-solid/icons/log-out";

const AppSidebar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const isLoginPage = () => location.pathname === "/login";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {isAuthenticated() && (
          <SidebarGroup>
            <SidebarGroupLabel class="flex justify-between">
              {user()?.name || "Admin"}
              <ModeToggle />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    class="hover:text-primary transition-colors cursor-pointer"
                    tooltip="Dashboard"
                  >
                    <A href="/" class="flex gap-2 items-center">
                      <LayoutDashboard size={18} /> Dashboard
                    </A>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    class="hover:text-primary transition-colors cursor-pointer"
                    tooltip="Projects"
                  >
                    <A href="/projects" class="flex gap-2 items-center">
                      <Folder size={18} /> Projects
                    </A>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                class="hover:text-primary transition-colors cursor-pointer bg-slate-800 hover:bg-slate-700"
                tooltip="Logout"
                onClick={logout}
              >
                <LogOut size={18} />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
