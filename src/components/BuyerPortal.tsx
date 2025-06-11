
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, MapPin, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getShops, createBuyer, Shop, Buyer } from "@/services/database";

interface BuyerPortalProps {
  onBack: () => void;
}

const BuyerPortal = ({ onBack }: BuyerPortalProps) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showRegistration, setShowRegistration] = useState(true);
  const [registeredBuyer, setRegisteredBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(false);

  const [buyerData, setBuyerData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const shopsData = await getShops();
      setShops(shopsData);
    } catch (error) {
      console.error('Error loading shops:', error);
    }
  };

  const handleBuyerRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerData.full_name || !buyerData.phone || !buyerData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newBuyer = await createBuyer(buyerData);
      setRegisteredBuyer(newBuyer);
      setShowRegistration(false);
      toast({
        title: "Success",
        description: "Profile registered successfully! You can now browse shops.",
      });
    } catch (error) {
      console.error('Error registering buyer:', error);
      toast({
        title: "Error",
        description: "Failed to register profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCallShop = (phone: string, shopName: string) => {
    window.open(`tel:${phone}`, '_self');
    toast({
      title: "Calling Shop",
      description: `Calling ${shopName}...`,
    });
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
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Buyer Registration */}
        {showRegistration && (
          <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Register as Buyer</CardTitle>
              <p className="text-slate-300">Complete your profile to start ordering from local shops</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuyerRegistration} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-slate-300">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={buyerData.full_name}
                      onChange={(e) => setBuyerData(prev => ({...prev, full_name: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={buyerData.phone}
                      onChange={(e) => setBuyerData(prev => ({...prev, phone: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-slate-300">Address *</Label>
                  <Input
                    id="address"
                    value={buyerData.address}
                    onChange={(e) => setBuyerData(prev => ({...prev, address: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-slate-300">City</Label>
                    <Input
                      id="city"
                      value={buyerData.city}
                      onChange={(e) => setBuyerData(prev => ({...prev, city: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-slate-300">Pincode</Label>
                    <Input
                      id="pincode"
                      value={buyerData.pincode}
                      onChange={(e) => setBuyerData(prev => ({...prev, pincode: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600 text-white w-full"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Shop Listings */}
        {!showRegistration && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Local Grocery Shops</h2>
              <p className="text-slate-300">Call the shop directly to place your order</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Card key={shop.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{shop.shop_name}</h3>
                        <p className="text-slate-300 text-sm">Owner: {shop.owner_name}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-slate-300 text-sm">4.5</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-slate-400 text-sm flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {shop.phone}
                      </p>
                      <p className="text-slate-400 text-sm flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                        {shop.address}
                        {shop.city && `, ${shop.city}`}
                        {shop.pincode && ` - ${shop.pincode}`}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleCallShop(shop.phone, shop.shop_name)}
                      className="bg-green-500 hover:bg-green-600 text-white w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call to Order
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {shops.length === 0 && (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="p-8 text-center">
                  <p className="text-slate-300">No shops registered yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerPortal;
