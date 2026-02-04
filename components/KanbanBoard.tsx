
import React, { useState, useMemo } from 'react';
import { 
  MoreVertical, Paperclip, MessageSquare, AlertCircle, Filter, FileCode, Image, Video, FileText
} from 'lucide-react';
import { TaskStatus, TaskPriority, Task, Employee, Role } from '../types';
import { DEPARTMENTS } from '../constants';

interface KanbanBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskClick: (task: Task) => void;
  currentUser: Employee;
  employees: Employee[];
}

const STATUS_LABELS: Record<TaskStatus, { color: string, label: string }> = {
  [TaskStatus.NEW]: { color: 'bg-slate-200 text-slate-700', label: 'جديد' },
  [TaskStatus.IN_PROGRESS]: { color: 'bg-blue-100 text-blue-700', label: 'قيد التنفيذ' },
  [TaskStatus.REVIEW]: { color: 'bg-purple-100 text-purple-700', label: 'قيد المراجعة' },
  [TaskStatus.PENDING]: { color: 'bg-amber-100 text-amber-700', label: 'معلق' },
  [TaskStatus.COMPLETED]: { color: 'bg-emerald-100 text-emerald-700', label: 'مكتمل' }
};

const PRIORITY_BADGES: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'bg-rose-100 text-rose-600',
  [TaskPriority.MEDIUM]: 'bg-amber-100 text-amber-600',
  [TaskPriority.LOW]: 'bg-emerald-100 text-emerald-600'
};

const TaskCard: React.FC<{ task: Task, employees: Employee[], onClick: () => void }> = ({ task, employees, onClick }) => {
  const assignee = employees.find(e => e.id === task.assignedTo);
  const dept = DEPARTMENTS.find(d => d.id === task.departmentId);

  const hasEngineeringFiles = task.attachments.some(a => ['autocad', '3dmax'].includes(a.type));

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all mb-3 group border-r-4 cursor-pointer active:scale-[0.98]" 
      style={{ borderRightColor: dept?.color }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${PRIORITY_BADGES[task.priority]}`}>
            {task.priority}
          </span>
          {hasEngineeringFiles && (
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-bold text-blue-600">CAD/3D</span>
            </div>
          )}
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>
      
      <h4 className="font-bold text-slate-800 text-sm mb-1 leading-relaxed group-hover:text-blue-600 transition-colors">{task.title}</h4>
      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
      
      {task.attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.attachments.slice(0, 4).map(att => (
            <div key={att.id} title={att.name} className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-400">
              {att.type === 'autocad' && <FileCode size={12} className="text-orange-500" />}
              {att.type === 'image' && <Image size={12} className="text-emerald-500" />}
              {att.type === 'video' && <Video size={12} className="text-rose-500" />}
              {att.type === 'pdf' && <FileText size={12} className="text-red-500" />}
              {att.type === '3dmax' && <BoxIcon size={12} className="text-blue-500" />}
            </div>
          ))}
          {task.attachments.length > 4 && (
            <div className="text-[10px] font-bold text-slate-400 p-1.5">+{task.attachments.length - 4}</div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
           <img src={assignee?.avatar} alt="" className="w-6 h-6 rounded-full border border-slate-100 object-cover" />
           <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">{assignee?.name}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <div className="flex items-center gap-1">
             <MessageSquare size={12} />
             <span className="text-[10px] font-bold">{task.comments?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
             <Paperclip size={12} />
             <span className="text-[10px] font-bold">{task.attachments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BoxIcon = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.29 7 12 12 20.71 7"></polyline>
    <line x1="12" y1="22" x2="12" y2="12"></line>
  </svg>
);

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskClick, currentUser, employees }) => {
  // الافتراضي هو عرض مهام القسم للموظف، والكل للمدير العام
  const [showDepartmentTasks, setShowDepartmentTasks] = useState(true);
  const isGeneralAdmin = currentUser.role === Role.ADMIN;

  // منطق الفلترة المتقدم:
  // 1. إذا كان المستخدم ADMIN، يمكنه رؤية كل مهام الشركة.
  // 2. إذا لم يكن ADMIN، يتم حصر المهام في قسمه فقط (Department Pool).
  // 3. التبديل بين "مهام القسم/الشركة" و "مهامي الشخصية".
  const filteredTasks = useMemo(() => {
    // تحديد النطاق الأساسي: كل الشركة للـ Admin، وقسم محدد لغيره
    const basePool = isGeneralAdmin 
      ? tasks 
      : tasks.filter(t => t.departmentId === currentUser.departmentId);

    if (showDepartmentTasks) {
      return basePool;
    } else {
      // عرض المهام المسندة للمستخدم الحالي فقط من ضمن النطاق المتاح له
      return basePool.filter(t => t.assignedTo === currentUser.id);
    }
  }, [tasks, showDepartmentTasks, currentUser, isGeneralAdmin]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة المهام</h2>
          <p className="text-slate-500">
            {isGeneralAdmin 
              ? (showDepartmentTasks ? 'أنت تشاهد مهام الشركة بالكامل (صلاحية مدير عام)' : 'أنت تشاهد مهامك الشخصية فقط')
              : (showDepartmentTasks ? `أنت تشاهد جميع مهام ${DEPARTMENTS.find(d => d.id === currentUser.departmentId)?.name || 'قسمك'}` : 'أنت تشاهد مهامك الشخصية فقط')
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setShowDepartmentTasks(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${showDepartmentTasks ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {isGeneralAdmin ? 'مهام الشركة' : 'مهام القسم'}
            </button>
            <button 
              onClick={() => setShowDepartmentTasks(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!showDepartmentTasks ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              مهامي
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 font-bold text-sm shadow-sm transition-all active:scale-95">
            <Filter size={18} /> تصفية
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-[650px] items-start">
        {Object.values(TaskStatus).map((status) => (
          <div key={status} className="flex-shrink-0 w-80 bg-slate-100/40 rounded-3xl p-4 border border-slate-200/50">
            <div className="flex items-center justify-between mb-5 px-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${STATUS_LABELS[status].color} border border-black/5`}>
                  {STATUS_LABELS[status].label}
                </span>
                <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {filteredTasks.filter(t => t.status === status).length}
                </span>
              </div>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar px-1">
              {filteredTasks.filter(t => t.status === status).map(task => (
                <TaskCard key={task.id} task={task} employees={employees} onClick={() => onTaskClick(task)} />
              ))}
              {filteredTasks.filter(t => t.status === status).length === 0 && (
                <div className="py-16 text-center text-slate-300 border-2 border-dashed border-slate-200/60 rounded-2xl bg-slate-50/50">
                  <AlertCircle size={24} className="mx-auto mb-3 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">لا توجد مهام حالياً</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
