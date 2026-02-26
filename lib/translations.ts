// Simple translation system for Arabic and English
export const translations = {
  ar: {
    // Header
    "booking": "حجز الخدمة",
    "settings": "الإعدادات",
    "home": "الرئيسية",
    
    // Booking Page
    "bookingSummary": "ملخص الحجز",
    "service": "الخدمة",
    "selectedServices": "الخدمات المختارة",
    "serviceProvider": "مقدم الخدمة",
    "totalPrice": "السعر الإجمالي",
    "requiredDate": "التاريخ المطلوب",
    "preferredTime": "الوقت المفضل",
    "location": "عنوان الموقع",
    "primaryAddress": "عنواني الأساسي",
    "secondaryAddress": "عنواني الثاني",
    "addNewAddress": "+ إضافة عنوان جديد",
    "additionalNotes": "ملاحظات إضافية",
    "additionalNotesPlaceholder": "أضف أي معلومات أو تعليمات خاصة...",
    "confirmations": "التأكيدات",
    "agreeTerms": "أوافق على شروط الخدمة",
    "agreePrivacy": "أوافق على سياسة الخصوصية 🔒",
    "privacyDescription": "أوكد أنني اطلعت على الشروط وسياسة حماية البيانات",
    "agreeCommunication": "أسمح بالتواصل للتأكيد والمتابعة ☑️",
    "continuePayment": "المتابعة للدفع",
    "acceptConditions": "الرجاء قبول الشروط والسياسة",
    "back": "العودة",
    "selectedDate": "✓ التاريخ المختار:",
    "selectedTime": "✓ الوقت المختار:",
    "acceptPrivacy": "يجب الموافقة على سياسة الخصوصية لمتابعة الحجز ✓",
    "acceptTerms": "يجب الموافقة على شروط الخدمة لمتابعة الحجز ✓",
    
    // Settings Page
    "accountData": "بيانات الحساب",
    "patientAccount": "🏥 حساب مريض",
    "preferences": "🎨 التفضيلات",
    "darkMode": "الوضع الليلي",
    "enabled": "مفعل",
    "disabled": "معطل",
    "language": "اللغة",
    "arabic": "العربية",
    "english": "English",
    "notifications": "الإشعارات",
    "active": "مفعلة",
    "inactive": "معطلة",
    "accountSecurity": "🔐 الحساب والأمان",
    "changePassword": "تغيير كلمة المرور",
    "updateEmail": "تحديث البريد الإلكتروني",
    "updatePhone": "تحديث رقم الهاتف",
    "supportHelp": "📞 الدعم والمساعدة",
    "faq": "الأسئلة الشائعة",
    "contactUs": "اتصل بنا",
    "appInfo": "ℹ️ معلومات التطبيق",
    "appVersion": "إصدار التطبيق",
    "logout": "🚪 تسجيل الخروج",
    "home_nav": "الرئيسية",
    "search_nav": "البحث",
    "orders_nav": "الطلبات",
    "settings_nav": "الإعدادات",
    
    // Home Page
    "homeWelcome": "مرحباً بك في يمك العافية",
    "selectService": "اختر الخدمة المطلوبة",
    "searchServices": "ابحث عن الخدمات",
    "notifications_title": "التنبيهات",
    "noNotifications": "لا توجد تنبيهات حالياً",
    "clearAll": "حذف جميع التنبيهات",
    "healthcare": "يمك العافية",
    "trustworthyPlatform": "منصتك الصحية الموثوقة",
    "privacyPolicy": "سياسة الخصوصية",
    "shareApp": "شارك البرنامج",
    "about": "حول التطبيق",
    "rateApp": "قيم التطبيق",
    "version": "الإصدار",
    "favorites": "المفضلة",
    
    // Payment Page
    "paymentInvoices": "الدفع والفواتير",
    "paymentTab": "الدفع",
    "invoicesTab": "الفواتير",
    "paymentMethod": "طريقة الدفع",
    "creditCard": "بطاقة ائتمان",
    "bankTransfer": "تحويل بنكي",
    "paymentOnDelivery": "الدفع عند الاستقبال",
    "cardNumber": "رقم البطاقة",
    "expiryDate": "تاريخ الانتهاء",
    "cvv": "CVV",
    "cardholderName": "اسم حامل البطاقة",
    "bankName": "اسم البنك",
    "accountNumber": "رقم الحساب",
    "iban": "رقم IBAN",
    "paymentOnDeliveryDesc": "الدفع عند الاستقبال",
    "providerWillReceive": "سيقوم مقدم الخدمة باستقبال الدفع نقداً",
    "noAdditionalFees": "يمكنك الدفع بدون رسوم إضافية",
    "receiptWillBeSent": "سيتم إرسال إيصال بعد الدفع",
    "processingPayment": "جاري معالجة الدفع...",
    "confirmPayment": "تأكيد الدفع",
    "paymentDone": "تم الدفع",
    
    // Search Page
    "searchAndFilter": "البحث والفلترة",
    "price": "السعر",
    "minimumRating": "التقييم الأدنى",
    "results": "النتائج",
    
    // Favorites Page
    "noFavorites": "لا توجد عناصر في المفضلة",
    
    // My Orders Page
    "myOrders": "طلباتي",
    "myBookings": "حجوزاتي",
    "currentOrders": "الطلبات الحالية",
    "pastOrders": "الطلبات السابقة",
    "noCurrentOrders": "لا توجد طلبات حالية",
    "upcoming": "قادمة",
    "confirmed": "تم التأكيد",
    "completed": "مكتملة",
    
    // Patient Profile Page
    "myProfile": "ملفي الشخصي",
    "editProfile": "تعديل الملف",
    "healthInfo": "المعلومات الصحية",
    "age": "العمر",
    "bloodType": "فصيلة الدم",
    "chronicDiseases": "الأمراض المزمنة",
    "allergies": "الحساسيات",
    "none": "لا توجد",
    
    // Service Details Page
    "requestService": "اطلب الخدمة الآن",
    
    // Second Page
    "selectAppropriateService": "اختر الخدمة المناسبة",
    "selectConditionForFirstAid": "اختر الحالة المرضية للحصول على خطوات الإسعافات الأولية الصحيحة",
    
    // Third Page
    "selectSpecialty": "اختر تخصصك",
  },
  en: {
    // Header
    "booking": "Book Service",
    "settings": "Settings",
    "home": "Home",
    
    // Booking Page
    "bookingSummary": "Booking Summary",
    "service": "Service",
    "selectedServices": "Selected Services",
    "serviceProvider": "Service Provider",
    "totalPrice": "Total Price",
    "requiredDate": "Required Date",
    "preferredTime": "Preferred Time",
    "location": "Location Address",
    "primaryAddress": "My Primary Address",
    "secondaryAddress": "My Secondary Address",
    "addNewAddress": "+ Add New Address",
    "additionalNotes": "Additional Notes",
    "additionalNotesPlaceholder": "Add any information or special instructions...",
    "confirmations": "Confirmations",
    "agreeTerms": "I agree to the Terms of Service",
    "agreePrivacy": "I agree to the Privacy Policy 🔒",
    "privacyDescription": "I confirm that I have read the terms and data protection policy",
    "agreeCommunication": "Allow contact for confirmation and follow-up ☑️",
    "continuePayment": "Continue to Payment",
    "acceptConditions": "Please accept the terms and conditions",
    "back": "Back",
    "selectedDate": "✓ Selected Date:",
    "selectedTime": "✓ Selected Time:",
    "acceptPrivacy": "You must agree to the privacy policy to continue booking ✓",
    "acceptTerms": "You must agree to the terms of service to continue booking ✓",
    
    // Settings Page
    "accountData": "Account Data",
    "patientAccount": "🏥 Patient Account",
    "preferences": "🎨 Preferences",
    "darkMode": "Dark Mode",
    "enabled": "Enabled",
    "disabled": "Disabled",
    "language": "Language",
    "arabic": "العربية",
    "english": "English",
    "notifications": "Notifications",
    "active": "Active",
    "inactive": "Inactive",
    "accountSecurity": "🔐 Account & Security",
    "changePassword": "Change Password",
    "updateEmail": "Update Email",
    "updatePhone": "Update Phone Number",
    "supportHelp": "📞 Support & Help",
    "faq": "Frequently Asked Questions",
    "contactUs": "Contact Us",
    "appInfo": "ℹ️ App Information",
    "appVersion": "App Version",
    "logout": "🚪 Logout",
    "home_nav": "Home",
    "search_nav": "Search",
    "orders_nav": "Orders",
    "settings_nav": "Settings",
    
    // Home Page
    "homeWelcome": "Welcome to Healthcare",
    "selectService": "Select the required service",
    "searchServices": "Search for services",
    "notifications_title": "Notifications",
    "noNotifications": "No notifications at the moment",
    "clearAll": "Clear All Notifications",
    "healthcare": "Healthcare",
    "trustworthyPlatform": "Your trusted health platform",
    "privacyPolicy": "Privacy Policy",
    "shareApp": "Share the App",
    "about": "About the App",
    "rateApp": "Rate the App",
    "version": "Version",
    "favorites": "Favorites",
    
    // Payment Page
    "paymentInvoices": "Payment & Invoices",
    "paymentTab": "Payment",
    "invoicesTab": "Invoices",
    "paymentMethod": "Payment Method",
    "creditCard": "Credit Card",
    "bankTransfer": "Bank Transfer",
    "paymentOnDelivery": "Pay on Delivery",
    "cardNumber": "Card Number",
    "expiryDate": "Expiry Date",
    "cvv": "CVV",
    "cardholderName": "Cardholder Name",
    "bankName": "Bank Name",
    "accountNumber": "Account Number",
    "iban": "IBAN Number",
    "paymentOnDeliveryDesc": "Pay on Delivery",
    "providerWillReceive": "The service provider will receive cash payment",
    "noAdditionalFees": "You can pay without additional fees",
    "receiptWillBeSent": "A receipt will be sent after payment",
    "processingPayment": "Processing payment...",
    "confirmPayment": "Confirm Payment",
    "paymentDone": "Payment Done",
    
    // Search Page
    "searchAndFilter": "Search & Filter",
    "price": "Price",
    "minimumRating": "Minimum Rating",
    "results": "Results",
    
    // Favorites Page
    "noFavorites": "No items in favorites",
    
    // My Orders Page
    "myOrders": "My Orders",
    "myBookings": "My Bookings",
    "currentOrders": "Current Orders",
    "pastOrders": "Past Orders",
    "noCurrentOrders": "No current orders",
    "upcoming": "Upcoming",
    "confirmed": "Confirmed",
    "completed": "Completed",
    
    // Patient Profile Page
    "myProfile": "My Profile",
    "editProfile": "Edit Profile",
    "healthInfo": "Health Information",
    "age": "Age",
    "bloodType": "Blood Type",
    "chronicDiseases": "Chronic Diseases",
    "allergies": "Allergies",
    "none": "None",
    
    // Service Details Page
    "requestService": "Request Service Now",
    
    // Second Page
    "selectAppropriateService": "Choose the appropriate service",
    "selectConditionForFirstAid": "Choose the medical condition to get the correct first aid steps",
    
    // Third Page
    "selectSpecialty": "Choose your specialty",
  }
};

// Helper function to get translation
export function t(key: string, language: string): string {
  const lang = language === "en" ? "en" : "ar";
  return translations[lang as keyof typeof translations][key as never] || key;
}
