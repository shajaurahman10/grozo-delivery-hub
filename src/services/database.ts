import { supabase } from '@/lib/supabase'

export interface Buyer {
  id?: string
  full_name: string
  phone: string
  address: string
  city?: string
  pincode?: string
  created_at?: string
  updated_at?: string
}

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
  buyer_id?: string
  buyer_name: string
  buyer_phone: string
  delivery_address: string
  total_amount: number
  delivery_charge: number
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered'
  driver_id?: string
  otp_code?: string
  buyer_location?: { lat: number; lng: number }
  shop_location?: { lat: number; lng: number }
  driver_location?: { lat: number; lng: number }
  created_at?: string
  updated_at?: string
  shops?: Shop
  drivers?: Driver
}

// Buyer operations
export const createBuyer = async (buyerData: Omit<Buyer, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('buyers')
    .insert([buyerData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getBuyers = async () => {
  const { data, error } = await supabase
    .from('buyers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Shop operations
export const createShop = async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('shops')
    .insert([shopData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getShops = async () => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Driver operations
export const createDriver = async (driverData: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('drivers')
    .insert([{ ...driverData, is_online: false }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateDriverStatus = async (driverId: string, isOnline: boolean) => {
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
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_online', true)
  
  if (error) throw error
  return data || []
}

export const getDriverById = async (driverId: string) => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driverId)
    .single()
  
  if (error) throw error
  return data
}

// Generate random 4-digit OTP
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Updated delivery request operations
export const createDeliveryRequest = async (requestData: Omit<DeliveryRequest, 'id' | 'created_at' | 'updated_at'>) => {
  const otpCode = generateOTP();
  const { data, error } = await supabase
    .from('delivery_requests')
    .insert([{ ...requestData, status: 'pending', otp_code: otpCode }])
    .select(`
      *,
      shops:shop_id(*),
      drivers:driver_id(*)
    `)
    .single()
  
  if (error) throw error
  return data
}

// Update driver location
export const updateDriverLocation = async (driverId: string, location: { lat: number; lng: number }) => {
  const { data, error } = await supabase
    .from('delivery_requests')
    .update({ driver_location: location })
    .eq('driver_id', driverId)
    .in('status', ['accepted', 'picked_up'])
    .select()
  
  if (error) throw error
  return data
}

// Verify OTP for delivery
export const verifyDeliveryOTP = async (requestId: string, enteredOTP: string) => {
  const { data, error } = await supabase
    .from('delivery_requests')
    .select('otp_code')
    .eq('id', requestId)
    .single()
  
  if (error) throw error
  
  if (data.otp_code === enteredOTP) {
    const { data: updatedData, error: updateError } = await supabase
      .from('delivery_requests')
      .update({ status: 'delivered' })
      .eq('id', requestId)
      .select(`
        *,
        shops:shop_id(*),
        drivers:driver_id(*)
      `)
      .single()
    
    if (updateError) throw updateError
    return { success: true, data: updatedData }
  } else {
    return { success: false, message: 'Invalid OTP' }
  }
}

// Clean up old delivery requests (24+ hours old)
export const cleanupOldRequests = async () => {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
  const { data, error } = await supabase
    .from('delivery_requests')
    .delete()
    .lt('created_at', twentyFourHoursAgo.toISOString())
    .in('status', ['pending', 'delivered'])
  
  if (error) throw error
  return data
}

export const getDeliveryRequests = async (status?: string) => {
  let query = supabase
    .from('delivery_requests')
    .select(`
      *,
      shops:shop_id(*),
      drivers:driver_id(*)
    `)
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export const getDeliveryRequestsByShop = async (shopId: string) => {
  const { data, error } = await supabase
    .from('delivery_requests')
    .select(`
      *,
      shops:shop_id(*),
      drivers:driver_id(*)
    `)
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const getDeliveryRequestsByDriver = async (driverId: string) => {
  const { data, error } = await supabase
    .from('delivery_requests')
    .select(`
      *,
      shops:shop_id(*),
      drivers:driver_id(*)
    `)
    .eq('driver_id', driverId)
    .in('status', ['accepted', 'picked_up'])
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const updateDeliveryRequestStatus = async (requestId: string, status: DeliveryRequest['status'], driverId?: string) => {
  const updateData: any = { status }
  if (driverId) updateData.driver_id = driverId
  
  const { data, error } = await supabase
    .from('delivery_requests')
    .update(updateData)
    .eq('id', requestId)
    .select(`
      *,
      shops:shop_id(*),
      drivers:driver_id(*)
    `)
    .single()
  
  if (error) throw error
  return data
}

// Real-time subscriptions
export const subscribeToDeliveryRequests = (callback: (payload: any) => void) => {
  return supabase
    .channel('delivery_requests')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_requests' }, callback)
    .subscribe()
}

export const subscribeToDriverStatus = (callback: (payload: any) => void) => {
  return supabase
    .channel('drivers')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'drivers' }, callback)
    .subscribe()
}
