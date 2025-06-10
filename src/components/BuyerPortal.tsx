
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ArrowLeft } from "lucide-react";

interface BuyerPortalProps {
  onBack: () => void;
}

const BuyerPortal = ({ onBack }: BuyerPortalProps) => {
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <img 
                src="/lovable-uploads/97179513-c10d-4d96-ac87-a097a7fab932.png" 
                alt="Grozo" 
                className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 hover:scale-110 hover:rotate-2 cursor-pointer"
              />
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-white">Buyer Portal</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Local Grocery Stores</h2>
          <p className="text-slate-300 text-sm md:text-base">Find and contact nearby stores for grocery delivery</p>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-4 md:p-6 max-w-2xl mx-auto text-center">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4">No shops available yet</h3>
          <p className="text-slate-300 mb-4 text-sm md:text-base">
            Shopkeepers need to register their stores first. Once they do, you'll see all local shops here!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
              <p className="text-sm text-slate-300">Shops register on platform</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
              <p className="text-sm text-slate-300">Call or message the store</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
              <p className="text-sm text-slate-300">Get it delivered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerPortal;
