
-- Drop existing tables if they exist (to avoid conflicts)
DROP TABLE IF EXISTS delivery_requests CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS buyers CASCADE;

-- Drop existing functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create buyers table
CREATE TABLE buyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  pincode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shops table
CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  pincode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  license_number TEXT,
  address TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery_requests table with proper foreign key references
CREATE TABLE delivery_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_charge DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'picked_up', 'delivered')) DEFAULT 'pending',
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_delivery_requests_status ON delivery_requests(status);
CREATE INDEX idx_delivery_requests_shop_id ON delivery_requests(shop_id);
CREATE INDEX idx_delivery_requests_driver_id ON delivery_requests(driver_id);
CREATE INDEX idx_drivers_online ON drivers(is_online);

-- Enable Row Level Security (RLS)
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_requests ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access
CREATE POLICY "Allow public access to buyers" ON buyers FOR ALL USING (true);
CREATE POLICY "Allow public access to shops" ON shops FOR ALL USING (true);
CREATE POLICY "Allow public access to drivers" ON drivers FOR ALL USING (true);
CREATE POLICY "Allow public access to delivery_requests" ON delivery_requests FOR ALL USING (true);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_buyers_updated_at 
  BEFORE UPDATE ON buyers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at 
  BEFORE UPDATE ON shops 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at 
  BEFORE UPDATE ON drivers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_requests_updated_at 
  BEFORE UPDATE ON delivery_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO buyers (full_name, phone, address, city, pincode) VALUES
('John Doe', '+91-9876543210', '123 Main Street', 'Mumbai', '400001'),
('Jane Smith', '+91-9876543211', '456 Park Avenue', 'Delhi', '110001');

INSERT INTO shops (shop_name, owner_name, phone, address, city, pincode) VALUES
('Fresh Mart', 'Raj Kumar', '+91-9876543212', '789 Market Street', 'Mumbai', '400001'),
('Green Grocers', 'Priya Sharma', '+91-9876543213', '321 Shopping Complex', 'Delhi', '110001');

INSERT INTO drivers (full_name, phone, vehicle_type, license_number, address, is_online) VALUES
('Amit Singh', '+91-9876543214', 'Motorcycle', 'DL1420110012345', '654 Driver Colony', true),
('Rohit Verma', '+91-9876543215', 'Bicycle', 'DL1420110012346', '987 Delivery Street', true);
