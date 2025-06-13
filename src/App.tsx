import { useEffect } from 'react';
import { cleanupService } from './services/cleanup';
import { RouterProvider } from "react-router-dom";

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
    
      <RouterProvider router={router} />
    
  );
}

export default App;
