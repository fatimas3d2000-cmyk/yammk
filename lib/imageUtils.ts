import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const pickImage = async (): Promise<string | null> => {
  try {
    // Check if running on native platform
    const isNative = typeof window !== "undefined" && window.location.protocol === "capacitor://";

    if (isNative) {
      // Use Capacitor Camera for native platforms (Android/iOS)
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos, // Open photo gallery/studio
      });
      return image.dataUrl || null;
    } else {
      // Fallback to file input for web
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    }
  } catch (error) {
    console.error("Error picking image:", error);
    return null;
  }
};

// Get unique key for user's profile image
export const getUserImageKey = (): string => {
  // Check if patient or provider
  const patientAuth = localStorage.getItem("patientAuth");
  const providerAuth = localStorage.getItem("providerAuth");

  if (patientAuth) {
    try {
      const patient = JSON.parse(patientAuth);
      // Use patient email as unique identifier
      return `profileImage_patient_${patient.email || 'default'}`;
    } catch (e) {
      console.error("Error parsing patient auth:", e);
    }
  } else if (providerAuth) {
    try {
      const provider = JSON.parse(providerAuth);
      // Use provider email as unique identifier
      return `profileImage_provider_${provider.provider?.email || 'default'}`;
    } catch (e) {
      console.error("Error parsing provider auth:", e);
    }
  }

  return "profileImage_default";
};

export const saveImageToStorage = (imageData: string, key?: string) => {
  try {
    const storageKey = key || getUserImageKey();
    localStorage.setItem(storageKey, imageData);
    return true;
  } catch (error) {
    console.error("Error saving image:", error);
    return false;
  }
};

export const getImageFromStorage = (key?: string): string | null => {
  try {
    const storageKey = key || getUserImageKey();
    return localStorage.getItem(storageKey);
  } catch (error) {
    console.error("Error retrieving image:", error);
    return null;
  }
};
