
import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import BuyerPage from "./pages/BuyerPage";
import DriverPage from "./pages/DriverPage";
import ShopkeeperPage from "./pages/ShopkeeperPage";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/buyer",
    element: <BuyerPage />,
  },
  {
    path: "/driver", 
    element: <DriverPage />,
  },
  {
    path: "/shopkeeper",
    element: <ShopkeeperPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
