# طرق إضافة المستخدمين التجريبيين

## الطريقة 1️⃣: استخدام Script Node.js (الأفضل)

### الخطوات:

1. **إضافة متغير البيئة** (اختياري):
```env
# في .env.local
ADMIN_SEED_KEY=your-admin-key-123
```

2. **تشغيل السكريبت**:
```bash
npx ts-node scripts/seed-users.ts
```

أو إذا كان لديك مشاكل:
```bash
npx tsx scripts/seed-users.ts
```

### المستخدمون الذين سيتم إضافتهم:

| البريد | كلمة المرور | النوع |
|------|-----------|------|
| doctor@example.com | Doctor@123 | مزود (طبيب) |
| patient1@example.com | Patient@123 | مريض |
| patient2@example.com | Patient@123 | مريض |
| nurse@example.com | Nurse@123 | مزود (ممرضة) |
| therapist@example.com | Therapist@123 | مزود (معالج) |

---

## الطريقة 2️⃣: استخدام API Endpoint

### إضافة مستخدم واحد:

```bash
curl -X POST http://localhost:3000/api/admin/seed-users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-key-123" \
  -d '{
    "full_name": "محمد علي",
    "email": "newuser@example.com",
    "phone": "0501111111",
    "password": "SecurePass@123",
    "user_type": "patient",
    "profile_picture": "https://via.placeholder.com/150"
  }'
```

### جلب جميع المستخدمين:

```bash
curl -X GET http://localhost:3000/api/admin/seed-users \
  -H "Authorization: Bearer your-admin-key-123"
```

---

## الطريقة 3️⃣: عبر Supabase Dashboard

1. اذهب إلى: https://app.supabase.com
2. اختر مشروعك
3. اذهب إلى **SQL Editor**
4. شغل هذا الـ Query:

```sql
INSERT INTO patients (
  full_name, email, phone, password, user_type, is_active, created_at
) VALUES (
  'اسم المستخدم',
  'email@example.com',
  '0501234567',
  'hashed_password_here',
  'patient',
  true,
  NOW()
);
```

لكن تحتاج لتشفير كلمة المرور أولاً (استخدم الطريقة 1 أو 2 بدلاً من هذا)

---

## الطريقة 4️⃣: TypeScript في صفحة React (للتطوير فقط)

```typescript
// في صفحة أو component
async function insertTestUser() {
  const response = await fetch("/api/admin/seed-users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer your-admin-key-123",
    },
    body: JSON.stringify({
      full_name: "عم حسن",
      email: "hasanuncle@example.com",
      phone: "0501234567",
      password: "TestPass@123",
      user_type: "patient",
    }),
  });

  const data = await response.json();
  console.log(data);
}
```

---

## ⚠️ ملاحظات أمان مهمة:

1. **غير كلمة ADMIN_SEED_KEY** في الإنتاج
2. **لا تشغل seed script في production** مباشرة
3. **احم الـ endpoint** بـ rate limiting
4. **استخدم HTTPS** في الإنتاج فقط
5. **لا تحفظ كلمات المرور** بنصها العادي أبداً

---

## الآن يمكنك الدخول بهذه البيانات:

✅ **اختبر الـ Login**:
```bash
POST http://localhost:3000/api/auth/login
{
  "email": "doctor@example.com",
  "password": "Doctor@123"
}
```

✅ **اختبر الـ Signup**:
```bash
POST http://localhost:3000/api/auth/signup
{
  "fullName": "علي محمود",
  "email": "ali@example.com",
  "phone": "0509999999",
  "password": "Ali@Pass123",
  "confirmPassword": "Ali@Pass123"
}
```

---

## استكشاف الأخطاء:

### خطأ: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### خطأ: "ADMIN_SEED_KEY غير معرف"
تأكد من وجود الـ key في `.env.local`:
```env
ADMIN_SEED_KEY=your-admin-key-123
```

### خطأ: "Unauthorized"
تأكد من تمرير الـ Authorization header بشكل صحيح

---

## مثال عملي في PowerShell:

```powershell
# إضافة مستخدم واحد
$body = @{
    full_name = "رائد علي"
    email = "raed@example.com"
    phone = "0501234567"
    password = "Raed@123"
    user_type = "patient"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/seed-users" `
  -Method Post `
  -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer your-admin-key-123"
  } `
  -Body $body `
  -UseBasicParsing
```
