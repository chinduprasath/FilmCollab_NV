"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
        success: {
          iconTheme: {
            primary: "hsl(var(--success))",
            secondary: "hsl(var(--background))",
          },
        },
        error: {
          iconTheme: {
            primary: "hsl(var(--destructive))",
            secondary: "hsl(var(--background))",
          },
        },
      }}
    />
  );
}
