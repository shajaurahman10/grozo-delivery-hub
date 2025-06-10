
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ShoppingCart } from "lucide-react";
import BuyerPortal from "@/components/BuyerPortal";
import ShopkeeperPortal from "@/components/ShopkeeperPortal";
import DriverPortal from "@/components/DriverPortal";

const Index = () => {
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);

  if (selectedPortal === "buyer") {
    return <BuyerPortal onBack={() => setSelectedPortal(null)} />;
  }
  
  if (selectedPortal === "shopkeeper") {
    return <ShopkeeperPortal onBack={() => setSelectedPortal(null)} />;
  }
  
  if (selectedPortal === "driver") {
    return <DriverPortal onBack={() => setSelectedPortal(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/10e1395f-4d55-494f-a401-42d47838d2c8.png" 
              alt="Grozo" 
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get Groceries Delivered
            <br />
            <span className="text-green-400">from Local Shops</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Order by calling the nearby store. We'll connect you with a delivery driver in minutes.
          </p>
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedPortal("buyer")}
          >
            Order Now
          </Button>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* For Buyers */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setSelectedPortal("buyer")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/30 transition-colors">
                <Phone className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Buyers</h3>
              <p className="text-slate-300">
                Find local grocery stores, order phone
              </p>
            </CardContent>
          </Card>

          {/* For Shops */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setSelectedPortal("shopkeeper")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/30 transition-colors">
                <ShoppingCart className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Shops</h3>
              <p className="text-slate-300">
                Request a driver, deliver to your customer
              </p>
            </CardContent>
          </Card>

          {/* For Drivers */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setSelectedPortal("driver")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/30 transition-colors">
                <div className="w-8 h-8 text-green-400 flex items-center justify-center">
                  🏃‍♂️
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Drivers</h3>
              <p className="text-slate-300">
                Earn money with flexible hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="/lovable-uploads/10e1395f-4d55-494f-a401-42d47838d2c8.png" 
            alt="Grozo" 
            className="h-10 w-auto object-contain mx-auto mb-4"
          />
          <p className="text-slate-400">© 2024 Grozo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
