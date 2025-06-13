import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Home, Package, Users, LogOut, User, Phone, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  createShop, 
  createDeliveryRequest, 
  getDeliveryRequestsByShop, 
  subscribeToDriverStatus,
  getDriverById,
  Shop, 
  DeliveryRequest 
} from "@/services/database";
import { saveProfileToCookies, getProfileFromCookies, clearProfileFromCookies } from "@/utils/cookies";
import LocationPicker from './LocationPicker';

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
  
  const [deliveryLocation, setDeliveryLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
    city: string;
    area: string;
  } | null>(null);

  const [shopLocation, setShopLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
    city: string;
    area: string;
  } | null>(null);

  useEffect(() => {
    // Check for stored profile on component mount
    const storedProfile = getProfileFromCookies('shopkeeper');
    if (storedProfile) {
      setRegisteredShop(storedProfile.data);
      setShowShopRegistration(false);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${storedProfile.data.shop_name}`,
      });
    }
  }, []);

  useEffect(() => {
    if (registeredShop) {
      loadDeliveryRequests();
      
      // Subscribe to driver status updates
      const channel = subscribeToDriverStatus((payload) => {
        console.log('Driver status update:', payload);
        // Refresh requests when driver status changes
        loadDeliveryRequests();
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [registeredShop]);

  const loadDeliveryRequests = async () => {
    if (!registeredShop) return;
    
    try {
      const requestsData = await getDeliveryRequestsByShop(registeredShop.id!);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const handleShopRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopData.shop_name || !shopData.owner_name || !shopData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!shopLocation) {
      toast({
        title: "Error",
        description: "Please select your shop location",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newShop = await createShop({
        ...shopData,
        address: shopLocation.address,
        city: shopLocation.city
      });
      setRegisteredShop(newShop);
      
      // Save to cookies
      saveProfileToCookies('shopkeeper', newShop);
      
      setShowShopRegistration(false);
      toast({
        title: "Success",
        description: "Shop registered and saved! You won't need to enter details again.",
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

  const handleLogout = () => {
    clearProfileFromCookies('shopkeeper');
    setRegisteredShop(null);
    setShowShopRegistration(true);
    setShopData({
      shop_name: "",
      owner_name: "",
      phone: "",
      address: "",
      city: "",
      pincode: ""
    });
    setRequests([]);
    toast({
      title: "Logged out",
      description: "Your shop profile has been cleared from this device.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.buyer_name || !formData.buyer_phone || !formData.total_amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!deliveryLocation) {
      toast({
        title: "Error",
        description: "Please select delivery location",
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
        delivery_address: deliveryLocation.address,
        total_amount: parseFloat(formData.total_amount),
        delivery_charge: parseFloat(formData.delivery_charge) || 30,
        status: 'pending',
        buyer_location: deliveryLocation.coordinates,
        shop_location: shopLocation?.coordinates || { lat: 0, lng: 0 }
      });

      await loadDeliveryRequests();
      setFormData({
        buyer_name: "",
        buyer_phone: "",
        delivery_address: "",
        total_amount: "",
        delivery_charge: ""
      });
      setDeliveryLocation(null);
      setShowNewRequest(false);

      toast({
        title: "Success",
        description: `Delivery request posted! Found drivers within 3km radius.`,
      });
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create delivery request. Please try again.",
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
            {registeredShop && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-slate-300 text-sm">Shop:</p>
                  <p className="text-white font-medium">{registeredShop.shop_name}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Shop Registration */}
        {showShopRegistration && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Register Your Shop</CardTitle>
              <p className="text-slate-300">Please register your shop details to start receiving delivery requests. Your details will be saved for future visits.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShopRegistration} className="space-y-6">
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
                
                {/* Shop Location Picker */}
                <div>
                  <LocationPicker
                    onLocationSelect={setShopLocation}
                    placeholder="Select Your Shop Location"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600 text-white w-full"
                  disabled={loading || !shopLocation}
                >
                  {loading ? "Registering..." : "Register Shop"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!showShopRegistration && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Delivery Requests</h2>
                <p className="text-slate-300">Manage your delivery orders</p>
              </div>
              <Button 
                onClick={() => setShowNewRequest(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
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
                  <p className="text-slate-300">Only drivers within 3km radius will receive this request</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                    
                    {/* Delivery Location Picker */}
                    <div>
                      <LocationPicker
                        onLocationSelect={setDeliveryLocation}
                        placeholder="Select Delivery Location"
                      />
                      {deliveryLocation && (
                        <div className="mt-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                          <p className="text-green-400 text-sm">
                            📍 Selected: {deliveryLocation.address}
                          </p>
                        </div>
                      )}
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
                    <div className="flex space-x-3">
                      <Button 
                        type="submit" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={loading || !deliveryLocation}
                      >
                        {loading ? "Posting..." : "Post Request"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowNewRequest(false)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
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
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{request.buyer_name}</h3>
                        <p className="text-slate-300">{request.buyer_phone}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)} capitalize`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm">Delivery Address</p>
                        <p className="text-white">{request.delivery_address}</p>
                      </div>
                      <div className="flex space-x-6">
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

                    {/* Driver Profile Display */}
                    {request.drivers && request.status !== 'pending' && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-blue-400 font-semibold flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Driver Assigned
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-white font-medium text-lg">{request.drivers.full_name}</p>
                            <p className="text-slate-300 flex items-center mt-1">
                              <Phone className="w-4 h-4 mr-2" />
                              {request.drivers.phone}
                            </p>
                            <p className="text-slate-400 text-sm flex items-center mt-1">
                              <Car className="w-4 h-4 mr-2" />
                              {request.drivers.vehicle_type}
                            </p>
                            {request.drivers.license_number && (
                              <p className="text-slate-400 text-sm">License: {request.drivers.license_number}</p>
                            )}
                          </div>
                          <div className="flex items-center justify-end">
                            <Button
                              onClick={() => window.open(`tel:${request.drivers.phone}`, '_self')}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call Driver
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-slate-400 text-sm mt-4">Posted: {new Date(request.created_at || '').toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}

              {requests.length === 0 && (
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-8 text-center">
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
