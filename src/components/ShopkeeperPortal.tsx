
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShopkeeperPortalProps {
  onBack: () => void;
}

interface DeliveryRequest {
  id: number;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  deliveryCharge: number;
  status: "Pending" | "Accepted" | "Delivered";
  timestamp: string;
}

const ShopkeeperPortal = ({ onBack }: ShopkeeperPortalProps) => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showShopRegistration, setShowShopRegistration] = useState(true);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);

  const [shopData, setShopData] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    deliveryAddress: "",
    totalAmount: "",
    deliveryCharge: ""
  });

  const { toast } = useToast();

  const handleShopRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopData.shopName || !shopData.ownerName || !shopData.phone || !shopData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setShowShopRegistration(false);
    toast({
      title: "Success",
      description: "Shop registered successfully! You can now post delivery requests.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyerName || !formData.buyerPhone || !formData.deliveryAddress || !formData.totalAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newRequest: DeliveryRequest = {
      id: Date.now(),
      buyerName: formData.buyerName,
      buyerPhone: formData.buyerPhone,
      deliveryAddress: formData.deliveryAddress,
      totalAmount: parseFloat(formData.totalAmount),
      deliveryCharge: parseFloat(formData.deliveryCharge) || 30,
      status: "Pending",
      timestamp: new Date().toLocaleString()
    };

    setRequests([newRequest, ...requests]);
    setFormData({
      buyerName: "",
      buyerPhone: "",
      deliveryAddress: "",
      totalAmount: "",
      deliveryCharge: ""
    });
    setShowNewRequest(false);

    toast({
      title: "Success",
      description: "Delivery request posted successfully!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500/20 text-yellow-400";
      case "Accepted": return "bg-blue-500/20 text-blue-400";
      case "Delivered": return "bg-green-500/20 text-green-400";
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
                className="h-18 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-110 hover:rotate-2 cursor-pointer"
              />
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-white">Shopkeeper Portal</h1>
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
                      value={shopData.shopName}
                      onChange={(e) => setShopData(prev => ({...prev, shopName: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerName" className="text-slate-300">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      value={shopData.ownerName}
                      onChange={(e) => setShopData(prev => ({...prev, ownerName: e.target.value}))}
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
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white w-full md:w-auto">
                  Register Shop
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
                className="bg-green-500 hover:bg-green-600 text-white w-full md:w-auto"
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
                          value={formData.buyerName}
                          onChange={(e) => setFormData(prev => ({...prev, buyerName: e.target.value}))}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="buyerPhone" className="text-slate-300">Buyer Phone *</Label>
                        <Input
                          id="buyerPhone"
                          value={formData.buyerPhone}
                          onChange={(e) => setFormData(prev => ({...prev, buyerPhone: e.target.value}))}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deliveryAddress" className="text-slate-300">Delivery Address *</Label>
                      <Input
                        id="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData(prev => ({...prev, deliveryAddress: e.target.value}))}
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
                          value={formData.totalAmount}
                          onChange={(e) => setFormData(prev => ({...prev, totalAmount: e.target.value}))}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryCharge" className="text-slate-300">Delivery Charge (₹)</Label>
                        <Input
                          id="deliveryCharge"
                          type="number"
                          value={formData.deliveryCharge}
                          onChange={(e) => setFormData(prev => ({...prev, deliveryCharge: e.target.value}))}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="30"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                      <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                        Post Request
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
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{request.buyerName}</h3>
                        <p className="text-slate-300 text-sm">{request.buyerPhone}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)} self-start`}>
                        {request.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm">Delivery Address</p>
                        <p className="text-white text-sm md:text-base">{request.deliveryAddress}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                        <div>
                          <p className="text-slate-400 text-sm">Total Amount</p>
                          <p className="text-white font-semibold">₹{request.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Delivery Charge</p>
                          <p className="text-green-400 font-semibold">₹{request.deliveryCharge}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm">Posted: {request.timestamp}</p>
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
