
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DriverPortalProps {
  onBack: () => void;
}

interface DeliveryRequest {
  id: number;
  shopName: string;
  shopLocation: string;
  buyerName: string;
  buyerAddress: string;
  totalAmount: number;
  deliveryCharge: number;
  distance: string;
  timestamp: string;
}

interface ActiveDelivery {
  id: number;
  shopName: string;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  totalAmount: number;
  deliveryCharge: number;
  status: "Accepted" | "Picked Up" | "Delivered";
}

const DriverPortal = ({ onBack }: DriverPortalProps) => {
  const [showDriverRegistration, setShowDriverRegistration] = useState(true);
  const [availableRequests, setAvailableRequests] = useState<DeliveryRequest[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [driverData, setDriverData] = useState({
    fullName: "",
    phone: "",
    vehicleType: "",
    licenseNumber: "",
    address: ""
  });

  const { toast } = useToast();

  const handleDriverRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!driverData.fullName || !driverData.phone || !driverData.vehicleType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setShowDriverRegistration(false);
    toast({
      title: "Success",
      description: "Driver profile registered successfully! You can now go online to accept requests.",
    });

    // Add sample requests for demo
    setAvailableRequests([
      {
        id: 1,
        shopName: "Fresh Mart Grocery",
        shopLocation: "123 Main Street, Downtown",
        buyerName: "John Doe",
        buyerAddress: "123 Park Street, Block A, Flat 301",
        totalAmount: 850,
        deliveryCharge: 30,
        distance: "2.1 km",
        timestamp: "5 mins ago"
      },
      {
        id: 2,
        shopName: "Green Valley Store", 
        shopLocation: "456 Park Avenue, Central",
        buyerName: "Sarah Smith",
        buyerAddress: "456 Main Road, Villa 15",
        totalAmount: 1200,
        deliveryCharge: 40,
        distance: "1.8 km",
        timestamp: "8 mins ago"
      }
    ]);
  };

  useEffect(() => {
    // Simulate new request notifications
    const interval = setInterval(() => {
      if (isOnline && Math.random() > 0.8) {
        toast({
          title: "🚨 New Delivery Request!",
          description: "A nearby shop needs delivery within 2km",
        });
        
        // Play notification sound (in real app, you'd use Web Audio API)
        console.log("🔔 Notification sound played");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isOnline, toast]);

  const handleAcceptRequest = (request: DeliveryRequest) => {
    const newActiveDelivery: ActiveDelivery = {
      id: request.id,
      shopName: request.shopName,
      buyerName: request.buyerName,
      buyerAddress: request.buyerAddress,
      buyerPhone: "+91 98765 43210", // In real app, this would come from request
      totalAmount: request.totalAmount,
      deliveryCharge: request.deliveryCharge,
      status: "Accepted"
    };

    setActiveDeliveries([...activeDeliveries, newActiveDelivery]);
    setAvailableRequests(availableRequests.filter(req => req.id !== request.id));

    toast({
      title: "Request Accepted!",
      description: `You accepted the delivery for ${request.buyerName}`,
    });
  };

  const updateDeliveryStatus = (id: number, newStatus: "Accepted" | "Picked Up" | "Delivered") => {
    setActiveDeliveries(activeDeliveries.map(delivery => 
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    ));

    if (newStatus === "Delivered") {
      setTimeout(() => {
        setActiveDeliveries(activeDeliveries.filter(delivery => delivery.id !== id));
        toast({
          title: "Delivery Completed!",
          description: "Great job! Payment has been processed.",
        });
      }, 2000);
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "bg-blue-500/20 text-blue-400";
      case "Picked Up": return "bg-yellow-500/20 text-yellow-400";
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
            <div className="flex items-center space-x-4">
              <span className="text-white hidden md:inline">Driver Portal</span>
              {!showDriverRegistration && (
                <Button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`${isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white text-sm`}
                >
                  {isOnline ? '🟢 Online' : '🔴 Offline'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Driver Registration */}
        {showDriverRegistration && (
          <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-xl md:text-2xl">Register as Driver</CardTitle>
              <p className="text-slate-300 text-sm md:text-base">Complete your profile to start accepting delivery requests</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDriverRegistration} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-slate-300">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={driverData.fullName}
                      onChange={(e) => setDriverData(prev => ({...prev, fullName: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={driverData.phone}
                      onChange={(e) => setDriverData(prev => ({...prev, phone: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleType" className="text-slate-300">Vehicle Type *</Label>
                    <Input
                      id="vehicleType"
                      value={driverData.vehicleType}
                      onChange={(e) => setDriverData(prev => ({...prev, vehicleType: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Bike, Scooter, Car"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber" className="text-slate-300">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={driverData.licenseNumber}
                      onChange={(e) => setDriverData(prev => ({...prev, licenseNumber: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-slate-300">Address</Label>
                  <Input
                    id="address"
                    value={driverData.address}
                    onChange={(e) => setDriverData(prev => ({...prev, address: e.target.value}))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white w-full">
                  Register Driver Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Main Driver Content - Only show after registration */}
        {!showDriverRegistration && (
          <>
            {/* Online Status Banner */}
            {!isOnline && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-center">
                <p className="text-red-400 text-sm md:text-base">
                  You're currently offline. Turn on online mode to receive delivery requests.
                </p>
              </div>
            )}

            {/* Active Deliveries */}
            {activeDeliveries.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Active Deliveries</h2>
                <div className="space-y-4">
                  {activeDeliveries.map((delivery) => (
                    <Card key={delivery.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                          <div>
                            <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{delivery.shopName}</h3>
                            <p className="text-slate-300">→ {delivery.buyerName}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(delivery.status)} self-start`}>
                            {delivery.status}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="text-slate-400 text-sm flex items-center mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            Delivery Address
                          </p>
                          <p className="text-white text-sm md:text-base">{delivery.buyerAddress}</p>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
                          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                            <div>
                              <p className="text-slate-400 text-sm">Total Amount</p>
                              <p className="text-white font-semibold">₹{delivery.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Your Earning</p>
                              <p className="text-green-400 font-semibold">₹{delivery.deliveryCharge}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleCall(delivery.buyerPhone)}
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white w-full sm:w-auto"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Buyer
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          {delivery.status === "Accepted" && (
                            <Button
                              onClick={() => updateDeliveryStatus(delivery.id, "Picked Up")}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                              Mark as Picked Up
                            </Button>
                          )}
                          {delivery.status === "Picked Up" && (
                            <Button
                              onClick={() => updateDeliveryStatus(delivery.id, "Delivered")}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Mark as Delivered
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Available Requests */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                Available Requests {isOnline && `(${availableRequests.length})`}
              </h2>
              
              {!isOnline ? (
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6 md:p-8 text-center">
                    <p className="text-slate-300">Go online to see available delivery requests</p>
                  </CardContent>
                </Card>
              ) : availableRequests.length === 0 ? (
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6 md:p-8 text-center">
                    <p className="text-slate-300">No requests available right now. Check back soon!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {availableRequests.map((request) => (
                    <Card key={request.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{request.shopName}</h3>
                            <p className="text-slate-300 text-sm">{request.shopLocation}</p>
                            <p className="text-slate-400 text-sm">Posted {request.timestamp}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-semibold text-lg">₹{request.deliveryCharge}</p>
                            <p className="text-slate-400 text-sm">{request.distance}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-slate-400 text-sm flex items-center mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            Deliver to: {request.buyerName}
                          </p>
                          <p className="text-white text-sm md:text-base">{request.buyerAddress}</p>
                          <p className="text-slate-400 text-sm mt-1">Amount to collect: ₹{request.totalAmount}</p>
                        </div>

                        <Button
                          onClick={() => handleAcceptRequest(request)}
                          className="bg-green-500 hover:bg-green-600 text-white w-full"
                        >
                          Accept Delivery
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DriverPortal;
