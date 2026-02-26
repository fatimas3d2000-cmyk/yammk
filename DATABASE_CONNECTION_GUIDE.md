# 🔌 ربط التطبيق بقاعدة البيانات
# Application to Database Connection Guide

## 📌 الملفات الأساسية المستخدمة

### 1. `lib/supabase.ts` - اتصال Supabase الأساسي
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**الاستخدام في جميع الصفحات والـ API**

---

## 🔑 متغيرات البيئة المطلوبة

ضع هذه المتغيرات في `.env.local`:

```env
# Supabase URLs and Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# اختياري: للتطوير المحلي
NEXT_DEVELOPMENT=true
```

---

## 🚀 الملفات المهمة والمثبتة

### API المصادقة

#### `app/api/auth/signup/route.ts`
**الوظيفة:** تسجيل مستخدم جديد
**المعاملات:**
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "confirmPassword": "string",
  "userType": "patient|provider" (اختياري)
}
```

**العملية:**
1. ✅ التحقق من البيانات
2. ✅ التحقق من وجود البريد بالفعل
3. ✅ تشفير كلمة المرور
4. ✅ إدراج المستخدم في جدول `patients`
5. ✅ إرجاع بيانات المستخدم

---

#### `app/api/auth/login/route.ts`
**الوظيفة:** دخول المستخدم
**المعاملات:**
```json
{
  "email": "string",
  "password": "string"
}
```

**العملية:**
1. ✅ البحث عن المستخدم
2. ✅ التحقق من كلمة المرور
3. ✅ إرجاع بيانات المستخدم (بدون كلمة المرور)

---

### API الخدمات

#### `app/api/get-services/route.ts`
**الوظيفة:** الحصول على قائمة الخدمات
**نوع الطلب:** GET
**الاستجابة:**
```json
{
  "services": [
    {
      "id": 1,
      "name": "تمريض منزلي",
      "price": 150,
      "category": "nursing"
    }
  ]
}
```

---

#### `app/api/get-providers/route.ts`
**الوظيفة:** الحصول على قائمة الموفرين
**نوع الطلب:** GET
**الاستجابة:**
```json
{
  "providers": [
    {
      "id": 1,
      "full_name": "د. محمد أحمد",
      "specialization": "تمريض",
      "rating": 4.5
    }
  ]
}
```

---

## 📱 الصفحات المتصلة بقاعدة البيانات

### صفحات المصادقة

#### `app/patient-login/page.tsx`
- ✅ تسجيل دخول المريض
- ✅ مصادقة Google
- ✅ ربط حساب Google

#### `app/patient-signup/page.tsx`
- ✅ تسجيل حساب جديد (مريض)
- ✅ التحقق من البيانات

#### `app/provider-login/page.tsx`
- ✅ تسجيل دخول الموفر

---

### الصفحات الحساسة

#### `app/providers/page.tsx`
- استرجاع قائمة الموفرين من Supabase
- استخدام `get-providers` API

#### `app/services/page.tsx`
- استرجاع قائمة الخدمات من Supabase
- استخدام `get-services` API

#### `app/dashboard/page.tsx`
- عرض بيانات المستخدم الحالي
- الطلبات والإشعارات

---

## 🔐 مصادقة Google المتقدمة

### `lib/googleAuth.ts`
**الدوال الرئيسية:**

1. **fetchAvailableGoogleAccounts()**
   - جلب حسابات Google المتاحة من Supabase
   - تُستخدم في عرض لائحة الحسابات

2. **showGoogleAccountSelector()**
   - عرض نافذة اختيار الحساب
   - إرجاع الحساب المختار

3. **signInWithGoogle()**
   - دخول شامل عبر Google
   - يحاول Capacitor أولاً، ثم Web fallback

4. **saveLinkGoogleAccount()**
   - حفظ ربط حساب Google في Supabase
   - يضع البيانات في جدول `patients`

5. **getLinkedGoogleAccount()**
   - الحصول على حساب Google المرتبط
   - تُستخدم في التحقق من الربط

6. **unlinkGoogleAccount()**
   - فك ربط حساب Google
   - حذف البيانات من Supabase

---

## 💾 أمثلة على الاستخدام

### 1. تسجيل مستخدم جديد
```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'أحمد محمد',
    email: 'ahmad@example.com',
    phone: '0501234567',
    password: 'password123',
    confirmPassword: 'password123',
    userType: 'patient'
  })
});

const data = await response.json();
```

---

### 2. دخول المستخدم
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'ahmad@example.com',
    password: 'password123'
  })
});

const { user } = await response.json();
```

---

### 3. الحصول على الخدمات
```typescript
const response = await fetch('/api/get-services');
const { services } = await response.json();
```

---

### 4. ربط حساب Google
```typescript
import { signInWithGoogle, saveLinkGoogleAccount } from '@/lib/googleAuth';

const result = await signInWithGoogle();
if (result) {
  await saveLinkGoogleAccount(result, 'patient', userId);
}
```

---

## 🧪 التحقق من الاتصال

### استخدام API اختبار الاتصال
```bash
curl http://localhost:3000/api/test-supabase-connection
```

**الاستجابة المتوقعة:**
```json
{
  "success": true,
  "message": "تم الاتصال بنجاح",
  "data": {...}
}
```

---

## ⚠️ نقاط مهمة

### 🔒 الأمان
1. **كلمات المرور:** تُشفر باستخدام `bcryptjs`
2. **RLS Policies:** مفعلة على جميع الجداول
3. **Service Role Key:** يُستخدم فقط في الـ Server-side API

### ⚡ الأداء
1. **Indexes:** موجودة على جميع المفاتيح المستخدمة بكثرة
2. **Triggers:** تحديث تاريخ `updated_at` تلقائياً
3. **Relations:** علاقات صحيحة بين الجداول

### 📝 البيانات
1. **Validation:** التحقق من الصيغة في الـ API
2. **Constraints:** قيود على مستوى قاعدة البيانات
3. **Cascading:** حذف تلقائي للبيانات المرتبطة

---

## 🆘 استكشاف الأخطاء

### خطأ: "column does not exist"
**السبب:** اسم العمود خاطئ
**الحل:** استخدم أسماء الأعمدة من `DATABASE_SETUP_GUIDE.md`

---

### خطأ: "policy violation"
**السبب:** سياسات RLS تحظر هذه العملية
**الحل:** تحقق من السياسات في Supabase Dashboard

---

### خطأ: "FOREIGN KEY constraint failed"
**السبب:** محاولة إدراج مرجع غير موجود
**الحل:** تأكد من أن المرجع موجود بالفعل في الجدول الأساسي

---

## 📚 موارد إضافية

- Supabase Docs: https://supabase.com/docs
- Supabase Client Libraries: https://github.com/supabase/supabase-js
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

## ✅ قائمة التحقق

- [ ] تم إنشاء قاعدة البيانات بنجاح
- [ ] متغيرات البيئة محدثة
- [ ] API اختبار الاتصال يعمل
- [ ] التسجيل يعمل بنجاح
- [ ] الدخول يعمل بنجاح
- [ ] Google Auth يعمل بنجاح
- [ ] الخدمات تظهر بشكل صحيح
- [ ] الإشعارات تُرسل بشكل صحيح

---

## 🎉 النهاية

قاعدة البيانات الآن متصلة بالتطبيق وجاهزة للاستخدام!

السلام عليكم ورحمة الله وبركاته ✨
