
export interface StoredProfile {
  id: string;
  type: 'buyer' | 'shopkeeper' | 'driver';
  data: any;
  timestamp: number;
}

export const saveProfileToCookies = (profileType: 'buyer' | 'shopkeeper' | 'driver', profileData: any) => {
  const profile: StoredProfile = {
    id: profileData.id,
    type: profileType,
    data: profileData,
    timestamp: Date.now()
  };
  
  localStorage.setItem(`grozo_${profileType}_profile`, JSON.stringify(profile));
  console.log(`${profileType} profile saved to cookies:`, profile);
};

export const getProfileFromCookies = (profileType: 'buyer' | 'shopkeeper' | 'driver'): StoredProfile | null => {
  try {
    const stored = localStorage.getItem(`grozo_${profileType}_profile`);
    if (stored) {
      const profile: StoredProfile = JSON.parse(stored);
      console.log(`${profileType} profile loaded from cookies:`, profile);
      return profile;
    }
  } catch (error) {
    console.error('Error loading profile from cookies:', error);
  }
  return null;
};

export const clearProfileFromCookies = (profileType: 'buyer' | 'shopkeeper' | 'driver') => {
  localStorage.removeItem(`grozo_${profileType}_profile`);
  console.log(`${profileType} profile cleared from cookies`);
};

export const hasStoredProfile = (profileType: 'buyer' | 'shopkeeper' | 'driver'): boolean => {
  return localStorage.getItem(`grozo_${profileType}_profile`) !== null;
};
