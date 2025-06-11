import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Phone, Home, Package, Settings, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  createDriver, 
  updateDriverStatus, 
  getDeliveryRequests, 
  updateDeliveryRequestStatus,
  getDeliveryRequestsByDriver,
  subscribeToDeliveryRequests,
  Driver, 
  DeliveryRequest 
} from "@/services/database";

interface DriverPortalProps {
  onBack: () => void;
}

const DriverPortal = ({ onBack }: DriverPortalProps) => {
  const [showDriverRegistration, setShowDriverRegistration] = useState(true);
  const [registeredDriver, setRegisteredDriver] = useState<Driver | null>(null);
  const [availableRequests, setAvailableRequests] = useState<DeliveryRequest[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryRequest[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  const [driverData, setDriverData] = useState({
    full_name: "",
    phone: "",
    vehicle_type: "",
    license_number: "",
    address: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    if (registeredDriver && isOnline) {
      loadAvailableRequests();
      loadActiveDeliveries();
      
      // Subscribe to new delivery requests
      const channel = subscribeToDeliveryRequests((payload) => {
        console.log('Delivery request update:', payload);
        
        if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
          // New delivery request available
          setNotifications(prev => [...prev, `New delivery request from ${payload.new.buyer_name}`]);
          toast({
            title: "🔔 New Delivery Request!",
            description: `Order for ${payload.new.buyer_name} - ₹${payload.new.delivery_charge}`,
          });
          loadAvailableRequests();
        }
        
        if (payload.eventType === 'UPDATE') {
          loadAvailableRequests();
          loadActiveDeliveries();
        }
      });

      // Set up polling as backup
      const interval = setInterval(() => {
        loadAvailableRequests();
        loadActiveDeliveries();
      }, 15000);
      
      return () => {
        channel.unsubscribe();
        clearInterval(interval);
      };
    }
  }, [registeredDriver, isOnline]);

  const loadAvailableRequests = async () => {
    try {
      const requests = await getDeliveryRequests('pending');
      setAvailableRequests(requests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const loadActiveDeliveries = async () => {
    if (!registeredDriver) return;
    
    try {
      const myDeliveries = await getDeliveryRequestsByDriver(registeredDriver.id!);
      setActiveDeliveries(myDeliveries);
    } catch (error) {
      console.error('Error loading active deliveries:', error);
    }
  };

  const handleDriverRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!driverData.full_name || !driverData.phone || !driverData.vehicle_type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newDriver = await createDriver(driverData);
      setRegisteredDriver(newDriver);
      setShowDriverRegistration(false);
      toast({
        title: "Success",
        description: "Driver profile registered successfully! You can now go online to accept requests.",
      });
    } catch (error) {
      console.error('Error registering driver:', error);
      toast({
        title: "Error",
        description: "Failed to register driver profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = async () => {
    if (!registeredDriver) return;
    
    try {
      const newStatus = !isOnline;
      await updateDriverStatus(registeredDriver.id!, newStatus);
      setIsOnline(newStatus);
      
      if (newStatus) {
        toast({
          title: "You're now online! 🟢",
          description: "You'll receive notifications for new delivery requests.",
        });
        loadAvailableRequests();
      } else {
        toast({
          title: "You're now offline 🔴",
          description: "You won't receive new delivery requests.",
        });
        setAvailableRequests([]);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update online status",
        variant: "destructive"
      });
    }
  };

  const handleAcceptRequest = async (request: DeliveryRequest) => {
    if (!registeredDriver) return;
    
    try {
      await updateDeliveryRequestStatus(request.id!, 'accepted', registeredDriver.id);
      setAvailableRequests(availableRequests.filter(req => req.id !== request.id));
      loadActiveDeliveries();
      
      toast({
        title: "Request Accepted! ✅",
        description: `You accepted the delivery for ${request.buyer_name}. Shop and buyer have been notified.`,
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Error",
        description: "Failed to accept request. It may have been taken by another driver.",
        variant: "destructive"
      });
      loadAvailableRequests();
    }
  };

  const updateDeliveryStatus = async (id: string, newStatus: DeliveryRequest['status']) => {
    try {
      await updateDeliveryRequestStatus(id, newStatus);
      
      if (newStatus === "delivered") {
        setActiveDeliveries(activeDeliveries.filter(delivery => delivery.id !== id));
        toast({
          title: "Delivery Completed! 🎉",
          description: "Great job! Payment has been processed.",
        });
      } else {
        loadActiveDeliveries();
        toast({
          title: "Status Updated",
          description: `Delivery marked as ${newStatus.replace('_', ' ')}`,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive"
      });
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-blue-500/20 text-blue-400";
      case "picked_up": return "bg-yellow-500/20 text-yellow-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
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
                <span className="hidden md:inline">Deliveries</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Settings</span>
              </Button>
              {notifications.length > 0 && (
                <Button 
                  onClick={clearNotifications}
                  variant="ghost" 
                  size="sm" 
                  className="text-yellow-400 hover:text-yellow-300 relative transition-all duration-300 hover:scale-105"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                  Alerts
                </Button>
              )}
              {!showDriverRegistration && (
                <Button
                  onClick={handleToggleOnline}
                  className={`${isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white text-sm transition-all duration-300 hover:scale-105`}
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
                      value={driverData.full_name}
                      onChange={(e) => setDriverData(prev => ({...prev, full_name: e.target.value}))}
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
                      value={driverData.vehicle_type}
                      onChange={(e) => setDriverData(prev => ({...prev, vehicle_type: e.target.value}))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., Bike, Scooter, Car"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber" className="text-slate-300">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={driverData.license_number}
                      onChange={(e) => setDriverData(prev => ({...prev, license_number: e.target.value}))}
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
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600 text-white w-full transition-all duration-300 hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Driver Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Main Driver Content */}
        {!showDriverRegistration && (
          <>
            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
                <h3 className="text-yellow-400 font-semibold mb-2">🔔 New Notifications</h3>
                {notifications.map((notification, index) => (
                  <p key={index} className="text-yellow-300 text-sm">{notification}</p>
                ))}
              </div>
            )}

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
                            <h3 className="text-lg md:text-xl font-semibold text-white mb-1">Delivery for {delivery.buyer_name}</h3>
                            <p className="text-slate-300">Phone: {delivery.buyer_phone}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(delivery.status)} self-start capitalize`}>
                            {delivery.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="text-slate-400 text-sm flex items-center mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            Delivery Address
                          </p>
                          <p className="text-white text-sm md:text-base">{delivery.delivery_address}</p>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
                          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                            <div>
                              <p className="text-slate-400 text-sm">Total Amount</p>
                              <p className="text-white font-semibold">₹{delivery.total_amount}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Your Earning</p>
                              <p className="text-green-400 font-semibold">₹{delivery.delivery_charge}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleCall(delivery.buyer_phone)}
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white w-full sm:w-auto transition-all duration-300 hover:scale-105"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Buyer
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          {delivery.status === "accepted" && (
                            <Button
                              onClick={() => updateDeliveryStatus(delivery.id!, "picked_up")}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-300 hover:scale-105"
                            >
                              Mark as Picked Up
                            </Button>
                          )}
                          {delivery.status === "picked_up" && (
                            <Button
                              onClick={() => updateDeliveryStatus(delivery.id!, "delivered")}
                              className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
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
                            <h3 className="text-lg md:text-xl font-semibold text-white mb-1">Delivery Request</h3>
                            <p className="text-slate-300 text-sm">Customer: {request.buyer_name}</p>
                            <p className="text-slate-400 text-sm">Posted {new Date(request.created_at || '').toLocaleTimeString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-semibold text-lg">₹{request.delivery_charge}</p>
                            <p className="text-slate-400 text-sm">Delivery fee</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-slate-400 text-sm flex items-center mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            Deliver to: {request.buyer_name}
                          </p>
                          <p className="text-white text-sm md:text-base">{request.delivery_address}</p>
                          <p className="text-slate-400 text-sm mt-1">Amount to collect: ₹{request.total_amount}</p>
                        </div>

                        <Button
                          onClick={() => handleAcceptRequest(request)}
                          className="bg-green-500 hover:bg-green-600 text-white w-full transition-all duration-300 hover:scale-105"
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
