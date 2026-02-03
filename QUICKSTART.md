# ⚡ دليل البدء السريع - 5 دقائق

اتبع هذه الخطوات لتشغيل المشروع بسرعة:

---

## 🚀 الطريقة 1: استخدام السكريبت التلقائي (الأسهل)

### المتطلبات:
- Node.js 18+
- PostgreSQL (أو Docker)

### الخطوات:

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd takween-management-system

# 2. تشغيل سكريبت الإعداد
chmod +x setup.sh
./setup.sh

# 3. تشغيل المشروع
npm run dev
```

**✅ الآن افتح المتصفح:** http://localhost:3000

---

## 🐳 الطريقة 2: استخدام Docker (موصى به)

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd takween-management-system

# 2. تشغيل عبر Docker
docker-compose up -d

# 3. إعداد قاعدة البيانات
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx tsx prisma/seed.ts
```

**✅ الآن افتح المتصفح:** http://localhost:3000

---

## 📝 الطريقة 3: يدوياً (كامل التحكم)

### 1. تثبيت المكتبات

```bash
npm install
```

### 2. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة بيانات PostgreSQL
createdb takween

# نسخ ملف البيئة
cp .env.example .env

# تعديل .env بمعلومات قاعدة البيانات الخاصة بك
nano .env
```

### 3. إعداد Prisma

```bash
# توليد Prisma Client
npx prisma generate

# تشغيل Migrations
npx prisma migrate dev --name init

# إضافة بيانات تجريبية
npx tsx prisma/seed.ts
```

### 4. تشغيل المشروع

```bash
npm run dev
```

---

## 🔑 بيانات تسجيل الدخول

بعد تشغيل seed، استخدم:

```
Email:    admin@takween.com
Password: admin123
```

---

## 📚 الخطوات التالية

1. ✅ اقرأ [README.md](./README.md) للتفاصيل الكاملة
2. ✅ راجع [API Documentation](./docs/api.md)
3. ✅ اطلع على [CONTRIBUTING.md](./CONTRIBUTING.md) للمساهمة

---

## ⚠️ استكشاف الأخطاء

### المشكلة: "Cannot connect to database"

**الحل:**
```bash
# تأكد من تشغيل PostgreSQL
# إذا كنت تستخدم Docker:
docker-compose up -d postgres

# تأكد من DATABASE_URL في .env
echo $DATABASE_URL
```

### المشكلة: "Prisma Client not generated"

**الحل:**
```bash
npx prisma generate
```

### المشكلة: "Port 3000 already in use"

**الحل:**
```bash
# قتل العملية على المنفذ 3000
lsof -ti:3000 | xargs kill -9

# أو استخدم منفذ آخر
PORT=3001 npm run dev
```

---

## 🎯 ماذا بعد؟

- [ ] غيّر `NEXTAUTH_SECRET` في `.env`
- [ ] أضف Google OAuth credentials
- [ ] راجع إعدادات الأمان
- [ ] اضبط متغيرات البيئة للإنتاج

---

**✨ الآن أنت جاهز للبدء!** 🚀
