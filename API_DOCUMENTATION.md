# API Endpoints Documentation

## نقاط البرمجة الجديدة المتاحة

### 1. اختبار الاتصال بـ Supabase ✅
```bash
GET /api/test-supabase-connection
```

**الرد:**
```json
{
  "success": true,
  "message": "✅ اتصالك بـ Supabase يعمل بنجاح!",
  "totalPatients": 5,
  "timestamp": "2026-02-23T10:30:00Z"
}
```

---

### 2. التسجيل (Sign Up)
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "0501234567",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "userType": "patient"
}
```

**الرد:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "user": {
    "id": "uuid",
    "full_name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "0501234567"
  }
}
```

---

### 3. تسجيل الدخول (Login)
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "SecurePass123"
}
```

**الرد:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "full_name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "0501234567"
  }
}
```

---

### 4. الحصول على الخدمات
```bash
GET /api/get-services
```

**الرد:**
```json
{
  "success": true,
  "services": [
    {
      "id": "1",
      "name": "الكشف الطبي",
      "description": "زيارة طبية منزلية",
      "price": 150
    }
  ],
  "count": 1
}
```

---

### 5. الحصول على المزودين
```bash
GET /api/get-providers
```

**الرد:**
```json
{
  "success": true,
  "providers": [
    {
      "id": "uuid",
      "full_name": "د. محمد علي",
      "email": "doctor@example.com",
      "user_type": "provider",
      "is_active": true
    }
  ],
  "count": 1
}
```

---

## أمثلة استخدام في TypeScript

### استخدام في صفحة React:

```typescript
// جلب الخدمات
async function fetchServices() {
  const response = await fetch('/api/get-services');
  const data = await response.json();
  console.log(data.services);
}

// جلب المزودين
async function fetchProviders() {
  const response = await fetch('/api/get-providers');
  const data = await response.json();
  console.log(data.providers);
}

// تسجيل مستخدم جديد
async function signUp(userData: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
}

// تسجيل الدخول
async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
}
```

---

## رموز الخطأ

| الكود | الوصف |
|------|-------|
| 400 | طلب غير صحيح (بيانات ناقصة أو خطأ في الاتصال) |
| 401 | بيانات اعتماد غير صحيحة |
| 409 | البريد الإلكتروني مسجل بالفعل |
| 500 | خطأ في الخادم |

---

## ملاحظات أمان ⚠️

1. **كلمات المرور**: مشفرة باستخدام bcryptjs
2. **CORS**: تأكد من تكوين CORS بشكل صحيح
3. **Rate Limiting**: يجب إضافة حدود معدل للحماية من الهجمات
4. **HTTPS**: استخدم HTTPS في الإنتاج
5. **متغيرات البيئة**: لا تنشر مفاتيح API الخاصة بك
