# تكامل Supabase الحقيقي

## ملخص التحديثات

تم تحويل التطبيق من نسخة تجريبية (mock data) إلى استخدام **Supabase الحقيقي** للعمليات التالية:

### 1️⃣ **تسجيل المستخدمين (Signup)**
- ✅ `app/api/auth/signup/route.ts` - يكتب البيانات إلى جدول `patients`
- ✅ كلمات المرور مشفرة باستخدام `bcryptjs`
- ✅ التحقق من عدم تكرار البريد الإلكتروني

### 2️⃣ **دخول المستخدمين (Login)**
- ✅ `app/api/auth/login/route.ts` - يقرأ من جدول `patients`
- ✅ التحقق من كلمة المرور بشكل آمن
- ✅ الشيفرة آمنة من هجمات Brute Force

### 3️⃣ **التحقق من Google (Google Auth)**
- ✅ `lib/googleAuth.ts` - يقرأ حسابات المستخدمين الفعليين من Supabase
- ✅ حفظ الحسابات المرتبطة في Supabase
- ✅ الحصول على الحسابات المرتبطة من Supabase
- ✅ فك ربط الحسابات من Supabase

---

## المتطلبات المفقودة ⚠️

**اتبع هذه الخطوات لجعل التطبيق يعمل بشكل كامل:**

### 1. تعريف متغيرات البيئة
أضف إلى ملف `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. تحقق من بنية جدول `patients`
يجب أن يحتوي على الأعمدة التالية:
```sql
- id (UUID or String) PRIMARY KEY
- full_name (String)
- email (String) UNIQUE
- phone (String)
- password (String) - hashed
- user_type (String: 'patient' or 'provider')
- profile_picture (String, nullable)
- google_account (JSON, nullable)
- linked_google (Boolean)
- linked_google_email (String, nullable)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 3. تحديث صور المستخدمين

إذا أردت إضافة صور للمستخدمين يجب:
1. تحميل الصور إلى Supabase Storage
2. تحديث حقل `profile_picture` برابط الصورة

---

## اختبار الاتصال ✅

### اختبر الـ Signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "0501234567",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### اختبر الـ Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "SecurePass123"
  }'
```

---

## ملاحظات مهمة 📝

1. **bcryptjs مثبت**: تحقق من `npm list bcryptjs`
2. **SUPABASE_SERVICE_ROLE_KEY مهم**: لا تنشره في الكود العام
3. **RLS Policies**: تأكد من أن سياسات RLS تسمح بـ:
   - إدراج سجلات جديدة
   - قراءة السجلات
   - تحديث السجلات الخاصة بالمستخدم
4. **localStorage عارضة**: التطبيق يستخدم localStorage كـ fallback عندما لا يتمكن من الوصول إلى Supabase

---

## الخطوات التالية 🚀

- [ ] إضافة API endpoints للخدمات Services
- [ ] إضافة API endpoints للمزودين Providers
- [ ] إضافة API endpoints للطلبات Orders
- [ ] تحسين نظام حقوق الوصول RLS
- [ ] إضافة نقاط API للإشعارات Notifications
