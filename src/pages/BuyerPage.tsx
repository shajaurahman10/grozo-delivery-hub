
import BuyerPortal from "@/components/BuyerPortal";

const BuyerPage = () => {
  return <BuyerPortal onBack={() => window.history.back()} />;
};

export default BuyerPage;
