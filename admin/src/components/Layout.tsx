import { A, RouteSectionProps, useLocation } from "@solidjs/router";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import ModeToggle from "@/components/ModeToggle";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const Layout = (props: RouteSectionProps<unknown>) => {
  const storageManager = cookieStorageManagerSSR(document.cookie);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Don't show layout on login page
  const isLoginPage = () => location.pathname === "/login";

  return (
    <div class="h-[100vh] flex flex-col justify-center">
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <header class="flex justify-end">
          {!isLoginPage() && isAuthenticated() && (
            <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
              <div class="flex items-center gap-6">
                <h1 class="text-xl font-bold text-primary">Admin Panel</h1>
                <div class="flex gap-4">
                  <A
                    href="/"
                    class="text-slate-300 hover:text-primary transition-colors"
                  >
                    Dashboard
                  </A>
                  <A
                    href="/projects"
                    class="text-slate-300 hover:text-primary transition-colors"
                  >
                    Projects
                  </A>
                </div>
              </div>
              <button
                onClick={logout}
                class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded transition-colors"
              >
                Logout
              </button>
            </nav>
          )}
          <ModeToggle />
        </header>
        <main class="flex items-center justify-center flex-col grow">
          {props.children}
        </main>
        <Toaster />

        {/* <footer>Footer</footer> */}
      </ColorModeProvider>
    </div>
  );
};

export default Layout;
