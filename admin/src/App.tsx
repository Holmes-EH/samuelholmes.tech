import type { Component } from "solid-js";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { Button } from "@/components/ui/Button";
import ModeToggle from "@/components/ModeToggle";

const App: Component = () => {
  const storageManager = cookieStorageManagerSSR(document.cookie);
  return (
    <>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <ModeToggle />
        <div class="bg-background text-foreground">
          <p>Hello tailwind & Solid-shadcn</p>
        </div>
        <Button>Hi !</Button>
      </ColorModeProvider>
    </>
  );
};

export default App;
