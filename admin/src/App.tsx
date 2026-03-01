import type { Component } from "solid-js";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { Button } from "@/components/ui/Button";

const App: Component = () => {
  const storageManager = cookieStorageManagerSSR(document.cookie);
  return (
    <>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <div class="bg-background text-foreground">
          <p>Hello tailwind & Solid-shadcn</p>
        </div>
        <Button>Hi !</Button>
      </ColorModeProvider>
    </>
  );
};

export default App;
