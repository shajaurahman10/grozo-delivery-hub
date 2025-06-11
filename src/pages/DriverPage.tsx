
import DriverPortal from "@/components/DriverPortal";

const DriverPage = () => {
  return <DriverPortal onBack={() => window.history.back()} />;
};

export default DriverPage;
