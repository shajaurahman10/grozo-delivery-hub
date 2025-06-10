
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
  const [requests, setRequests] = useState<DeliveryRequest[]>([
    {
      id: 1,
      buyerName: "John Doe",
      buyerPhone: "+91 98765 43210",
      deliveryAddress: "123 Park Street, Block A, Flat 301",
      totalAmount: 850,
      deliveryCharge: 30,
      status: "Pending",
      timestamp: "2024-06-10 14:30"
    },
    {
      id: 2,
      buyerName: "Sarah Smith",
      buyerPhone: "+91 98765 43211",
      deliveryAddress: "456 Main Road, Villa 15",
      totalAmount: 1200,
      deliveryCharge: 40,
      status: "Accepted",
      timestamp: "2024-06-10 13:15"
    }
  ]);

  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    deliveryAddress: "",
    totalAmount: "",
    deliveryCharge: ""
  });

  const { toast } = useToast();

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
                src="/lovable-uploads/10e1395f-4d55-494f-a401-42d47838d2c8.png" 
                alt="Grozo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <h1 className="text-xl font-semibold text-white">Shopkeeper Portal</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
                <div className="flex space-x-3">
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
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{request.buyerName}</h3>
                    <p className="text-slate-300 text-sm">{request.buyerPhone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Delivery Address</p>
                    <p className="text-white">{request.deliveryAddress}</p>
                  </div>
                  <div className="flex space-x-6">
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
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperPortal;
