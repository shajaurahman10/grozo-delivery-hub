import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Home, Package, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createShop, createDeliveryRequest, getDeliveryRequests, Shop, DeliveryRequest } from "@/services/database";

interface ShopkeeperPortalProps {
  onBack: () => void;
}

const ShopkeeperPortal = ({ onBack }: ShopkeeperPortalProps) => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showShopRegistration, setShowShopRegistration] = useState(true);
  const [registeredShop, setRegisteredShop] = useState<Shop | null>(null);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const [shopData, setShopData] = useState({
    shop_name: "",
    owner_name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_phone: "",
    delivery_address: "",
    total_amount: "",
    delivery_charge: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    if (registeredShop) {
      loadDeliveryRequests();
    }
  }, [registeredShop]);

  const loadDeliveryRequests = async () => {
    try {
      const requestsData = await getDeliveryRequests();
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const handleShopRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopData.shop_name || !shopData.owner_name || !shopData.phone || !shopData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newShop = await createShop(shopData);
      setRegisteredShop(newShop);
      setShowShopRegistration(false);
      toast({
        title: "Success",
        description: "Shop registered successfully! You can now post delivery requests.",
      });
    } catch (error) {
      console.error('Error registering shop:', error);
      toast({
        title: "Error",
        description: "Failed to register shop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyer_name || !formData.buyer_phone || !formData.delivery_address || !formData.total_amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newRequest = await createDeliveryRequest({
        shop_id: registeredShop?.id,
        buyer_name: formData.buyer_name,
        buyer_phone: formData.buyer_phone,
        delivery_address: formData.delivery_address,
        total_amount: parseFloat(formData.total_amount),
        delivery_charge: parseFloat(formData.delivery_charge) || 30,
        status: 'pending'
      });

      setRequests([newRequest, ...requests]);
      setFormData({
        buyer_name: "",
        buyer_phone: "",
        delivery_address: "",
        total_amount: "",
        delivery_charge: ""
      });
      setShowNewRequest(false);

      toast({
        title: "Success",
        description: "Delivery request posted successfully!",
      });
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: "Failed to create delivery request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "accepted": return "bg-blue-500/20 text-blue-400";
      case "picked_up": return "bg-orange-500/20 text-orange-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
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
                className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <img 
                src="/lovable-uploads/97179513-c10d-4d96-ac87-a097a7fab932.png" 
                alt="Grozo" 
                className="h-18 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-110 hover:rotate-2 cursor-pointer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Home</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Package className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Orders</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Drivers</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Shop Registration */}
        {showShopRegistration && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl md:text-2xl">Register Your Shop</CardTitle>
              <p className="text-slate-300 text-sm md:text-base">Please register your shop details to start receiving delivery requests</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShopRegistration} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shopName" className="text-slate-300">Shop Name *</Label>
                    <Input
                      id="shopName"
                      value={shopData.shop_name}
                      onChange={(e) => setShopData(prev => ({...prev, shop_name: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerName" className="text-slate-300">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      value={shopData.owner_name}
                      onChange={(e) => setShopData(prev => ({...prev, owner_name: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shopData.phone}
                      onChange={(e) => setShopData(prev => ({...prev, phone: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-slate-300">Pincode</Label>
                    <Input
                      id="pincode"
                      value={shopData.pincode}
                      onChange={(e) => setShopData(prev => ({...prev, pincode: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-slate-300">Shop Address *</Label>
                  <Input
                    id="address"
                    value={shopData.address}
                    onChange={(e) => setShopData(prev => ({...prev, address: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-slate-300">City</Label>
                  <Input
                    id="city"
                    value={shopData.city}
                    onChange={(e) => setShopData(prev => ({...prev, city: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600 text-white w-full md:w-auto transition-all duration-300 hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Shop"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Only show after shop registration */}
        {!showShopRegistration && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Delivery Requests</h2>
                <p className="text-slate-300 text-sm md:text-base">Manage your delivery orders</p>
              </div>
              <Button 
                onClick={() => setShowNewRequest(true)}
                className="bg-green-500 hover:bg-green-600 text-white w-full md:w-auto transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>

            {/* New Request Form */}
            {showNewRequest && (
              <Card className="bg-slate-800/50 border-slate-700 mb-8">
                <CardHeader>
                  <CardTitle className="text-white">Create Delivery Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="buyerName" className="text-slate-300">Buyer Name *</Label>
                        <Input
                          id="buyerName"
                          value={formData.buyer_name}
                          onChange={(e) => setFormData(prev => ({...prev, buyer_name: e.target.value}))}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="buyerPhone" className="text-slate-300">Buyer Phone *</Label>
                        <Input
                          id="buyerPhone"
                          value={formData.buyer_phone}
                          onChange={(e) => setFormData(prev => ({...prev, buyer_phone: e.target.value}))}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deliveryAddress" className="text-slate-300">Delivery Address *</Label>
                      <Input
                        id="deliveryAddress"
                        value={formData.delivery_address}
                        onChange={(e) => setFormData(prev => ({...prev, delivery_address: e.target.value}))}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="totalAmount" className="text-slate-300">Total Amount (₹) *</Label>
                        <Input
                          id="totalAmount"
                          type="number"
                          value={formData.total_amount}
                          onChange={(e) => setFormData(prev => ({...prev, total_amount: e.target.value}))}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryCharge" className="text-slate-300">Delivery Charge (₹)</Label>
                        <Input
                          id="deliveryCharge"
                          type="number"
                          value={formData.delivery_charge}
                          onChange={(e) => setFormData(prev => ({...prev, delivery_charge: e.target.value}))}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="30"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                      <Button 
                        type="submit" 
                        className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                        disabled={loading}
                      >
                        {loading ? "Posting..." : "Post Request"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowNewRequest(false)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-all duration-300 hover:scale-105"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Delivery Requests List */}
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{request.buyer_name}</h3>
                        <p className="text-slate-300 text-sm">{request.buyer_phone}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)} self-start capitalize`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm">Delivery Address</p>
                        <p className="text-white text-sm md:text-base">{request.delivery_address}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                        <div>
                          <p className="text-slate-400 text-sm">Total Amount</p>
                          <p className="text-white font-semibold">₹{request.total_amount}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Delivery Charge</p>
                          <p className="text-green-400 font-semibold">₹{request.delivery_charge}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm">Posted: {new Date(request.created_at || '').toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}

              {requests.length === 0 && (
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6 md:p-8 text-center">
                    <p className="text-slate-300">No delivery requests yet. Create your first request to get started!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperPortal;
