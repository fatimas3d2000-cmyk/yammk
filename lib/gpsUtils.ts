// GPS Location Utilities

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface Address {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  isDefault: boolean;
}

/**
 * Get current location from device GPS using Capacitor
 */
export const getCurrentLocation = async (): Promise<Location | null> => {
  try {
    // Try Capacitor Geolocation first (native)
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || 0,
        timestamp: position.timestamp || Date.now(),
      };
    } catch (error) {
      console.warn("Capacitor Geolocation not available, trying browser API", error);
    }

    // Fallback to browser Geolocation API (only on client side)
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};

/**
 * Format location to address string
 */
export const formatLocationAsAddress = (location: Location): string => {
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
};

/**
 * Get map URL for location
 */
export const getMapUrl = (latitude: number, longitude: number): string => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

/**
 * Save address to localStorage
 */
export const saveAddress = (address: Address): void => {
  try {
    // Ensure we're on client side
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage not available");
      return;
    }

    // Get patient email from auth
    const patientAuth = localStorage.getItem("patientAuth");
    let patientId = "default";

    if (patientAuth) {
      const parsed = JSON.parse(patientAuth);
      patientId = parsed.email || "default";
    }

    // Get existing addresses
    const addressesKey = `addresses_${patientId}`;
    const existingAddresses = localStorage.getItem(addressesKey);
    const addressesList: Address[] = existingAddresses
      ? JSON.parse(existingAddresses)
      : [];

    // If setting as default, unset other defaults
    if (address.isDefault) {
      addressesList.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    addressesList.push(address);
    localStorage.setItem(addressesKey, JSON.stringify(addressesList));
  } catch (error) {
    console.error("Error saving address:", error);
  }
};

/**
 * Get all addresses for user
 */
export const getUserAddresses = (): Address[] => {
  try {
    // Ensure we're on client side
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage not available");
      return [];
    }

    const patientAuth = localStorage.getItem("patientAuth");
    let patientId = "default";

    if (patientAuth) {
      const parsed = JSON.parse(patientAuth);
      patientId = parsed.email || "default";
    }

    const addressesKey = `addresses_${patientId}`;
    const addresses = localStorage.getItem(addressesKey);
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error("Error getting addresses:", error);
    return [];
  }
};

/**
 * Delete address
 */
export const deleteAddress = (addressId: string): boolean => {
  try {
    // Ensure we're on client side
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage not available");
      return false;
    }

    const patientAuth = localStorage.getItem("patientAuth");
    let patientId = "default";

    if (patientAuth) {
      const parsed = JSON.parse(patientAuth);
      patientId = parsed.email || "default";
    }

    const addressesKey = `addresses_${patientId}`;
    const addresses = localStorage.getItem(addressesKey);
    if (!addresses) return false;

    const addressesList: Address[] = JSON.parse(addresses);
    const filtered = addressesList.filter((addr) => addr.id !== addressId);
    localStorage.setItem(addressesKey, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting address:", error);
    return false;
  }
};

/**
 * Set address as default
 */
export const setDefaultAddress = (addressId: string): boolean => {
  try {
    // Ensure we're on client side
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage not available");
      return false;
    }

    const patientAuth = localStorage.getItem("patientAuth");
    let patientId = "default";

    if (patientAuth) {
      const parsed = JSON.parse(patientAuth);
      patientId = parsed.email || "default";
    }

    const addressesKey = `addresses_${patientId}`;
    const addresses = localStorage.getItem(addressesKey);
    if (!addresses) return false;

    const addressesList: Address[] = JSON.parse(addresses);
    addressesList.forEach((addr) => {
      addr.isDefault = addr.id === addressId;
    });
    localStorage.setItem(addressesKey, JSON.stringify(addressesList));
    return true;
  } catch (error) {
    console.error("Error setting default address:", error);
    return false;
  }
};
