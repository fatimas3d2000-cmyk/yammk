"use client";

// Google Auth Utility for Capacitor and Web
import { supabase } from "./supabase";

export interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface GoogleSignInResult {
  email: string;
  name: string;
  picture?: string;
  googleId: string;
  verified_email?: boolean;
}

// Function to fetch available Google accounts from Supabase
export const fetchAvailableGoogleAccounts = async (): Promise<GoogleAccount[]> => {
  try {
    console.log("🔍 جاري جلب الحسابات من Supabase...");
    const { data: accounts, error } = await supabase
      .from("patients")
      .select("id, full_name, email, profile_picture");

    if (error) {
      console.error("❌ خطأ في جلب الحسابات:", error?.message || error);
      return [];
    }

    console.log("📊 الحسابات المجلوبة:", accounts);

    if (!accounts || accounts.length === 0) {
      console.warn("⚠️ لا توجد حسابات متاحة");
      return [];
    }

    const mappedAccounts = accounts.map((acc: any) => ({
      id: acc.id || "",
      name: acc.full_name || "مستخدم",
      email: acc.email || "",
      picture: acc.profile_picture || undefined,
    }));

    console.log("✅ تم جلب عدد الحسابات:", mappedAccounts.length);
    return mappedAccounts;
  } catch (error) {
    console.error("❌ خطأ في fetchAvailableGoogleAccounts:", error instanceof Error ? error.message : error);
    return [];
  }
};

/**
 * Show Google Account Selector Modal
 * Displays available Google accounts from Supabase and lets user select one
 */
export const showGoogleAccountSelector = async (): Promise<GoogleAccount | null> => {
  // Fetch accounts from Supabase
  const accounts = await fetchAvailableGoogleAccounts();

  if (!accounts || accounts.length === 0) {
    console.warn("No accounts available to select");
    return null;
  }

  return new Promise((resolve) => {
    // Create modal container
    const modalContainer = document.createElement("div");
    modalContainer.id = "google-account-selector-modal";
    modalContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      direction: rtl;
    `;

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background: white;
      border-radius: 20px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;

    // Add title
    const title = document.createElement("h2");
    title.textContent = "اختر حسابك على Google";
    title.style.cssText = `
      text-align: right;
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    `;
    modalContent.appendChild(title);

    // Add subtitle
    const subtitle = document.createElement("p");
    subtitle.textContent = "اختر من الحسابات المتاحة أدناه";
    subtitle.style.cssText = `
      text-align: right;
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #666;
    `;
    modalContent.appendChild(subtitle);

    // Create accounts list
    const accountsList = document.createElement("div");
    accountsList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    `;

    accounts.forEach((account) => {
      const accountButton = document.createElement("button");
      accountButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        background: #f9f9f9;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: right;
      `;

      // Add hover effect
      accountButton.onmouseover = () => {
        accountButton.style.backgroundColor = "#e8f5e9";
        accountButton.style.borderColor = "#4caf50";
      };
      accountButton.onmouseout = () => {
        accountButton.style.backgroundColor = "#f9f9f9";
        accountButton.style.borderColor = "#e0e0e0";
      };

      // Account image
      const accountImg = document.createElement("img");
      accountImg.src = account.picture || "https://via.placeholder.com/40";
      accountImg.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex-shrink: 0;
      `;

      // Account info
      const accountInfo = document.createElement("div");
      accountInfo.style.cssText = `
        flex: 1;
        text-align: right;
      `;

      const accountName = document.createElement("div");
      accountName.textContent = account.name;
      accountName.style.cssText = `
        font-weight: bold;
        color: #333;
        font-size: 14px;
      `;
      accountInfo.appendChild(accountName);

      const accountEmail = document.createElement("div");
      accountEmail.textContent = account.email;
      accountEmail.style.cssText = `
        color: #666;
        font-size: 12px;
        margin-top: 4px;
      `;
      accountInfo.appendChild(accountEmail);

      accountButton.appendChild(accountImg);
      accountButton.appendChild(accountInfo);

      // Handle account selection
      accountButton.onclick = () => {
        // Remove modal
        if (document.body.contains(modalContainer)) {
          document.body.removeChild(modalContainer);
        }
        // Resolve with selected account
        resolve(account);
      };

      accountsList.appendChild(accountButton);
    });

    modalContent.appendChild(accountsList);

    // Add cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "إلغاء";
    cancelButton.style.cssText = `
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 12px;
      background: #f0f0f0;
      color: #333;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;
    `;

    cancelButton.onmouseover = () => {
      cancelButton.style.backgroundColor = "#e0e0e0";
    };
    cancelButton.onmouseout = () => {
      cancelButton.style.backgroundColor = "#f0f0f0";
    };

    cancelButton.onclick = () => {
      // Remove modal
      if (document.body.contains(modalContainer)) {
        document.body.removeChild(modalContainer);
      }
      // Resolve with null
      resolve(null);
    };

    modalContent.appendChild(cancelButton);
    modalContainer.appendChild(modalContent);

    // Add click outside to close
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        if (document.body.contains(modalContainer)) {
          document.body.removeChild(modalContainer);
        }
        resolve(null);
      }
    };

    // Add modal to page
    if (typeof document !== "undefined" && document.body) {
      document.body.appendChild(modalContainer);
    } else {
      resolve(null);
    }
  });
};

/**
 * Show Google Account Selector and return selected account
 * Works on both native and web platforms
 */
export const signInWithGoogle = async (): Promise<GoogleSignInResult | null> => {
  try {
    // Try Capacitor Google Auth first (native) - only if available
    if (typeof window !== "undefined") {
      try {
        // Try native Capacitor Google Auth if available
        const GoogleAuth = (globalThis as any).__CapacitorGoogleAuth;

        if (GoogleAuth?.signIn) {
          try {
            const result = await GoogleAuth.signIn();

            if (result && result.email) {
              return {
                email: result.email,
                name: result.name || result.email.split("@")[0],
                picture: result.image,
                googleId: result.id || "",
                verified_email: true,
              };
            }
          } catch (capacitorError) {
            console.log("Capacitor Google Auth sign in failed, falling back to web...");
          }
        }
      } catch (importError) {
        // Capacitor not available, use web fallback
        console.log("Capacitor not available, using web fallback...");
      }
    }

    // Fallback to Web Google Account Selector
    const selectedAccount = await showGoogleAccountSelector();
    if (selectedAccount) {
      return {
        email: selectedAccount.email,
        name: selectedAccount.name,
        picture: selectedAccount.picture,
        googleId: selectedAccount.id,
        verified_email: true,
      };
    }
    return null;
  } catch (error) {
    console.error("Error signing in with Google:", error instanceof Error ? error.message : error);
    return null;
  }
};

/**
 * Save Google Account Link to Supabase
 */
export const saveLinkGoogleAccount = async (
  accountData: GoogleSignInResult,
  userType: "patient" | "provider",
  userId?: string
): Promise<boolean> => {
  try {
    if (userType === "patient" && userId) {
      const { error } = await supabase
        .from("patients")
        .update({
          linked_google: true,
          linked_google_email: accountData.email,
          linked_google_id: accountData.googleId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error saving Google account:", error);
        return false;
      }
      
      // Also save to localStorage for offline access
      const patientData = localStorage.getItem("patientAuth");
      if (patientData) {
        const parsed = JSON.parse(patientData);
        const updated = {
          ...parsed,
          googleAccount: accountData,
          linkedGoogle: true,
          linkedGoogleEmail: accountData.email,
        };
        localStorage.setItem("patientAuth", JSON.stringify(updated));
      }
      return true;
    }
  } catch (error) {
    console.error("Error saving Google account:", error);
  }
  return false;
};

/**
 * Get linked Google account from Supabase
 */
export const getLinkedGoogleAccount = async (
  userType: "patient" | "provider",
  userId?: string
): Promise<GoogleSignInResult | null> => {
  try {
    if (userType === "patient" && userId) {
      const { data: user, error } = await supabase
        .from("patients")
        .select("google_account")
        .eq("id", userId)
        .single();

      if (error || !user) {
        console.error("Error fetching Google account:", error);
        return null;
      }
      return user.google_account || null;
    }
  } catch (error) {
    console.error("Error getting Google account:", error);
  }
  return null;
};

/**
 * Unlink Google account from Supabase
 */
export const unlinkGoogleAccount = async (
  userType: "patient" | "provider",
  userId?: string
): Promise<boolean> => {
  try {
    if (userType === "patient" && userId) {
      const { error } = await supabase
        .from("patients")
        .update({
          google_account: null,
          linked_google: false,
          linked_google_email: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error unlinking Google account:", error);
        return false;
      }

      // Also update localStorage
      const patientData = localStorage.getItem("patientAuth");
      if (patientData) {
        const parsed = JSON.parse(patientData);
        const updated = {
          ...parsed,
          googleAccount: null,
          linkedGoogle: false,
          linkedGoogleEmail: null,
        };
        localStorage.setItem("patientAuth", JSON.stringify(updated));
      }
      return true;
    }
  } catch (error) {
    console.error("Error unlinking Google account:", error);
  }
  return false;
};
