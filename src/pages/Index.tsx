
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ShoppingCart, Home, Users, Settings, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img 
              src="/lovable-uploads/97179513-c10d-4d96-ac87-a097a7fab932.png" 
              alt="Grozo" 
              className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('home')}
                className={`text-slate-300 hover:text-white transition-all duration-300 ${activeSection === 'home' ? 'text-green-400' : ''}`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('about')}
                className={`text-slate-300 hover:text-white transition-all duration-300 ${activeSection === 'about' ? 'text-green-400' : ''}`}
              >
                <Users className="w-4 h-4 mr-2" />
                About
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('support')}
                className={`text-slate-300 hover:text-white transition-all duration-300 ${activeSection === 'support' ? 'text-green-400' : ''}`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Support
              </Button>
            </nav>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              className="md:hidden text-slate-300"
              onClick={() => {
                const nav = document.getElementById('mobile-nav');
                nav?.classList.toggle('hidden');
              }}
            >
              ☰
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          <div id="mobile-nav" className="hidden md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('home')}
                className="text-slate-300 hover:text-white justify-start"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('about')}
                className="text-slate-300 hover:text-white justify-start"
              >
                <Users className="w-4 h-4 mr-2" />
                About
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('support')}
                className="text-slate-300 hover:text-white justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Get Groceries Delivered
            <br />
            <span className="text-green-400">from Local Shops</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6 md:mb-8 max-w-3xl mx-auto">
            Order by calling the nearby store. We'll connect you with a delivery driver in minutes.
          </p>
          <Link to="/buyer">
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto hover:scale-105"
            >
              Order Now
            </Button>
          </Link>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* For Buyers */}
          <Link to="/buyer" className="block">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105 h-full">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-green-500/30 transition-colors">
                  <Phone className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">For Buyers</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  Find local grocery stores, order by phone, and get your groceries delivered right to your doorstep.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* For Shops */}
          <Link to="/shopkeeper" className="block">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105 h-full">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-green-500/30 transition-colors">
                  <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">For Shops</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  Receive orders from customers, request drivers, and manage deliveries efficiently for your business.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* For Drivers */}
          <Link to="/driver" className="block">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group hover:scale-105 h-full">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-green-500/30 transition-colors">
                  <div className="text-2xl md:text-3xl text-green-400 flex items-center justify-center">
                    🏃‍♂️
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">For Drivers</h3>
                <p className="text-slate-300 text-sm md:text-base">
                  Accept delivery requests, earn money with flexible hours, and help connect customers with local stores.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-slate-800/30 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Grozo Works</h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
              Our platform connects buyers, shopkeepers, and delivery drivers to create a seamless grocery delivery experience
            </p>
          </div>

          {/* Process Flow */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
              {/* Step 1 */}
              <Card className="bg-slate-700/50 border-slate-600 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-400">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Buyer Orders</h3>
                  <p className="text-slate-300 text-sm">Customer finds local shop and places order via phone call</p>
                </CardContent>
              </Card>

              <div className="hidden lg:flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-green-400" />
              </div>

              {/* Step 2 */}
              <Card className="bg-slate-700/50 border-slate-600 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-400">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Shop Accepts</h3>
                  <p className="text-slate-300 text-sm">Shopkeeper confirms order and requests nearby delivery driver</p>
                </CardContent>
              </Card>

              <div className="hidden lg:flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-green-400" />
              </div>

              {/* Step 3 */}
              <Card className="bg-slate-700/50 border-slate-600 text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-400">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Driver Delivers</h3>
                  <p className="text-slate-300 text-sm">Driver picks up groceries and delivers to customer's address</p>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Local Support</h3>
                  <p className="text-slate-300 text-sm">Supporting local grocery stores and creating employment for delivery drivers</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Quick Delivery</h3>
                  <p className="text-slate-300 text-sm">Fast delivery service connecting you with nearby shops for quick grocery delivery</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Easy Payment</h3>
                  <p className="text-slate-300 text-sm">Simple cash on delivery payment system - pay for groceries + delivery charge</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Support & Contact</h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
              Need help? We're here to support you every step of the way
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Customer Support</h3>
                <p className="text-slate-300 mb-4">Need help with your order? Contact our support team</p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Call Support
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Partner with Us</h3>
                <p className="text-slate-300 mb-4">Want to register your shop or become a driver?</p>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Join Grozo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Technical Help</h3>
                <p className="text-slate-300 mb-4">Having technical issues with the platform?</p>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  Get Help
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="text-center mt-12 md:mt-16">
            <Card className="bg-slate-700/30 border-slate-600 max-w-2xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Get in Touch</h3>
                <div className="space-y-3">
                  <p className="text-slate-300">
                    <strong>Email:</strong> <a href="mailto:grozo.in@gmail.com" className="text-green-400 hover:text-green-300">grozo.in@gmail.com</a>
                  </p>
                  <p className="text-slate-300">
                    <strong>Phone:</strong> <a href="tel:+911234567890" className="text-green-400 hover:text-green-300">+91 123 456 7890</a>
                  </p>
                  <p className="text-slate-300">
                    <strong>Business Hours:</strong> 24/7 Support Available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 md:py-10">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="/lovable-uploads/97179513-c10d-4d96-ac87-a097a7fab932.png" 
            alt="Grozo" 
            className="h-16 md:h-20 w-auto object-contain mx-auto mb-4 transition-transform duration-300 hover:scale-110 cursor-pointer"
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
