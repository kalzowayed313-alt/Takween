
import React, { useState, useMemo } from 'react';
import { Project, Task, Employee, TaskStatus, Role, TaskPriority } from '../types';
import { Briefcase, Calendar, DollarSign, ArrowRight, CheckCircle, X, User, Building2, Plus, Save, Trash2, ListTodo, Lock } from 'lucide-react';
import { DEPARTMENTS } from '../constants';

const Shield = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

interface ProjectsListProps {
  projects: Project[];
  tasks: Task[];
  employees: Employee[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentUser: Employee;
  onAccessDeny: () => void;
}

const ProjectCard: React.FC<{ 
  project: Project, 
  projectTasks: Task[], 
  projectEmployees: Employee[],
  isLocked: boolean,
  onViewDetails: (proj: Project) => void,
  onAccessDeny: () => void
}> = ({ project, projectTasks, projectEmployees, isLocked, onViewDetails, onAccessDeny }) => {
  const progressPercent = useMemo(() => {
    const totalWeight = projectTasks.reduce((acc, t) => acc + (t.weight || 0), 0);
    if (totalWeight === 0) return 0;
    const completedWeight = projectTasks
      .filter(t => t.status === TaskStatus.COMPLETED)
      .reduce((acc, t) => acc + (t.weight || 0), 0);
    return Math.round((completedWeight / totalWeight) * 100);
  }, [projectTasks]);
  
  const dept = DEPARTMENTS.find(d => d.id === project.departmentId);

  const handleAction = () => {
    if (isLocked) {
      onAccessDeny();
    } else {
      onViewDetails(project);
    }
  };

  return (
    <div 
      onClick={handleAction}
      className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all group flex flex-col h-full relative overflow-hidden cursor-pointer ${isLocked ? 'hover:border-rose-200 dark:hover:border-rose-900/30' : 'hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-900/30'}`}
    >
      {isLocked && (
        <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-slate-50/10 dark:bg-slate-900/10 flex flex-col items-center justify-center p-6 text-center">
           <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-[2rem] shadow-xl border border-white/20 animate-in zoom-in duration-300">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Lock size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">دخول محدود</p>
              <p className="text-[9px] font-bold text-slate-500 leading-tight">هذا المشروع يتبع لـ {dept?.name}</p>
           </div>
        </div>
      )}

      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className={`relative z-10 flex flex-col h-full ${isLocked ? 'opacity-40 grayscale' : ''}`}>
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-2xl transition-all shadow-sm ${isLocked ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
            <Briefcase size={24} />
          </div>
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${
            project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30'
          }`}>
            {project.status === 'ACTIVE' ? 'نشط مشروع' : 'قيد الانتظار'}
          </span>
        </div>

        <h3 className={`text-xl font-black mb-1 transition-colors ${isLocked ? 'text-slate-500' : 'text-slate-800 dark:text-white group-hover:text-blue-600'}`}>{project.name}</h3>
        <p className="text-xs text-slate-400 font-bold mb-2 flex items-center gap-1"><Building2 size={12} /> {project.client}</p>
        <div className="flex items-center gap-2 mb-6">
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dept?.color }}></div>
           <span className="text-[10px] font-black text-slate-500 uppercase">{dept?.name}</span>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter">
            <span className="text-slate-400">الإنجاز الهندسي الفعلي</span>
            <span className={isLocked ? 'text-slate-400' : 'text-blue-600'}>{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-slate-800">
            <div 
              className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)] ${isLocked ? 'bg-slate-300' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">تاريخ التسليم</span>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar size={14} className="text-blue-500" />
              <span className="text-xs font-black tabular-nums">{project.deadline}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">الميزانية</span>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <DollarSign size={14} className="text-emerald-500" />
              <span className="text-xs font-black tabular-nums">{(project.budget/1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {projectEmployees.slice(0, 4).map(emp => (
              <img 
                key={emp.id} 
                src={emp.avatar} 
                title={emp.name} 
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-sm" 
              alt=""/>
            ))}
          </div>
          <div 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all shadow-lg ${
              isLocked 
              ? 'bg-slate-100 text-slate-400' 
              : 'bg-slate-900 dark:bg-slate-800 text-white group-hover:bg-blue-600'
            }`}
          >
            {isLocked ? <><Lock size={16} /> مقفل</> : <><ArrowRight size={16} /> إدارة المشروع</>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetailModal: React.FC<{ 
  project: Project, 
  tasks: Task[], 
  employees: Employee[], 
  onClose: () => void,
  currentUser: Employee,
  onUpdateProject: (p: Project) => void,
  onUpdateTasks: (t: Task[]) => void
}> = ({ project, tasks, employees, onClose, currentUser, onUpdateProject, onUpdateTasks }) => {
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const manager = employees.find(e => e.id === project.managerId);

  const isGeneralManager = currentUser.role === Role.ADMIN;
  const isProjectManager = currentUser.id === project.managerId;

  const toggleTaskStatus = (taskId: string) => {
    if (!isProjectManager && !isGeneralManager) return;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          status: t.status === TaskStatus.COMPLETED ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED 
        };
      }
      return t;
    });
    onUpdateTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (!isGeneralManager) return;
    const title = prompt("عنوان الخطوة الهندسية الجديدة:");
    if (!title) return;
    const weight = parseInt(prompt("النسبة المئوية لهذه الخطوة (0-100):") || "10");
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description: 'خطوة تنفيذية مضافة من قبل المدير العام',
      status: TaskStatus.NEW,
      priority: TaskPriority.MEDIUM,
      assignedTo: project.managerId,
      departmentId: employees.find(e => e.id === project.managerId)?.departmentId || 'arch',
      projectId: project.id,
      dueDate: project.deadline,
      estimatedHours: 8,
      actualHours: 0,
      comments: [],
      attachments: [],
      kpiPoints: weight * 2,
      weight: weight
    };
    onUpdateTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!isGeneralManager) return;
    onUpdateTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleChangeManager = (empId: string) => {
    if (!isGeneralManager) return;
    onUpdateProject({ ...project, managerId: empId });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl">
              <Briefcase size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">{project.name}</h3>
              <p className="text-xs font-bold text-slate-400">إدارة الخطوات والنسب المئوية</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-2 space-y-10">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <ListTodo size={20} className="text-blue-600" /> الخطوات التنفيذية والنسب
                  </h4>
                  {isGeneralManager && (
                    <button 
                      onClick={handleAddTask}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-700 transition-all shadow-md"
                    >
                      <Plus size={14} /> إضافة خطوة
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {projectTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-5 rounded-3xl group transition-all border ${
                        task.status === TaskStatus.COMPLETED 
                        ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/50' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                         <button 
                           disabled={!isProjectManager && !isGeneralManager}
                           onClick={() => toggleTaskStatus(task.id)}
                           className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                             task.status === TaskStatus.COMPLETED 
                             ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                             : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-blue-500'
                           } ${(isProjectManager || isGeneralManager) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                         >
                           {task.status === TaskStatus.COMPLETED && <CheckCircle size={18} />}
                         </button>
                         <div>
                            <p className={`text-sm font-black transition-all ${
                              task.status === TaskStatus.COMPLETED ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'
                            }`}>
                              {task.title}
                            </p>
                            <span className="text-[10px] text-blue-600 font-black">نسبة الخطوة: {task.weight}%</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isGeneralManager && (
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${
                          task.status === TaskStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {projectTasks.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                       <p className="text-slate-400 font-bold">لم يتم إعداد خطوات لهذا المشروع بعد.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User size={14} /> مدير المشروع المسؤول
                </h4>
                
                {isGeneralManager ? (
                  <div className="space-y-4">
                    <select 
                      value={project.managerId}
                      onChange={(e) => handleChangeManager(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {employees.filter(e => e.role !== Role.EMPLOYEE).map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                    <p className="text-[9px] text-slate-400 italic">بصفتك المدير العام، يمكنك تغيير مدير المشروع في أي وقت.</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <img src={manager?.avatar} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500 shadow-xl" alt="" />
                    <div>
                      <p className="text-lg font-black">{manager?.name}</p>
                      <p className="text-[10px] font-bold text-blue-400">{manager?.role}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">الصلاحيات الحالية</h4>
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    {isGeneralManager ? (
                      <><Shield size={14} className="text-emerald-500" /> <span className="text-[11px] font-black">تحكم كامل (مدير عام)</span></>
                    ) : isProjectManager ? (
                      <><CheckCircle size={14} className="text-blue-500" /> <span className="text-[11px] font-black">مدير مشروع (إدارة خطوات)</span></>
                    ) : (
                      <><Lock size={14} className="text-slate-400" /> <span className="text-[11px] font-black">عرض فقط</span></>
                    )}
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const NewProjectModal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  onAdd: (p: Project, steps: any[]) => void,
  employees: Employee[] 
}> = ({ isOpen, onClose, onAdd, employees }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    budget: 1000000,
    deadline: new Date().toISOString().split('T')[0],
    managerId: employees.find(e => e.role === Role.ADMIN)?.id || employees[0]?.id || '',
    departmentId: employees[0]?.departmentId || 'arch'
  });

  const [steps, setSteps] = useState([{ title: 'بدء المشروع وتجهيز المخططات', weight: 10 }]);

  if (!isOpen) return null;

  const addStep = () => {
    setSteps([...steps, { title: '', weight: 10 }]);
  };

  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...steps];
    (newSteps[index] as any)[field] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const totalWeight = steps.reduce((acc, s) => acc + s.weight, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      if (!window.confirm(`مجموع النسب هو ${totalWeight}% وليس 100%. هل تريد المتابعة على أي حال؟`)) return;
    }
    onAdd({
      id: `proj-${Date.now()}`,
      ...formData,
      status: 'ACTIVE',
      progress: 0
    }, steps);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden p-10 border border-white/10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-black text-slate-800 dark:text-white">إطلاق مشروع هندسي جديد</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-400"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto custom-scrollbar px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">اسم المشروع</label>
              <input required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">العميل</label>
              <input required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">القسم المسؤول</label>
              <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                {DEPARTMENTS.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">مدير المشروع</label>
              <select value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                {employees.filter(e => e.role !== Role.EMPLOYEE).map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">خطوات المشروع والنسب (%)</label>
               <button type="button" onClick={addStep} className="text-blue-600 font-black text-xs hover:underline flex items-center gap-1"><Plus size={14}/> إضافة خطوة</button>
            </div>
            
            <div className="space-y-3">
               {steps.map((step, index) => (
                 <div key={index} className="flex gap-2 items-center">
                    <input 
                      required
                      type="text" 
                      placeholder="عنوان الخطوة"
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                      value={step.title}
                      onChange={e => updateStep(index, 'title', e.target.value)}
                    />
                    <div className="relative w-24">
                       <input 
                        required
                        type="number" 
                        className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black outline-none text-center"
                        value={step.weight}
                        onChange={e => updateStep(index, 'weight', parseInt(e.target.value))}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                    </div>
                    <button type="button" onClick={() => removeStep(index)} className="p-2 text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                 </div>
               ))}
            </div>
            
            <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-black ${totalWeight === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
               <div className="flex items-center gap-2">
                 <Lock size={14} className="opacity-40" />
                 <span>إجمالي النسب المئوية:</span>
               </div>
               <span>{totalWeight}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">الميزانية ($)</label>
                <input required type="number" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.budget} onChange={e => setFormData({...formData, budget: parseInt(e.target.value)})} />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">تاريخ التسليم</label>
                <input required type="date" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
             </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3">
             <Save size={20} /> اعتماد وإطلاق المشروع
          </button>
        </form>
      </div>
    </div>
  );
};

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, tasks, employees, setProjects, setTasks, currentUser, onAccessDeny }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const isGeneralManager = currentUser.role === Role.ADMIN;

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedProject(updated);
  };

  const handleUpdateTasks = (updated: Task[]) => {
    setTasks(updated);
  };

  const handleAddProject = (newProj: Project, steps: any[]) => {
    setProjects([newProj, ...projects]);
    
    const projectTasks: Task[] = steps.map((s, idx) => ({
      id: `task-${newProj.id}-${idx}`,
      title: s.title,
      description: 'خطوة تنفيذية تم إعدادها عند إطلاق المشروع',
      status: TaskStatus.NEW,
      priority: TaskPriority.MEDIUM,
      assignedTo: newProj.managerId,
      departmentId: employees.find(e => e.id === newProj.managerId)?.departmentId || 'arch',
      projectId: newProj.id,
      dueDate: newProj.deadline,
      estimatedHours: 8,
      actualHours: 0,
      comments: [],
      attachments: [],
      kpiPoints: s.weight * 2,
      weight: s.weight
    }));
    
    setTasks(prev => [...projectTasks, ...prev]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">محفظة المشاريع الهندسية</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">إدارة مركزية تربط التصاميم الإنشائية والمهام بفريق العمل</p>
        </div>
        {isGeneralManager && (
          <button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>إطلاق مشروع جديد</span>
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(p => {
          const projectTasks = tasks.filter(t => t.projectId === p.id);
          const projectEmployees = employees.filter(e => projectTasks.some(t => t.assignedTo === e.id) || e.id === p.managerId);
          
          const isLocked = !isGeneralManager && p.departmentId !== currentUser.departmentId;

          return (
            <ProjectCard 
              key={p.id} 
              project={p} 
              projectTasks={projectTasks} 
              projectEmployees={projectEmployees} 
              isLocked={isLocked}
              onViewDetails={setSelectedProject}
              onAccessDeny={onAccessDeny}
            />
          );
        })}
      </div>

      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          tasks={tasks} 
          employees={employees} 
          onClose={() => setSelectedProject(null)} 
          currentUser={currentUser}
          onUpdateProject={handleUpdateProject}
          onUpdateTasks={handleUpdateTasks}
        />
      )}

      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
        onAdd={handleAddProject}
        employees={employees}
      />
    </div>
  );
};

export default ProjectsList;
