import { RouteSectionProps } from "@solidjs/router";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import ModeToggle from "@/components/ModeToggle";

const Layout = (props: RouteSectionProps<unknown>) => {
  const storageManager = cookieStorageManagerSSR(document.cookie);
  return (
    <div class="h-[100vh] flex flex-col justify-center">
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <header class="flex justify-end">
          <ModeToggle />
        </header>
        <main class="flex items-center justify-center flex-col grow">
          {props.children}
        </main>
        <footer>Footer</footer>
      </ColorModeProvider>
    </div>
  );
};

export default Layout;
