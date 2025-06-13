
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { verifyDeliveryOTP } from "@/services/database";

interface OTPVerificationProps {
  requestId: string;
  buyerName: string;
  onVerificationSuccess: () => void;
  onCancel: () => void;
}

const OTPVerification = ({ 
  requestId, 
  buyerName, 
  onVerificationSuccess, 
  onCancel 
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setError('Please enter a 4-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyDeliveryOTP(requestId, otp);
      
      if (result.success) {
        toast({
          title: "✅ Delivery Confirmed!",
          description: "OTP verified successfully. Delivery marked as completed.",
        });
        onVerificationSuccess();
      } else {
        setError('Invalid OTP. Please check with the buyer.');
        toast({
          title: "❌ Invalid OTP",
          description: "The OTP you entered is incorrect.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Failed to verify OTP. Please try again.');
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-400" />
          Delivery Verification
        </CardTitle>
        <p className="text-slate-300 text-sm">
          Ask {buyerName} for the 4-digit OTP to confirm delivery
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <label className="text-slate-300 text-sm block mb-2">
            Enter OTP from buyer:
          </label>
          <InputOTP 
            value={otp} 
            onChange={setOtp}
            maxLength={4}
            className="justify-center"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="bg-slate-700 border-slate-600 text-white" />
              <InputOTPSlot index={1} className="bg-slate-700 border-slate-600 text-white" />
              <InputOTPSlot index={2} className="bg-slate-700 border-slate-600 text-white" />
              <InputOTPSlot index={3} className="bg-slate-700 border-slate-600 text-white" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <div className="flex items-center text-red-400 text-sm">
            <XCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 4}
            className="bg-green-500 hover:bg-green-600 text-white flex-1"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify & Complete
              </>
            )}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
          <p className="text-blue-400 text-sm">
            💡 The buyer should have received a 4-digit OTP when the order was created. 
            Ask them to share this code to confirm successful delivery.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;
