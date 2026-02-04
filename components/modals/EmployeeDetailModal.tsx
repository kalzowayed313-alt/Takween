
import React, { useState } from 'react';
import { X, Mail, Calendar, Target, Clock, CheckCircle2, AlertCircle, BrainCircuit, Sparkles, TrendingUp, ShieldAlert, Archive, UserCog, Save, History, Lock } from 'lucide-react';
import { Employee, Task, TaskStatus, Role } from '../../types';
import { DEPARTMENTS } from '../../constants';
import { analyzePerformance } from '../../services/geminiService';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  tasks: Task[];
  currentUser: Employee;
  onUpdateEmployee: (id: string, data: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ 
  isOpen, employee, onClose, tasks, currentUser, onUpdateEmployee, onDeleteEmployee 
}) => {
  if (!isOpen || !employee) return null;

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(employee.role);
  
  const empTasks = tasks.filter(t => t.assignedTo === employee.id);
  const dept = DEPARTMENTS.find(d => d.id === employee.departmentId);

  const isAdmin = currentUser.role === Role.ADMIN || currentUser.role === Role.DEPT_MANAGER;
  const isSelf = currentUser.id === employee.id;
  
  // التحقق مما إذا كان الموظف حالي أم مؤرشف بناءً على وجوده في قائمة المهام أو دورته
  // في التطبيق الواقعي نفضل استخدام حقل isArchived في الـ type
  const isArchived = !isAdmin && !isSelf && empTasks.length > 0 && !tasks.some(t => t.assignedTo === employee.id && t.status !== TaskStatus.COMPLETED);

  const handleGetAiReport = async () => {
    setIsLoadingAi(true);
    const report = await analyzePerformance(employee, empTasks);
    setAiReport(report);
    setIsLoadingAi(false);
  };

  const handleSaveRole = () => {
    onUpdateEmployee(employee.id, { role: selectedRole });
    setIsEditRoleOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in fade-in duration-300">
        
        {/* Header Profile */}
        <div className={`relative h-48 bg-gradient-to-r ${isArchived ? 'from-slate-600 to-slate-800' : 'from-blue-600 to-indigo-700'}`}>
          <button 
            onClick={onClose} 
            className="absolute top-6 left-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors z-20"
          >
            <X size={20} />
          </button>
          
          <div className="absolute -bottom-12 right-10 flex items-end gap-6">
            <div className="relative">
              <img src={employee.avatar} className={`w-32 h-32 rounded-3xl object-cover border-8 border-white dark:border-slate-800 shadow-xl ${isArchived ? 'grayscale' : ''}`} alt="" />
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 border-4 border-white dark:border-slate-800 rounded-full ${isArchived ? 'bg-slate-400' : 'bg-emerald-500'}`}></div>
            </div>
            <div className="pb-4">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white">{employee.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${isArchived ? 'bg-slate-100 text-slate-500' : 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'}`}>
                  {isArchived ? 'شريك سابق (مؤرشف)' : employee.role}
                </span>
                <span className="text-sm font-bold text-slate-400">{dept?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Right Column: Stats & Management */}
            <div className="space-y-8">
              {/* Management Tools (Admin Only & Not Self) */}
              {isAdmin && !isSelf && !isArchived && (
                <div className="bg-rose-50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30">
                  <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldAlert size={14} /> إدارة شؤون الموظف
                  </h3>
                  
                  <div className="space-y-3">
                    {!isEditRoleOpen ? (
                      <button 
                        onClick={() => setIsEditRoleOpen(true)}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-2"><UserCog size={16} className="text-blue-500" /> تعديل الدور الوظيفي</div>
                        <ChevronLeft size={14} className="opacity-30" />
                      </button>
                    ) : (
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-3 animate-in fade-in duration-200">
                        <select 
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as Role)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                        >
                          {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <div className="flex gap-2">
                          <button onClick={handleSaveRole} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-[10px] font-black flex items-center justify-center gap-1"><Save size={12} /> حفظ</button>
                          <button onClick={() => setIsEditRoleOpen(false)} className="px-3 bg-slate-100 dark:bg-slate-700 text-slate-500 py-2 rounded-lg text-[10px] font-black">إلغاء</button>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => onDeleteEmployee(employee.id)}
                      className="w-full flex items-center gap-2 p-4 bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-lg hover:bg-black transition-all active:scale-95"
                    >
                      <Archive size={16} /> أرشفة الموظف وإبطال حسابه
                    </button>
                  </div>
                </div>
              )}

              {isArchived && (
                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex items-center gap-4 text-amber-700 dark:text-amber-400">
                    <History size={24} />
                    <p className="text-xs font-bold leading-relaxed">هذا الملف مؤرشف. يتم الاحتفاظ به كجزء من تاريخ إنجازات الشركة.</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-4 text-rose-700 dark:text-rose-400">
                    <Lock size={24} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-1">حساب معطل</p>
                      <p className="text-[10px] font-bold opacity-80">لا يملك هذا الشخص صلاحية الوصول للنظام حالياً.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">مؤشرات الأداء التاريخية</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl"><Target size={18} /></div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">معدل KPI</span>
                    </div>
                    <span className="text-lg font-black text-emerald-600">{employee.kpi}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><CheckCircle2 size={18} /></div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">إجمالي الإنجازات</span>
                    </div>
                    <span className="text-lg font-black text-blue-600">{empTasks.filter(t => t.status === TaskStatus.COMPLETED).length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">معلومات التواصل</h3>
                <a href={`mailto:${employee.email}`} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 transition-all">
                  <Mail size={16} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{employee.email}</span>
                </a>
              </div>
            </div>

            {/* Left Column: Tasks & Timeline */}
            <div className="lg:col-span-2 space-y-10">
              
              {!isArchived && aiReport && (
                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-8 rounded-[2rem] animate-in slide-in-from-top duration-500">
                  <div className="flex items-center gap-3 mb-4 text-indigo-700 dark:text-indigo-400">
                    <Sparkles size={24} />
                    <h3 className="text-lg font-bold">تحليل Gemini التاريخي</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-indigo-900/80 dark:text-indigo-200/80 font-medium whitespace-pre-wrap">{aiReport}</p>
                  <button onClick={() => setAiReport(null)} className="mt-4 text-xs font-bold text-indigo-600 hover:underline">إخفاء التقرير</button>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white">أرشيف المهام والنتائج</h3>
                   <span className="text-xs font-bold text-slate-400">إجمالي {empTasks.length} سجلات</span>
                </div>
                <div className="space-y-4">
                  {empTasks.length > 0 ? empTasks.slice(0, 8).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full ${
                          task.status === TaskStatus.COMPLETED ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{task.title}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{task.dueDate} • نقاط KPI: {task.kpiPoints}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        task.status === TaskStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  )) : (
                    <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                      <AlertCircle size={32} className="mx-auto text-slate-200 dark:text-slate-700 mb-2" />
                      <p className="text-xs text-slate-400 font-bold">لا توجد سجلات تاريخية متاحة حالياً</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 dark:bg-black rounded-[2rem] p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">إحصائيات الإرث المهني</h3>
                  <TrendingUp size={20} className="text-emerald-400" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                   <div className="text-center">
                     <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">نسبة الالتزام</p>
                     <p className="text-2xl font-black">98%</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">الجودة الفنية</p>
                     <p className="text-2xl font-black text-emerald-400">عالية</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">سنوات الخدمة</p>
                     <p className="text-2xl font-black">2+</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronLeft = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export default EmployeeDetailModal;
