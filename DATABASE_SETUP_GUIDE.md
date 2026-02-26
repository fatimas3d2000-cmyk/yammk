# 📊 شرح قاعدة البيانات الشاملة
# Comprehensive Database Documentation

## 🎯 الملخص
تم إنشاء قاعدة بيانات شاملة وآمنة لتطبيق **يمك الصحة السعادة** السعادة تحتوي على:
- ✅ جميع الجداول المطلوبة
- ✅ علاقات صحيحة بين الجداول
- ✅ سياسات أمان (RLS) محكمة
- ✅ Indexes لتحسين الأداء
- ✅ دوال مساعدة (Triggers)

---

## 📁 الجداول الرئيسية

### 1️⃣ **patients** (المرضى والموفرين)
الجدول الأساسي الذي يحتوي على بيانات المستخدمين:

| الحقل | النوع | الوصف |
|-----|------|-------|
| id | BIGSERIAL | المعرف الفريد (مفتاح أساسي) |
| full_name | TEXT | اسم المستخدم كاملاً |
| email | TEXT | البريد الإلكتروني (فريد) |
| phone | TEXT | رقم الهاتف |
| password | TEXT | كلمة المرور (مشفرة) |
| user_type | TEXT | نوع المستخدم (patient/provider) |
| profile_picture | TEXT | رابط صورة الملف الشخصي |
| bio | TEXT | السيرة الذاتية |
| specialization | TEXT | التخصص (للموفرين فقط) |
| experience | INTEGER | سنوات الخبرة (للموفرين فقط) |
| license_number | TEXT | رقم الترخيص (للموفرين فقط) |
| rating | DECIMAL | التقييم (0-5) |
| linked_google | BOOLEAN | هل مرتبط مع Google؟ |
| linked_google_email | TEXT | بريد Google المرتبط |
| linked_google_id | TEXT | معرف Google الفريد |
| is_active | BOOLEAN | هل الحساب نشط؟ |
| created_at | TIMESTAMP | تاريخ الإنشاء |
| updated_at | TIMESTAMP | تاريخ آخر تعديل |

**الفهارس (Indexes):**
- email
- user_type
- is_active
- created_at

---

### 2️⃣ **service_catalog** (الخدمات الصحية)
قائمة الخدمات المتاحة:

| الحقل | النوع |
|-----|------|
| id | BIGSERIAL |
| name | TEXT |
| name_en | TEXT |
| description | TEXT |
| description_en | TEXT |
| price | DECIMAL |
| category | TEXT |
| image_url | TEXT |
| duration_minutes | INTEGER |
| is_active | BOOLEAN |

---

### 3️⃣ **service_orders** (الطلبات)
طلبات الخدمات من المرضى:

| الحقل | النوع |
|-----|------|
| id | BIGSERIAL |
| patient_id | BIGINT → patients(id) |
| provider_id | BIGINT → patients(id) |
| status | TEXT |
| total_price | DECIMAL |
| notes | TEXT |
| scheduled_date | TIMESTAMP |

**الحالات (Status):**
- pending (قيد الانتظار)
- accepted (مقبول)
- completed (مكتمل)
- cancelled (ملغي)

---

### 4️⃣ **notifications** (الإشعارات)
إشعارات المستخدمين:

| الحقل | النوع |
|-----|------|
| id | BIGSERIAL |
| user_id | BIGINT → patients(id) |
| title | TEXT |
| message | TEXT |
| notification_type | TEXT |
| related_order_id | BIGINT → service_orders(id) |
| is_read | BOOLEAN |

---

### 5️⃣ **reviews** (التقييمات والمراجعات)
تقييمات الخدمات:

| الحقل | النوع |
|-----|------|
| id | BIGSERIAL |
| order_id | BIGINT → service_orders(id) |
| patient_id | BIGINT → patients(id) |
| provider_id | BIGINT → patients(id) |
| rating | DECIMAL (1-5) |
| review_text | TEXT |

---

## 🔐 سياسات الأمان (RLS Policies)

### جداول عامة (متاحة للجميع):
- **service_catalog** - يمكن للجميع قراءة الخدمات النشطة
- **nurses, lab_technicians, physiotherapists** - متاح للجميع

### جداول خاصة بالمستخدم:
- **patients** - كل مستخدم يمكنه قراءة ملفاته الخاصة فقط
- **patient_addresses** - فقط المستخدم يمكنه رؤية عناوينه
- **patient_settings** - فقط المستخدم يمكنه تعديل إعداداته
- **notifications** - فقط المستخدم يمكنه رؤية إشعاراته
- **service_orders** - المريض والموفر يمكنهما رؤية الطلب

---

## 🚀 كيفية التطبيق

### الخطوة 1: نسخ الملف
قم بنسخ ملف قاعدة البيانات:
- `lib/comprehensive-database-setup.sql`

### الخطوة 2: فتح Supabase Dashboard
اذهب إلى: https://app.supabase.com → اختر مشروعك

### الخطوة 3: فتح SQL Editor
- انقر على **SQL Editor** من الجانب الأيسر
- انقر على **New Query**

### الخطوة 4: نسخ والصق الـ SQL
- انسخ محتوى `comprehensive-database-setup.sql` كاملاً
- الصقه في الـ Editor

### الخطوة 5: التنفيذ
- اضغط **Run** (أو Ctrl+Enter)
- انتظر حتى تنتهي العملية

### الخطوة 6: التحقق
بعد النجاح، يجب أن ترى:
- ✅ جميع الجداول تم إنشاؤها
- ✅ جميع السياسات تم تعيينها
- ✅ الفهارس جاهزة

---

## 🔗 المتطلبات البيئية

تأكد من وجود هذه المتغيرات في `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**الحصول عليها:**
1. اذهب إلى Supabase Dashboard
2. انقر على **Settings** (الترس)
3. انقر على **API**
4. انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 💾 نماذج البيانات (Sample Data)

### إضافة خدمة:
```sql
INSERT INTO service_catalog (name, name_en, description, price, category, duration_minutes, is_active)
VALUES 
('تمريض منزلي', 'Home Nursing', 'خدمة التمريض في المنزل', 150, 'nursing', 60, true),
('فحص دم', 'Blood Test', 'فحص الدم الشامل', 50, 'laboratory', 30, true);
```

### إضافة مستخدم:
```sql
INSERT INTO patients (full_name, email, phone, password, user_type, is_active)
VALUES ('محمد علي', 'mohammad@example.com', '0501234567', 'hashed_password', 'patient', true);
```

---

## 🆘 حل المشاكل الشائعة

### مشكلة: "column does not exist"
**السبب:** أسماء الأعمدة خاطئة
**الحل:** تأكد من استخدام أسماء الأعمدة الصحيحة من الجدول أعلاه

### مشكلة: "permission denied"
**السبب:** سياسات RLS قد تكون محكمة جداً
**الحل:** 
1. انقر على الجدول في Dashboard
2. انقر على **RLS** 
3. تحقق من السياسات

### مشكلة: "FOREIGN KEY constraint failed"
**السبب:** محاولة إدراج مرجع غير موجود
**الحل:** تأكد من أن `patient_id` و`provider_id` موجودة في جدول `patients`

---

## 📱 تطبيق الأمان الأفضل

### للمرضى:
- يمكنهم رؤية ملفاتهم الشخصية فقط
- يمكنهم رؤية طلباتهم
- يمكنهم تقييم الموفرين

### للموفرين:
- يمكنهم رؤية الطلبات المخصصة لهم
- يمكنهم تحديث حالة الطلب
- يمكنهم إضافة ملاحظات

### للنظام:
- الخدمات متاحة للجميع للقراءة
- الإشعارات شخصية لكل مستخدم

---

## 🎓 مثال عملي كامل

### سيناريو: مريض يطلب خدمة تمريض

**1. إضافة طلب:**
```sql
INSERT INTO service_orders (patient_id, provider_id, status, total_price, scheduled_date)
VALUES (1, 2, 'pending', 150, NOW() + INTERVAL '1 day');
```

**2. إضافة تفاصيل الخدمة:**
```sql
INSERT INTO order_services (order_id, service_id, quantity, unit_price, total_price)
VALUES (1, 1, 1, 150, 150);
```

**3. إضافة عنوان الخدمة:**
```sql
INSERT INTO order_addresses (order_id, address, city, postal_code)
VALUES (1, 'شارع النيل 123', 'القاهرة', '11111');
```

**4. إنشاء إشعار:**
```sql
INSERT INTO notifications (user_id, title, message, notification_type, related_order_id)
VALUES (2, 'طلب جديد', 'لديك طلب جديد', 'new_order', 1);
```

---

## 📊 الإحصائيات والتقارير

### عدد الطلبات:
```sql
SELECT COUNT(*) FROM service_orders;
```

### متوسط التقييم:
```sql
SELECT AVG(rating) FROM reviews WHERE provider_id = 2;
```

### الطلبات النشطة:
```sql
SELECT * FROM service_orders WHERE status IN ('pending', 'accepted');
```

---

## ✅ قائمة الفحص

بعد تطبيق قاعدة البيانات، تأكد من:

- [ ] جميع الجداول تم إنشاؤها
- [ ] RLS مفعل على جميع الجداول
- [ ] الفهارس جاهزة
- [ ] Triggers تعمل بشكل صحيح
- [ ] البيئة محدثة بـ API keys
- [ ] الاتصال يعمل من التطبيق
- [ ] البيانات التجريبية موجودة

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من رسائل الخطأ في الـ Dashboard
2. راجع قسم **حل المشاكل الشائعة**
3. تأكد من الخطوات المذكورة أعلاه

---

## 🎉 النهاية

قاعدة البيانات الآن جاهزة للاستخدام!

يمكنك البدء في استخدام التطبيق والبيانات ستُحفظ بأمان في Supabase.

السلام عليكم ورحمة الله وبركاته ✨
