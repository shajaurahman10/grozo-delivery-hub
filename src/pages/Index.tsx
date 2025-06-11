
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ShoppingCart, Home, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <img 
              src="/lovable-uploads/97179513-c10d-4d96-ac87-a097a7fab932.png" 
              alt="Grozo" 
              className="h-24 md:h-28 w-auto object-contain transition-transform duration-300 hover:scale-110 hover:rotate-2 cursor-pointer"
            />
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="lg" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Home className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">Home</span>
              </Button>
              <Button variant="ghost" size="lg" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Users className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">About</span>
              </Button>
              <Button variant="ghost" size="lg" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Settings className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">Support</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8">
            Get Groceries Delivered
            <br />
            <span className="text-green-400">from Local Shops</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 md:mb-10 max-w-3xl mx-auto px-4">
            Order by calling the nearby store. We'll connect you with a delivery driver in minutes.
          </p>
          <Link to="/buyer">
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-white px-8 md:px-10 py-6 md:py-7 text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto hover:scale-105"
            >
              Order Now
            </Button>
          </Link>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto px-4">
          {/* For Buyers */}
          <Link to="/buyer" className="block">
            <Card 
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105 h-full"
            >
              <CardContent className="p-8 md:p-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:bg-green-500/30 transition-colors">
                  <Phone className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-5">For Buyers</h3>
                <p className="text-slate-300 text-base md:text-lg">
                  Find local grocery stores, order by phone, and get your groceries delivered right to your doorstep.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* For Shops */}
          <Link to="/shopkeeper" className="block">
            <Card 
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105 h-full"
            >
              <CardContent className="p-8 md:p-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:bg-green-500/30 transition-colors">
                  <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-5">For Shops</h3>
                <p className="text-slate-300 text-base md:text-lg">
                  Receive orders from customers, request drivers, and manage deliveries efficiently for your business.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* For Drivers */}
          <Link to="/driver" className="block">
            <Card 
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105 h-full"
            >
              <CardContent className="p-8 md:p-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:bg-green-500/30 transition-colors">
                  <div className="text-2xl md:text-3xl text-green-400 flex items-center justify-center">
                    🏃‍♂️
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-5">For Drivers</h3>
                <p className="text-slate-300 text-base md:text-lg">
                  Accept delivery requests, earn money with flexible hours, and help connect customers with local stores.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 md:py-10 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <img 
            src="/lovable-uploads/97179513-c10d-4d96-ac87-a097a7fab932.png" 
            alt="Grozo" 
            className="h-20 md:h-24 w-auto object-contain mx-auto mb-4 md:mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-2 cursor-pointer"
          />
          <p className="text-slate-400 text-base md:text-lg mb-3">© 2024 Grozo. All rights reserved.</p>
          <p className="text-slate-500 text-sm md:text-base">
            Made by <span className="text-green-400 font-semibold">Shajaurahman</span> | 
            Contact: <a href="mailto:grozo.in@gmail.com" className="text-green-400 hover:text-green-300 transition-colors">grozo.in@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
