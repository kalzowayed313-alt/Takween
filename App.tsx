
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CheckSquare, BarChart3, Clock, LogOut, Menu, X, Bell, Plus, Lock, Briefcase, Zap, History, Settings, CheckCircle2, Building2, Archive, CalendarDays, ExternalLink, Trash2
} from 'lucide-react';
import { DEPARTMENTS, MOCK_EMPLOYEES, MOCK_TASKS, MOCK_PROJECTS, MOCK_SPRINTS, INITIAL_KPI_RULES } from './constants';
import { TaskStatus, Task, Employee, Role, Project, Sprint, LeaveRequest, KpiRule } from './types';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import EmployeeDirectory from './components/EmployeeDirectory';
import KPIAnalytics from './components/KPIAnalytics';
import AttendanceSystem from './components/AttendanceSystem';
import ProjectsList from './components/ProjectsList';
import SprintManager from './components/SprintManager';
import LeaveRequests from './components/LeaveRequests';
import ActivityLog from './components/ActivityLog';
import SettingsPage from './components/SettingsPage';
import DepartmentsOverview from './components/DepartmentsOverview';
import ArchivePage from './components/ArchivePage';
import TaskModal from './components/modals/TaskModal';
import TaskDetailModal from './components/modals/TaskDetailModal';
import EmployeeModal from './components/modals/EmployeeModal';
import EmployeeDetailModal from './components/modals/EmployeeDetailModal';
import CelebrationModal from './components/modals/CelebrationModal';
import PermissionModal from './components/modals/PermissionModal';
import Login from './components/Login';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'task' | 'project' | 'leave' | 'system';
}

const TakweenLogo = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="flex items-center gap-3 py-1 overflow-hidden">
    <div className="shrink-0">
      <svg width="42" height="42" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5L20 35V115H35V75H45V115H65V100H80V115H95V55L80 40V30L50 5Z" fill="#0055A5" />
        <path d="M50 5L80 30V40L95 55V115H80V100H65V115H45V75H35V115H20V35L50 5Z" stroke={isDarkMode ? "#1e293b" : "white"} strokeWidth="2" />
        <rect x="65" y="65" width="20" height="8" fill="white" />
        <rect x="65" y="80" width="20" height="8" fill="white" />
        <rect x="65" y="50" width="20" height="8" fill="white" />
      </svg>
    </div>
    <div className="flex flex-col leading-tight">
      <span className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>تـكـويـن</span>
      <div className="flex flex-col -mt-1">
        <span className={`text-[10px] font-black tracking-widest ${isDarkMode ? 'text-blue-400' : 'text-[#0055A5]'}`}>TAKWEEN</span>
        <span className={`text-[8px] font-bold opacity-70 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>ENGINEERING للهندسة</span>
      </div>
    </div>
  </div>
);

const SidebarLink = ({ to, icon: Icon, label, active, restricted, userRole, onDeny }: { 
  to: string, icon: any, label: string, active: boolean, restricted?: Role[], userRole: Role, onDeny: () => void 
}) => {
  const isRestricted = restricted && restricted.includes(userRole);

  const handleClick = (e: React.MouseEvent) => {
    if (isRestricted) {
      e.preventDefault();
      onDeny();
    }
  };

  return (
    <Link 
      to={isRestricted ? '#' : to} 
      onClick={handleClick}
      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group relative ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : isRestricted
            ? 'text-slate-400 dark:text-slate-600 cursor-pointer'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={isRestricted ? 'opacity-50' : ''} /> 
        <span className={`font-medium text-sm ${isRestricted ? 'opacity-50' : ''}`}>{label}</span>
      </div>
      {isRestricted && (
        <Lock size={12} className="text-slate-300 dark:text-slate-700 group-hover:text-rose-500 transition-colors" />
      )}
    </Link>
  );
};

const AppLayout: React.FC<{ 
  children: React.ReactNode, 
  openTaskModal: () => void, 
  currentUser: Employee, 
  onLogout: () => void,
  notifications: Notification[],
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  isDarkMode: boolean,
  onAccessDeny: () => void
}> = ({ children, openTaskModal, currentUser, onLogout, notifications, setNotifications, isDarkMode, onAccessDeny }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);
  const autoCloseTimer = useRef<NodeJS.Timeout | null>(null);
  
  const startAutoCloseTimer = () => {
    stopAutoCloseTimer();
    autoCloseTimer.current = setTimeout(() => {
      setSidebarOpen(false);
    }, 6000);
  };

  const stopAutoCloseTimer = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
  };

  useEffect(() => {
    if (isSidebarOpen) startAutoCloseTimer();
    else stopAutoCloseTimer();
    return () => stopAutoCloseTimer();
  }, [isSidebarOpen, location.pathname]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const canCreate = currentUser.role === Role.ADMIN || currentUser.role === Role.DEPT_MANAGER;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <aside 
        onMouseEnter={stopAutoCloseTimer}
        onMouseLeave={startAutoCloseTimer}
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto custom-scrollbar shadow-2xl lg:shadow-xl`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
            <Link to="/" className="flex items-center transition-transform hover:scale-[1.03] active:scale-95 duration-200">
              <TakweenLogo isDarkMode={isDarkMode} />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"><X size={20} /></button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 px-4 mb-2 uppercase tracking-widest">الرئيسية</p>
            <SidebarLink to="/" icon={LayoutDashboard} label="لوحة التحكم" active={location.pathname === '/'} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/projects" icon={Briefcase} label="المشاريع الهندسية" active={location.pathname === '/projects'} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/tasks" icon={CheckSquare} label="إدارة المهام" active={location.pathname === '/tasks'} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/sprints" icon={Zap} label="إدارة السبرنتات" active={location.pathname === '/sprints'} userRole={currentUser.role} onDeny={onAccessDeny} />
            
            <p className="text-[10px] font-bold text-slate-400 px-4 mt-6 mb-2 uppercase tracking-widest">الموارد البشرية</p>
            <SidebarLink to="/employees" icon={Users} label="دليل الموظفين" active={location.pathname === '/employees'} restricted={[Role.EMPLOYEE]} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/departments" icon={Building2} label="أقسام الشركة" active={location.pathname === '/departments'} restricted={[Role.EMPLOYEE, Role.TEAM_LEADER]} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/attendance" icon={Clock} label="الحضور والانصراف" active={location.pathname === '/attendance'} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/leaves" icon={Clock} label="طلبات الإجازات" active={location.pathname === '/leaves'} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/analytics" icon={BarChart3} label="تحليلات KPI" active={location.pathname === '/analytics'} restricted={[Role.EMPLOYEE]} userRole={currentUser.role} onDeny={onAccessDeny} />
            
            <p className="text-[10px] font-bold text-slate-400 px-4 mt-6 mb-2 uppercase tracking-widest">النظام</p>
            <SidebarLink to="/activity" icon={History} label="سجل النشاطات" active={location.pathname === '/activity'} restricted={[Role.EMPLOYEE, Role.TEAM_LEADER]} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/archive" icon={CalendarDays} label="الأرشيف الشهري" active={location.pathname === '/archive'} restricted={[Role.EMPLOYEE, Role.TEAM_LEADER, Role.DEPT_MANAGER]} userRole={currentUser.role} onDeny={onAccessDeny} />
            <SidebarLink to="/settings" icon={Settings} label="الإعدادات" active={location.pathname === '/settings'} userRole={currentUser.role} onDeny={onAccessDeny} />
          </nav>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3 p-2 rounded-xl mb-4">
              <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-slate-800 dark:text-white">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-blue-600">{currentUser.role}</p>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors">
              <LogOut size={16} /> تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>
      
      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'lg:mr-64' : 'mr-0'}`}>
        <header className="sticky top-0 z-40 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className={`p-2 rounded-xl transition-all ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center gap-3 relative" ref={notifRef}>
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 rounded-full transition-all ${isNotifOpen ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 text-[8px] font-bold text-white flex items-center justify-center">{unreadCount}</span>}
              </button>
              {isNotifOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300 z-[60] overflow-hidden">
                   <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">التنبيهات</h4>
                      {unreadCount > 0 && <button onClick={markAllAsRead} className="text-[10px] font-bold text-blue-600 hover:underline">تحديد كقروء</button>}
                   </div>
                   <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-50 dark:border-slate-800 flex gap-3 group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!n.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                             <div className={`p-2 rounded-xl h-fit ${n.type === 'task' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                <Bell size={16} />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{n.title}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                             </div>
                             <button onClick={() => deleteNotification(n.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center text-slate-400 text-xs">لا توجد تنبيهات جديدة</div>
                      )}
                   </div>
                </div>
              )}
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
            {canCreate && (
              <button onClick={openTaskModal} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95">
                <Plus size={18} /> <span className="text-sm font-bold hidden sm:inline">إسناد مهمة</span>
              </button>
            )}
          </div>
        </header>
        <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('takween_tasks') || JSON.stringify(MOCK_TASKS)));
  const [employees, setEmployees] = useState<Employee[]>(() => JSON.parse(localStorage.getItem('takween_employees') || JSON.stringify(MOCK_EMPLOYEES)));
  const [projects, setProjects] = useState<Project[]>(() => JSON.parse(localStorage.getItem('takween_projects') || JSON.stringify(MOCK_PROJECTS)));
  const [sprints, setSprints] = useState<Sprint[]>(() => JSON.parse(localStorage.getItem('takween_sprints') || JSON.stringify(MOCK_SPRINTS)));
  const [kpiRules, setKpiRules] = useState<KpiRule[]>(() => JSON.parse(localStorage.getItem('takween_kpi_rules') || JSON.stringify(INITIAL_KPI_RULES)));
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => JSON.parse(localStorage.getItem('takween_current_user') || 'null'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('takween_theme') === 'dark');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);

  useEffect(() => localStorage.setItem('takween_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('takween_employees', JSON.stringify(employees)), [employees]);
  useEffect(() => localStorage.setItem('takween_current_user', JSON.stringify(currentUser)), [currentUser]);

  const handleRegisterRequest = (name: string, email: string) => {
    const newUser: Employee = {
      id: `emp-pending-${Date.now()}`,
      name,
      email,
      role: Role.EMPLOYEE,
      departmentId: 'arch',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      kpi: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    setEmployees(prev => [newUser, ...prev]);
    return newUser;
  };

  const approveEmployee = (id: string, role: Role, departmentId: string) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: 'ACTIVE', role, departmentId } : emp));
  };

  if (!currentUser) return <Login onLogin={setCurrentUser} employees={employees} onRegister={handleRegisterRequest} />;

  return (
    <HashRouter>
      <div className={isDarkMode ? 'dark' : ''}>
        <AppLayout 
          openTaskModal={() => setTaskModalOpen(true)} 
          currentUser={currentUser} 
          onLogout={() => setCurrentUser(null)}
          notifications={notifications}
          setNotifications={setNotifications}
          isDarkMode={isDarkMode}
          onAccessDeny={() => setPermissionModalOpen(true)}
        >
          <Routes>
            <Route path="/" element={<Dashboard tasks={tasks} employees={employees.filter(e => e.status === 'ACTIVE')} onTaskClick={setSelectedTask} />} />
            <Route path="/projects" element={<ProjectsList projects={projects} tasks={tasks} employees={employees.filter(e => e.status === 'ACTIVE')} setProjects={setProjects} setTasks={setTasks} currentUser={currentUser} onAccessDeny={() => setPermissionModalOpen(true)} />} />
            <Route path="/tasks" element={<KanbanBoard tasks={tasks} setTasks={setTasks} onTaskClick={setSelectedTask} currentUser={currentUser} employees={employees.filter(e => e.status === 'ACTIVE')} />} />
            <Route path="/sprints" element={<SprintManager projects={projects} sprints={sprints} setSprints={setSprints} currentUser={currentUser} />} />
            <Route path="/employees" element={<EmployeeDirectory employees={employees.filter(e => e.status === 'ACTIVE')} pendingEmployees={employees.filter(e => e.status === 'PENDING')} currentUser={currentUser} onEmployeeClick={setSelectedEmployee} onApprove={approveEmployee} onAccessDeny={() => setPermissionModalOpen(true)} />} />
            <Route path="/departments" element={<DepartmentsOverview employees={employees.filter(e => e.status === 'ACTIVE')} tasks={tasks} />} />
            <Route path="/attendance" element={<AttendanceSystem currentUser={currentUser} employees={employees.filter(e => e.status === 'ACTIVE')} />} />
            <Route path="/analytics" element={<KPIAnalytics employees={employees.filter(e => e.status === 'ACTIVE')} tasks={tasks} />} />
            <Route path="/activity" element={<ActivityLog employees={employees.filter(e => e.status === 'ACTIVE')} tasks={tasks} onUserClick={setSelectedEmployee} onTaskClick={setSelectedTask} />} />
            <Route path="/settings" element={<SettingsPage currentUser={currentUser} onUpdateUser={(d) => setCurrentUser({...currentUser, ...d})} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} kpiRules={kpiRules} setKpiRules={setKpiRules} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </div>
      <PermissionModal isOpen={isPermissionModalOpen} onClose={() => setPermissionModalOpen(false)} />
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} onAdd={(t) => setTasks([t, ...tasks])} employees={employees.filter(e => e.status === 'ACTIVE')} projects={projects} kpiRules={kpiRules} />
      <EmployeeDetailModal isOpen={!!selectedEmployee} employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} tasks={tasks} currentUser={currentUser} onUpdateEmployee={() => {}} onDeleteEmployee={() => {}} />
    </HashRouter>
  );
};
export default App;
