import { supabase } from '@/lib/supabase'

export interface Shop {
  id?: string
  shop_name: string
  owner_name: string
  phone: string
  address: string
  city?: string
  pincode?: string
  created_at?: string
  updated_at?: string
}

export interface Driver {
  id?: string
  full_name: string
  phone: string
  vehicle_type: string
  license_number?: string
  address?: string
  is_online?: boolean
  created_at?: string
  updated_at?: string
}

export interface DeliveryRequest {
  id?: string
  shop_id?: string
  buyer_name: string
  buyer_phone: string
  delivery_address: string
  total_amount: number
  delivery_charge: number
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered'
  driver_id?: string
  created_at?: string
  updated_at?: string
}

// Mock data for when Supabase is not properly configured
const mockShops: Shop[] = [
  {
    id: '1',
    shop_name: 'Fresh Mart Grocery',
    owner_name: 'Raj Kumar',
    phone: '+91 98765 43210',
    address: 'Main Street, Block A',
    city: 'Mumbai',
    pincode: '400001'
  },
  {
    id: '2',
    shop_name: 'Green Valley Store',
    owner_name: 'Priya Sharma',
    phone: '+91 98765 43211',
    address: 'Market Road, Sector 5',
    city: 'Delhi',
    pincode: '110001'
  }
]

const mockDrivers: Driver[] = [
  {
    id: '1',
    full_name: 'Amit Singh',
    phone: '+91 98765 43212',
    vehicle_type: 'Motorcycle',
    license_number: 'DL123456789',
    is_online: true
  }
]

const mockDeliveryRequests: DeliveryRequest[] = []

// Helper function to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return url && key && url !== 'https://your-project.supabase.co' && key !== 'your-anon-key'
}

// Shop operations
export const createShop = async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => {
  if (!isSupabaseConfigured()) {
    console.warn('Using mock data - Supabase not configured')
    const newShop = { ...shopData, id: Date.now().toString() }
    mockShops.push(newShop)
    return newShop
  }

  const { data, error } = await supabase
    .from('shops')
    .insert([shopData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getShops = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Using mock data - Supabase not configured')
    return mockShops
  }

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Driver operations
export const createDriver = async (driverData: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
  if (!isSupabaseConfigured()) {
    console.warn('Using mock data - Supabase not configured')
    const newDriver = { ...driverData, id: Date.now().toString(), is_online: false }
    mockDrivers.push(newDriver)
    return newDriver
  }

  const { data, error } = await supabase
    .from('drivers')
    .insert([{ ...driverData, is_online: false }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateDriverStatus = async (driverId: string, isOnline: boolean) => {
  if (!isSupabaseConfigured()) {
    console.warn('Using mock data - Supabase not configured')
    const driver = mockDrivers.find(d => d.id === driverId)
    if (driver) {
      driver.is_online = isOnline
      return driver
    }
    throw new Error('Driver not found')
  }

  const { data, error } = await supabase
    .from('drivers')
    .update({ is_online: isOnline })
    .eq('id', driverId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getOnlineDrivers = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Using mock data - Supabase not configured')
    return mockDrivers.filter(d => d.is_online)
  }

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_online', true)
  
  if (error) throw error
  return data || []
}

// Delivery request operations
export const createDeliveryRequest = async (requestData: Omit<DeliveryRequest, 'id' | 'created_at' | 'updated_at'>) => {
  if (!isSupabaseConfigured()) {
    console.warn('Using mock data - Supabase not configured')
    const newRequest = { ...requestData, id: Date.now().toString(), status: 'pending' as const }
    mockDeliveryRequests.push(newRequest)
    return newRequest
  }

  const { data, error } = await supabase
    .from('delivery_requests')
    .insert([{ ...requestData, status: 'pending' }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getDeliveryRequests = async (status?: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Using mock data - Supabase not configured')
    return status ? mockDeliveryRequests.filter(r => r.status === status) : mockDeliveryRequests
  }

  let query = supabase
    .from('delivery_requests')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export const updateDeliveryRequestStatus = async (requestId: string, status: DeliveryRequest['status'], driverId?: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Using mock data - Supabase not configured')
    const request = mockDeliveryRequests.find(r => r.id === requestId)
    if (request) {
      request.status = status
      if (driverId) request.driver_id = driverId
      return request
    }
    throw new Error('Request not found')
  }

  const updateData: any = { status }
  if (driverId) updateData.driver_id = driverId
  
  const { data, error } = await supabase
    .from('delivery_requests')
    .update(updateData)
    .eq('id', requestId)
    .select()
    .single()
  
  if (error) throw error
  return data
}
