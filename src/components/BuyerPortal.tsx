
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ArrowLeft } from "lucide-react";

interface BuyerPortalProps {
  onBack: () => void;
}

const BuyerPortal = ({ onBack }: BuyerPortalProps) => {
  const shops = [
    {
      id: 1,
      name: "Fresh Mart Grocery",
      address: "123 Main Street, Downtown",
      phone: "+91 98765 43210",
      distance: "0.2 km",
      rating: 4.5,
      isOpen: true
    },
    {
      id: 2,
      name: "Green Valley Store",
      address: "456 Park Avenue, Central",
      phone: "+91 98765 43211",
      distance: "0.5 km",
      rating: 4.3,
      isOpen: true
    },
    {
      id: 3,
      name: "Quick Stop Market",
      address: "789 Hill Road, Uptown",
      phone: "+91 98765 43212",
      distance: "0.8 km",
      rating: 4.1,
      isOpen: false
    },
    {
      id: 4,
      name: "Local Bazaar",
      address: "321 Market Street, Old Town",
      phone: "+91 98765 43213",
      distance: "1.2 km",
      rating: 4.4,
      isOpen: true
    }
  ];

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
                src="/lovable-uploads/10e1395f-4d55-494f-a401-42d47838d2c8.png" 
                alt="Grozo" 
                className="h-8"
              />
            </div>
            <h1 className="text-xl font-semibold text-white">Buyer Portal</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Local Grocery Stores</h2>
          <p className="text-slate-300">Find and contact nearby stores for grocery delivery</p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {shops.map((shop) => (
            <Card key={shop.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl mb-2 flex items-center">
                      {shop.name}
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                        shop.isOpen 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {shop.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </CardTitle>
                    <p className="text-slate-300 mb-1">{shop.address}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>{shop.distance} away</span>
                      <span>⭐ {shop.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleCall(shop.phone)}
                    className="bg-green-500 hover:bg-green-600 text-white flex-1"
                    disabled={!shop.isOpen}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Store
                  </Button>
                  <Button 
                    onClick={() => handleWhatsApp(shop.phone)}
                    variant="outline"
                    className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white flex-1"
                    disabled={!shop.isOpen}
                  >
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-slate-800/30 rounded-xl p-6 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-white mb-3">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
            <div>
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
              <p className="text-sm">Call or message the store</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
              <p className="text-sm">Place your order</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
              <p className="text-sm">Get it delivered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerPortal;
