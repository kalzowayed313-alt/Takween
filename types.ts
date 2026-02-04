
export enum Role {
  ADMIN = 'ADMIN',
  DEPT_MANAGER = 'DEPT_MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum TaskStatus {
  NEW = 'جديد',
  IN_PROGRESS = 'قيد التنفيذ',
  REVIEW = 'قيد المراجعة',
  PENDING = 'معلق',
  COMPLETED = 'مكتمل'
}

export enum TaskPriority {
  LOW = 'منخفضة',
  MEDIUM = 'متوسطة',
  HIGH = 'عالية'
}

export interface Department {
  id: string;
  name: string;
  color: string;
  employeeCount: number;
  kpiTarget?: number; // الهدف المطلوب من القسم ككل
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password?: string; // كلمة المرور
  role: Role;
  departmentId: string;
  avatar: string;
  kpi: number;
  kpiTarget?: number; // الهدف الفردي المطلوب
  joinedDate: string;
  status: 'ACTIVE' | 'PENDING';
}

export interface KpiRule {
  id: string;
  title: string;
  category: string;
  defaultPoints: number;
  defaultHours: number;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  departmentId: string;
  projectId?: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  comments: Comment[];
  attachments: Attachment[];
  kpiPoints: number;
  weight: number; 
}

export interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  deadline: string;
  managerId: string;
  departmentId: string;
  progress: number;
}

export interface SprintExtension {
  id: string;
  oldEndDate: string;
  newEndDate: string;
  reason: string;
  extendedAt: string;
  extendedBy: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'CLOSED';
  projectId: string;
  extensions?: SprintExtension[];
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'ANNUAL' | 'SICK' | 'EMERGENCY';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  attachmentUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_LEAVE';
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
}
