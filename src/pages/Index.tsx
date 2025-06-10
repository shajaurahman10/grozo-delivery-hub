
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ShoppingCart, Home, Users, Settings } from "lucide-react";
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
          <div className="flex items-center justify-between">
            <img 
              src="/lovable-uploads/97179513-c10d-4d96-ac87-a097a7fab932.png" 
              alt="Grozo" 
              className="h-20 md:h-24 w-auto object-contain transition-transform duration-300 hover:scale-110 hover:rotate-2 cursor-pointer"
            />
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Home</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">About</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Support</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Get Groceries Delivered
            <br />
            <span className="text-green-400">from Local Shops</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Order by calling the nearby store. We'll connect you with a delivery driver in minutes.
          </p>
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto hover:scale-105"
            onClick={() => setSelectedPortal("buyer")}
          >
            Order Now
          </Button>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
          {/* For Buyers */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setSelectedPortal("buyer")}
          >
            <CardContent className="p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-green-500/30 transition-colors">
                <Phone className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">For Buyers</h3>
              <p className="text-slate-300 text-sm md:text-base">
                Find local grocery stores, order by phone
              </p>
            </CardContent>
          </Card>

          {/* For Shops */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setSelectedPortal("shopkeeper")}
          >
            <CardContent className="p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-green-500/30 transition-colors">
                <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">For Shops</h3>
              <p className="text-slate-300 text-sm md:text-base">
                Request a driver, deliver to your customer
              </p>
            </CardContent>
          </Card>

          {/* For Drivers */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setSelectedPortal("driver")}
          >
            <CardContent className="p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-green-500/30 transition-colors">
                <div className="w-6 h-6 md:w-8 md:h-8 text-green-400 flex items-center justify-center text-xl md:text-2xl">
                  🏃‍♂️
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">For Drivers</h3>
              <p className="text-slate-300 text-sm md:text-base">
                Earn money with flexible hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-6 md:py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="/lovable-uploads/97179513-c10d-4d96-ac87-a097a7fab932.png" 
            alt="Grozo" 
            className="h-16 md:h-20 w-auto object-contain mx-auto mb-3 md:mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-2 cursor-pointer"
          />
          <p className="text-slate-400 text-sm md:text-base mb-2">© 2024 Grozo. All rights reserved.</p>
          <p className="text-slate-500 text-xs md:text-sm">
            Made by <span className="text-green-400 font-semibold">Shajaurahman</span> | 
            Contact: <a href="mailto:grozo.in@gmail.com" className="text-green-400 hover:text-green-300 transition-colors">grozo.in@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
