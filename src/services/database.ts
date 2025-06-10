
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

// Delivery request operations
export const createDeliveryRequest = async (requestData: Omit<DeliveryRequest, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('delivery_requests')
    .insert([{ ...requestData, status: 'pending' }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getDeliveryRequests = async (status?: string) => {
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
