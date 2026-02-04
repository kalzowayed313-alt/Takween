
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CheckSquare, BarChart3, Clock, LogOut, Menu, X, Bell, Plus, Lock, Briefcase, Zap, History, Settings, Building2, CalendarDays, Share2, Check, ShieldCheck, Sparkles, ChevronLeft, Trash2, Mail, Info, AlertTriangle
} from 'lucide-react';
import { DEPARTMENTS, MOCK_EMPLOYEES, MOCK_TASKS, MOCK_PROJECTS, MOCK_SPRINTS, INITIAL_KPI_RULES } from './constants';
import { TaskStatus, Task, Employee, Role, Project, Sprint, KpiRule, LeaveRequest } from './types';
import { notificationService, Notification as NotificationType } from './services/notificationService';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import EmployeeDirectory from './components/EmployeeDirectory';
import KPIAnalytics from './components/KPIAnalytics';
import AttendanceSystem from './components/AttendanceSystem';
import ProjectsList from './components/ProjectsList';
import SprintManager from './components/SprintManager';
import SettingsPage from './components/SettingsPage';
import ArchivePage from './components/ArchivePage';
import TaskModal from './components/modals/TaskModal';
import TaskDetailModal from './components/modals/TaskDetailModal';
import EmployeeDetailModal from './components/modals/EmployeeDetailModal';
import PermissionModal from './components/modals/PermissionModal';
import LeaveRequests from './components/LeaveRequests';
import Login from './components/Login';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING';
}

const ToastManager = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) => (
  <div className="fixed bottom-8 right-8 z-[500] flex flex-col gap-3 pointer-events-none">
    {toasts.map(toast => (
      <div 
        key={toast.id} 
        className={`pointer-events-auto w-80 p-5 rounded-[1.8rem] shadow-2xl border flex items-start gap-4 animate-in slide-in-from-bottom-5 duration-500 bg-white dark:bg-slate-900 ${
          toast.type === 'SUCCESS' ? 'border-emerald-100 dark:border-emerald-900/50' : 
          toast.type === 'WARNING' ? 'border-rose-100 dark:border-rose-900/50' : 
          'border-blue-100 dark:border-blue-900/50'
        }`}
      >
        <div className={`p-2.5 rounded-xl shrink-0 ${
          toast.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 
          toast.type === 'WARNING' ? 'bg-rose-50 text-rose-600' : 
          'bg-blue-50 text-blue-600'
        }`}>
          {toast.type === 'SUCCESS' ? <Check size={18} /> : toast.type === 'WARNING' ? <AlertTriangle size={18} /> : <Info size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-black text-slate-800 dark:text-white mb-1">{toast.title}</h5>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{toast.message}</p>
        </div>
        <button onClick={() => removeToast(toast.id)} className="text-slate-300 hover:text-slate-500 transition-colors p-1"><X size={14}/></button>
      </div>
    ))}
  </div>
);

// Added AppLayout component to fix the "Cannot find name 'AppLayout'" errors
interface AppLayoutProps {
  children: React.ReactNode;
  openTaskModal: () => void;
  currentUser: Employee;
  onLogout: () => void;
  isDarkMode: boolean;
  onAccessDeny: () => void;
  notifications: NotificationType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, openTaskModal, currentUser, onLogout, isDarkMode, 
  onAccessDeny, notifications, setNotifications 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'الرئيسية' },
    { path: '/projects', icon: Briefcase, label: 'المشاريع' },
    { path: '/tasks', icon: CheckSquare, label: 'المهام' },
    { path: '/sprints', icon: Zap, label: 'السبرنتات' },
    { path: '/employees', icon: Users, label: 'الموظفين' },
    { path: '/attendance', icon: Clock, label: 'الحضور' },
    { path: '/leaves', icon: CalendarDays, label: 'الإجازات' },
    { path: '/analytics', icon: BarChart3, label: 'التحليلات' },
    { path: '/archive', icon: History, label: 'الأرشيف' },
    { path: '/settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} font-sans`} dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 transition-all duration-300 transform bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight dark:text-white">تكوين <span className="text-blue-600">للهندسة</span></h1>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black transition-all ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={onLogout}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all mt-auto"
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'mr-72' : 'mr-0'}`}>
        {/* Header */}
        <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500">
              <Menu size={20} />
            </button>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
            <button onClick={openTaskModal} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl shadow-blue-500/20 hover:scale-105 transition-all active:scale-95">
              <Plus size={18} />
              مهمة جديدة
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 relative">
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>
              {/* Notification Dropdown */}
              <div className="absolute left-0 top-full mt-4 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all z-[100]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">التنبيهات الأخيرة</h4>
                  <button onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} className="text-[10px] font-bold text-blue-600 hover:underline">تحديد كقروء</button>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors border-r-2 border-blue-500">
                      <p className="text-xs font-black text-slate-800 dark:text-white mb-0.5">{n.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{n.message}</p>
                    </div>
                  )) : (
                    <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase">لا توجد تنبيهات</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 pl-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <img src={currentUser.avatar} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800" alt="" />
              <div>
                <p className="text-sm font-black text-slate-800 dark:text-white">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);

  // نظام استقبال الأحداث الحية (Real-time Listener)
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((data) => {
      const { event, payload } = data;
      
      // لا تعرض تنبيهات لأحداث قمت أنت بها (اختياري، هنا سنعرضها للتوضيح)
      let title = "تحديث في النظام";
      let message = "حدث تغيير جديد يتطلب انتباهك.";
      let type: 'SUCCESS' | 'INFO' | 'WARNING' = 'INFO';

      switch(event) {
        case 'TASK_ASSIGNED':
          title = "مهمة هندسية جديدة";
          message = `تم إسناد مهمة "${payload.task.title}" للمهندس ${payload.employee.name}`;
          type = 'SUCCESS';
          break;
        case 'TASK_STATUS_UPDATED':
          title = "تحديث حالة مهمة";
          message = `تم تغيير حالة "${payload.taskTitle}" إلى: ${payload.newStatus}`;
          type = 'INFO';
          break;
        case 'LEAVE_STATUS_CHANGED':
          title = "قرار إداري (إجازة)";
          message = `تم ${payload.request.status === 'APPROVED' ? 'قبول' : 'رفض'} طلب إجازة م. ${payload.employee.name}`;
          type = payload.request.status === 'APPROVED' ? 'SUCCESS' : 'WARNING';
          break;
      }

      addToast(title, message, type);
      addNotification(title, message, type === 'SUCCESS' ? 'SUCCESS' : type === 'WARNING' ? 'WARNING' : 'INFO');
    });

    return () => unsubscribe();
  }, []);

  const addToast = (title: string, message: string, type: 'SUCCESS' | 'INFO' | 'WARNING' = 'INFO') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' = 'INFO') => {
    const newNotif: NotificationType = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleString('ar-SA'),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...data } : emp));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: 'PENDING' } : emp));
    setSelectedEmployee(null);
  };

  const handleAddTask = async (task: Task) => {
    setTasks(prev => [task, ...prev]);
    const assignee = employees.find(e => e.id === task.assignedTo);
    if (assignee) {
      await notificationService.notifyTaskAssignment(assignee, task);
    }
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks(prev => prev.map(t => {
      if (t.id === updated.id) {
        if (t.status !== updated.status) {
           notificationService.broadcast('TASK_STATUS_UPDATED', { 
             taskId: updated.id, 
             taskTitle: updated.title, 
             newStatus: updated.status 
           });
        }
        return updated;
      }
      return t;
    }));
  };

  if (!currentUser) return (
    <Login 
      onLogin={setCurrentUser} 
      employees={employees} 
      onRegister={(name, email, password) => {
        const newEmp: Employee = {
          id: `emp-reg-${Date.now()}`,
          name, email, password, role: Role.EMPLOYEE, departmentId: 'arch',
          avatar: `https://i.pravatar.cc/150?u=${name}`, kpi: 0, joinedDate: new Date().toISOString().split('T')[0], status: 'PENDING'
        };
        setEmployees(prev => [...prev, newEmp]);
        return newEmp;
      }} 
    />
  );

  return (
    <HashRouter>
      <AppLayout 
        openTaskModal={() => setTaskModalOpen(true)} 
        currentUser={currentUser} 
        onLogout={() => setCurrentUser(null)} 
        isDarkMode={isDarkMode} 
        onAccessDeny={() => setPermissionModalOpen(true)}
        notifications={notifications}
        setNotifications={setNotifications}
      >
        <Routes>
          <Route path="/" element={<Dashboard tasks={tasks} employees={employees} onTaskClick={setSelectedTask} />} />
          <Route path="/projects" element={<ProjectsList projects={MOCK_PROJECTS} tasks={tasks} employees={employees} setProjects={() => {}} setTasks={setTasks} currentUser={currentUser} onAccessDeny={() => setPermissionModalOpen(true)} />} />
          <Route path="/tasks" element={<KanbanBoard tasks={tasks} setTasks={setTasks} onTaskClick={setSelectedTask} currentUser={currentUser} employees={employees} />} />
          <Route path="/sprints" element={<SprintManager projects={MOCK_PROJECTS} sprints={MOCK_SPRINTS} setSprints={() => {}} currentUser={currentUser} />} />
          <Route path="/employees" element={<EmployeeDirectory employees={employees.filter(e => e.status === 'ACTIVE')} pendingEmployees={employees.filter(e => e.status === 'PENDING')} currentUser={currentUser} onEmployeeClick={setSelectedEmployee} onApprove={(id, role, dept) => handleUpdateEmployee(id, {role, departmentId: dept, status: 'ACTIVE'})} onAccessDeny={() => setPermissionModalOpen(true)} />} />
          <Route path="/attendance" element={<AttendanceSystem currentUser={currentUser} employees={employees} />} />
          <Route path="/leaves" element={<LeaveRequests currentUser={currentUser} employees={employees} requests={leaveRequests} setRequests={setLeaveRequests} onAddRequest={(req) => setLeaveRequests([req, ...leaveRequests])} onNotify={(t, m) => addNotification(t, m, 'SUCCESS')} />} />
          <Route path="/analytics" element={<KPIAnalytics employees={employees} tasks={tasks} />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/settings" element={<SettingsPage currentUser={currentUser} onUpdateUser={(d) => setCurrentUser({...currentUser, ...d})} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} kpiRules={INITIAL_KPI_RULES} setKpiRules={() => {}} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>

      <ToastManager toasts={toasts} removeToast={removeToast} />
      
      <PermissionModal isOpen={isPermissionModalOpen} onClose={() => setPermissionModalOpen(false)} />
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} onAdd={handleAddTask} employees={employees} projects={MOCK_PROJECTS} kpiRules={INITIAL_KPI_RULES} />
      <TaskDetailModal isOpen={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={handleUpdateTask} onDelete={(id) => setTasks(prev => prev.filter(t => t.id !== id))} employees={employees} projects={MOCK_PROJECTS} currentUser={currentUser} />
      <EmployeeDetailModal isOpen={!!selectedEmployee} employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} tasks={tasks} currentUser={currentUser} onUpdateEmployee={handleUpdateEmployee} onDeleteEmployee={handleDeleteEmployee} />
    </HashRouter>
  );
};
export default App;
