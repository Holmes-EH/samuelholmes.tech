import { A, RouteSectionProps, useLocation } from "@solidjs/router";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import AppSidebar from "./AppSidebar";

const Layout = (props: RouteSectionProps<unknown>) => {
  const storageManager = cookieStorageManagerSSR(document.cookie);

  return (
    <SidebarProvider defaultOpen={false}>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <AppSidebar />
        <main class="flex flex-col flex-1 min-w-0">
          <div class="sticky top-0 z-10">
            <SidebarTrigger class="bg-background" />
          </div>
          <div class="flex flex-col items-center justify-center flex-1 px-4 py-6">
            {props.children}
          </div>
        </main>
        <Toaster />
      </ColorModeProvider>
    </SidebarProvider>
  );
};

export default Layout;
