// Notifications System for Ratings and Reviews

export interface RatingNotification {
  id: string;
  type: "rating" | "review" | "message";
  title: string;
  message: string;
  fromPatient?: string;
  fromPatientEmail?: string;
  rating?: number;
  comment?: string;
  timestamp: string;
  read: boolean;
  providerId?: string;
  patientId?: string;
}

export interface SavedRating {
  id: string;
  patientName: string;
  patientEmail: string;
  patientId: string;
  providerName: string;
  providerId: string;
  rating: number;
  comment: string;
  timestamp: string;
  read: boolean;
}

/**
 * Save a rating and create notification for provider
 */
export const saveRatingAndNotify = (ratingData: {
  patientName: string;
  patientEmail: string;
  providerName: string;
  providerId: string;
  rating: number;
  comment: string;
}): boolean => {
  try {
    const ratingId = `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get patient email from auth
    const patientAuth = localStorage.getItem("patientAuth");
    let patientId = "patient_anonymous";
    let patientEmail = ratingData.patientEmail;
    
    if (patientAuth) {
      const parsed = JSON.parse(patientAuth);
      patientId = parsed.email || patientEmail;
      patientEmail = parsed.email || patientEmail;
    }

    // Save rating
    const savedRating: SavedRating = {
      id: ratingId,
      patientName: ratingData.patientName,
      patientEmail: patientEmail,
      patientId: patientId,
      providerName: ratingData.providerName,
      providerId: ratingData.providerId,
      rating: ratingData.rating,
      comment: ratingData.comment,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Get existing ratings
    const ratingsKey = `provider_ratings_${ratingData.providerId}`;
    const existingRatings = localStorage.getItem(ratingsKey);
    const ratingsList: SavedRating[] = existingRatings ? JSON.parse(existingRatings) : [];
    ratingsList.push(savedRating);
    localStorage.setItem(ratingsKey, JSON.stringify(ratingsList));

    // Create notification for provider
    const notification: RatingNotification = {
      id: ratingId,
      type: "rating",
      title: `⭐ تقييم جديد من ${ratingData.patientName}`,
      message: `تقييم: ${ratingData.rating}/5 - ${ratingData.comment.substring(0, 100)}...`,
      fromPatient: ratingData.patientName,
      fromPatientEmail: patientEmail,
      rating: ratingData.rating,
      comment: ratingData.comment,
      timestamp: new Date().toISOString(),
      read: false,
      providerId: ratingData.providerId,
      patientId: patientId,
    };

    // Save notification
    const notificationsKey = `provider_notifications_${ratingData.providerId}`;
    const existingNotifications = localStorage.getItem(notificationsKey);
    const notificationsList: RatingNotification[] = existingNotifications ? JSON.parse(existingNotifications) : [];
    notificationsList.unshift(notification); // Add to beginning
    localStorage.setItem(notificationsKey, JSON.stringify(notificationsList.slice(0, 50))); // Keep last 50

    return true;
  } catch (error) {
    console.error("Error saving rating and notification:", error);
    return false;
  }
};

/**
 * Get provider notifications
 */
export const getProviderNotifications = (providerId: string): RatingNotification[] => {
  try {
    const notificationsKey = `provider_notifications_${providerId}`;
    const notifications = localStorage.getItem(notificationsKey);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = (providerId: string, notificationId: string): boolean => {
  try {
    const notificationsKey = `provider_notifications_${providerId}`;
    const notifications = localStorage.getItem(notificationsKey);
    if (!notifications) return false;

    const notificationsList: RatingNotification[] = JSON.parse(notifications);
    const index = notificationsList.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      notificationsList[index].read = true;
      localStorage.setItem(notificationsKey, JSON.stringify(notificationsList));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = (providerId: string): number => {
  try {
    const notifications = getProviderNotifications(providerId);
    return notifications.filter((n) => !n.read).length;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
};

/**
 * Get provider ratings
 */
export const getProviderRatings = (providerId: string): SavedRating[] => {
  try {
    const ratingsKey = `provider_ratings_${providerId}`;
    const ratings = localStorage.getItem(ratingsKey);
    return ratings ? JSON.parse(ratings) : [];
  } catch (error) {
    console.error("Error getting ratings:", error);
    return [];
  }
};

/**
 * Calculate average rating
 */
export const calculateAverageRating = (providerId: string): number => {
  try {
    const ratings = getProviderRatings(providerId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return +(sum / ratings.length).toFixed(1);
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return 0;
  }
};

/**
 * Delete a single notification
 */
export const deleteNotification = (providerId: string, notificationId: string): boolean => {
  try {
    // Ensure we're on client side
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage not available");
      return false;
    }

    if (!providerId || providerId.trim() === "") {
      console.error("Error: providerId is empty");
      return false;
    }

    const notificationsKey = `provider_notifications_${providerId}`;
    const notifications = localStorage.getItem(notificationsKey);
    if (!notifications) return false;

    const notificationsList: RatingNotification[] = JSON.parse(notifications);
    const filtered = notificationsList.filter((n) => n.id !== notificationId);
    localStorage.setItem(notificationsKey, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    return false;
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = (providerId: string): boolean => {
  try {
    // Ensure we're on client side
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage not available");
      return false;
    }

    if (!providerId || providerId.trim() === "") {
      console.error("Error: providerId is empty");
      return false;
    }

    const notificationsKey = `provider_notifications_${providerId}`;
    localStorage.setItem(notificationsKey, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return false;
  }
};
