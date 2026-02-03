# 🔧 دليل التطوير التقني - نظام تكوين للهندسة

## 📋 جدول المحتويات
1. [متطلبات التطوير](#متطلبات-التطوير)
2. [هيكل المشروع](#هيكل-المشروع)
3. [إعداد البيئة](#إعداد-البيئة)
4. [API Endpoints](#api-endpoints)
5. [نماذج البيانات](#نماذج-البيانات)
6. [معايير الكود](#معايير-الكود)

---

## 🛠️ متطلبات التطوير

### Backend Requirements

#### خيار 1: Node.js Stack
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.6.0",
    "nodemailer": "^6.9.0",
    "express-validator": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
```

#### خيار 2: Python Stack
```txt
Django==4.2.0
djangorestframework==3.14.0
django-cors-headers==4.0.0
PyJWT==2.6.0
bcrypt==4.0.1
Pillow==9.5.0
django-storages==1.13.2
boto3==1.26.0
channels==4.0.0
celery==5.2.7
redis==4.5.4
```

### Frontend Requirements
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^13.4.0",
    "axios": "^1.4.0",
    "react-dnd": "^16.0.1",
    "chart.js": "^4.3.0",
    "react-chartjs-2": "^5.2.0",
    "tailwindcss": "^3.3.0",
    "zustand": "^4.3.8",
    "react-query": "^3.39.3",
    "date-fns": "^2.30.0",
    "socket.io-client": "^4.6.0"
  }
}
```

---

## 📁 هيكل المشروع المقترح

```
takween-project/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── auth.js
│   │   │   └── storage.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Department.js
│   │   │   ├── Task.js
│   │   │   ├── Sprint.js
│   │   │   ├── Attendance.js
│   │   │   └── KPI.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── taskController.js
│   │   │   ├── departmentController.js
│   │   │   └── kpiController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── tasks.js
│   │   │   ├── departments.js
│   │   │   └── kpi.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── permissions.js
│   │   │   ├── upload.js
│   │   │   └── validation.js
│   │   │
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   ├── notificationService.js
│   │   │   ├── kpiService.js
│   │   │   └── fileService.js
│   │   │
│   │   └── utils/
│   │       ├── helpers.js
│   │       ├── constants.js
│   │       └── logger.js
│   │
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   │
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── assets/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Modal.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Topbar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── KPICard.jsx
│   │   │   │   ├── Chart.jsx
│   │   │   │   └── ActivityFeed.jsx
│   │   │   │
│   │   │   └── tasks/
│   │   │       ├── TaskCard.jsx
│   │   │       ├── KanbanBoard.jsx
│   │   │       └── TaskForm.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Kanban.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── socket.js
│   │   │
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── taskStore.js
│   │   │   └── userStore.js
│   │   │
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   │
│   │   └── App.jsx
│   │
│   └── package.json
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   ├── api/
│   └── user-guide/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🚀 إعداد البيئة

### 1. Backend Setup

#### Node.js Version:
```bash
# استنساخ المشروع
git clone https://github.com/takween/project-management.git
cd project-management/backend

# تثبيت المكتبات
npm install

# إنشاء ملف البيئة
cp .env.example .env

# تعديل المتغيرات
nano .env
```

#### ملف .env:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/takween
# أو
DATABASE_URL=postgresql://user:password@localhost:5432/takween

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=takween-files
AWS_REGION=us-east-1

# Email (SendGrid/Mailgun)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis (for real-time)
REDIS_URL=redis://localhost:6379

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 2. Frontend Setup

```bash
cd ../frontend

# تثبيت المكتبات
npm install

# إنشاء ملف البيئة
cp .env.example .env.local

# تعديل المتغيرات
nano .env.local
```

#### ملف .env.local:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3. Database Setup

#### PostgreSQL:
```bash
# إنشاء قاعدة البيانات
createdb takween

# تشغيل Migrations
npm run migrate
```

#### MongoDB:
```bash
# تشغيل MongoDB
mongod --dbpath=/data/db

# استيراد البيانات التجريبية
npm run seed
```

### 4. تشغيل المشروع

```bash
# Backend
cd backend
npm run dev

# Frontend (في نافذة طرفية أخرى)
cd frontend
npm run dev
```

الآن افتح المتصفح على:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 📡 API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
```json
Request:
{
  "name": "محمد سعيد",
  "email": "mohamed@takween.com",
  "password": "SecurePass123!",
  "department_id": 1,
  "role": "employee"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "محمد سعيد",
      "email": "mohamed@takween.com",
      "role": "employee"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/login
```json
Request:
{
  "email": "mohamed@takween.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

#### GET /api/auth/google
```
Redirects to Google OAuth
```

#### POST /api/auth/logout
```json
Headers: {
  "Authorization": "Bearer <token>"
}

Response:
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

### User Endpoints

#### GET /api/users
```
Query Parameters:
- page (default: 1)
- limit (default: 20)
- department (optional)
- role (optional)
- search (optional)

Headers: {
  "Authorization": "Bearer <token>"
}

Response:
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 48,
      "page": 1,
      "pages": 3
    }
  }
}
```

#### GET /api/users/:id
```json
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "محمد سعيد",
    "email": "mohamed@takween.com",
    "role": "employee",
    "department": {
      "id": 1,
      "name": "قسم المعماري"
    },
    "kpi": {
      "monthly_score": 92,
      "tasks_completed": 24,
      "tasks_total": 26
    }
  }
}
```

#### POST /api/users
```json
Request:
{
  "name": "أحمد علي",
  "email": "ahmed@takween.com",
  "password": "TempPass123!",
  "department_id": 2,
  "role": "employee",
  "phone": "+973 1234 5678"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

#### PUT /api/users/:id
```json
Request:
{
  "name": "محمد سعيد المحدث",
  "phone": "+973 9999 8888",
  "role": "team_leader"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

#### DELETE /api/users/:id
```json
Response:
{
  "success": true,
  "message": "تم حذف الموظف بنجاح"
}
```

---

### Task Endpoints

#### GET /api/tasks
```
Query Parameters:
- status (backlog, todo, progress, review, done)
- priority (high, medium, low)
- department
- assigned_to
- sprint_id

Response:
{
  "success": true,
  "data": {
    "tasks": [...]
  }
}
```

#### GET /api/tasks/:id
```json
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "تصميم واجهة المبنى",
    "description": "...",
    "status": "progress",
    "priority": "high",
    "assigned_to": {
      "id": 1,
      "name": "محمد سعيد"
    },
    "attachments": [...],
    "comments": [...],
    "kpi": {
      "weight": 10,
      "points": 50
    }
  }
}
```

#### POST /api/tasks
```json
Request:
{
  "title": "مهمة جديدة",
  "description": "وصف المهمة",
  "department_id": 1,
  "assigned_to": [1, 2],
  "priority": "high",
  "start_date": "2026-02-03",
  "due_date": "2026-02-15",
  "kpi_weight": 10,
  "kpi_points": 50,
  "estimated_hours": 40
}

Response:
{
  "success": true,
  "data": { ... }
}
```

#### PUT /api/tasks/:id
```json
Request:
{
  "status": "review",
  "progress": 90
}

Response:
{
  "success": true,
  "data": { ... }
}
```

#### POST /api/tasks/:id/attachments
```
Content-Type: multipart/form-data

Files: files[] (multiple)

Response:
{
  "success": true,
  "data": {
    "attachments": [
      {
        "id": 1,
        "filename": "design.pdf",
        "url": "https://s3.../design.pdf",
        "size": 2048576
      }
    ]
  }
}
```

#### POST /api/tasks/:id/comments
```json
Request:
{
  "comment": "تم الانتهاء من المخططات"
}

Response:
{
  "success": true,
  "data": {
    "comment": {
      "id": 1,
      "comment": "...",
      "user": {...},
      "created_at": "2026-02-03T10:30:00Z"
    }
  }
}
```

---

### Department Endpoints

#### GET /api/departments
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "قسم المعماري",
      "manager": {...},
      "employees_count": 8,
      "kpi_score": 92
    }
  ]
}
```

---

### KPI Endpoints

#### GET /api/kpi/user/:id
```
Query: period (monthly, quarterly, yearly)

Response:
{
  "success": true,
  "data": {
    "user_id": 1,
    "period": "monthly",
    "score": 92,
    "tasks_completed": 24,
    "tasks_total": 26,
    "on_time_percentage": 91,
    "quality_score": 4.8,
    "attendance_rate": 96,
    "total_points": 480
  }
}
```

#### GET /api/kpi/department/:id
```json
Response:
{
  "success": true,
  "data": {
    "department_id": 1,
    "average_score": 92,
    "top_performers": [...],
    "total_tasks_completed": 127
  }
}
```

---

### Attendance Endpoints

#### POST /api/attendance/check-in
```json
Request:
{
  "user_id": 1
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "check_in": "2026-02-03T08:30:00Z",
    "status": "present"
  }
}
```

#### POST /api/attendance/check-out
```json
Request:
{
  "user_id": 1
}

Response:
{
  "success": true,
  "data": {
    "check_out": "2026-02-03T17:00:00Z",
    "hours_worked": 8.5
  }
}
```

#### GET /api/attendance/user/:id
```
Query: month, year

Response:
{
  "success": true,
  "data": {
    "records": [...],
    "summary": {
      "present_days": 20,
      "absent_days": 2,
      "late_days": 1,
      "attendance_rate": 95
    }
  }
}
```

---

## 🔐 Authentication Flow

### 1. Login with Email/Password:
```javascript
// Frontend
const login = async (email, password) => {
  const response = await axios.post('/api/auth/login', {
    email,
    password
  });
  
  // حفظ Token
  localStorage.setItem('token', response.data.data.token);
  
  // حفظ بيانات المستخدم
  localStorage.setItem('user', JSON.stringify(response.data.data.user));
  
  return response.data;
};
```

### 2. Login with Google:
```javascript
// Backend - Express
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);
```

### 3. Protect Routes:
```javascript
// Middleware
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token غير صالح'
    });
  }
};
```

---

## 📊 نماذج البيانات (Models)

### User Model:
```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // مطلوب فقط إذا لم يكن Google login
    },
    minlength: 8,
    select: false
  },
  googleId: String,
  avatar: String,
  phone: String,
  role: {
    type: String,
    enum: ['admin', 'dept_manager', 'team_leader', 'employee'],
    default: 'employee'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// مقارنة كلمة المرور
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Task Model:
```javascript
// models/Task.js
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['backlog', 'todo', 'progress', 'review', 'done', 'blocked'],
    default: 'backlog'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startDate: Date,
  dueDate: Date,
  kpi: {
    weight: Number,
    points: Number,
    estimatedHours: Number,
    completionCriteria: String
  },
  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint'
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    fileSize: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: Date
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
```

---

## 🎨 معايير الكود

### JavaScript/React:
```javascript
// ✅ Good
const TaskCard = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleStatusChange = async (newStatus) => {
    try {
      await onUpdate(task.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };
  
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => handleStatusChange('done')}>
        Mark Complete
      </button>
    </div>
  );
};

// ❌ Bad
function task(t,u){
  var e=false;
  function h(s){
    u(t.id,{status:s});
  }
  return <div><h3>{t.title}</h3><button onClick={()=>h('done')}>Done</button></div>;
}
```

### CSS:
```css
/* ✅ Good - استخدم BEM naming */
.task-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.task-card__title {
  font-size: 18px;
  font-weight: 600;
}

.task-card__description {
  color: #6b7280;
  font-size: 14px;
}

.task-card--priority-high {
  border-right: 4px solid #ef4444;
}

/* ❌ Bad */
.t{background:#fff;border-radius:12px;padding:20px}
.tt{font-size:18px;font-weight:600}
```

---

## 🧪 Testing

### Unit Tests:
```javascript
// tests/unit/kpiService.test.js
const { calculateMonthlyKPI } = require('../../src/services/kpiService');

describe('KPI Service', () => {
  it('should calculate correct KPI score', () => {
    const result = calculateMonthlyKPI({
      tasksCompleted: 24,
      tasksTotal: 26,
      onTimePercentage: 91,
      qualityScore: 4.8
    });
    
    expect(result.score).toBeCloseTo(92, 0);
  });
});
```

### Integration Tests:
```javascript
// tests/integration/tasks.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Task API', () => {
  let authToken;
  
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@takween.com',
        password: 'TestPass123!'
      });
    
    authToken = response.body.data.token;
  });
  
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

---

## 🚢 Deployment

### Docker:
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### docker-compose.yml:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/takween
    depends_on:
      - mongo
      - redis
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
  
  redis:
    image: redis:7-alpine
    
volumes:
  mongo-data:
```

---

## 📝 Git Workflow

### Branch Strategy:
```
main
  └── develop
      ├── feature/kanban-board
      ├── feature/kpi-system
      └── bugfix/login-issue
```

### Commit Message Format:
```
feat: إضافة لوحة كانبان
fix: إصلاح مشكلة تسجيل الدخول
docs: تحديث دليل التطوير
style: تحسين تصميم بطاقات المهام
refactor: إعادة هيكلة KPI Service
test: إضافة اختبارات للمهام
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions:
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deployment script
```

---

## 📚 المراجع والموارد

### Documentation:
- Express.js: https://expressjs.com
- React: https://react.dev
- Next.js: https://nextjs.org
- MongoDB: https://docs.mongodb.com
- Socket.io: https://socket.io/docs

### Design Resources:
- Tailwind CSS: https://tailwindcss.com
- Chart.js: https://www.chartjs.org
- React DnD: https://react-dnd.github.io/react-dnd

---

**تم إعداده بواسطة فريق تكوين للهندسة - 2026**
