
import { useEffect } from 'react';
import { cleanupService } from './services/cleanup';
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { router } from "./router";

function App() {
  // Start cleanup service when app loads
  useEffect(() => {
    cleanupService.startAutoCleanup();
    
    return () => {
      cleanupService.stopAutoCleanup();
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
