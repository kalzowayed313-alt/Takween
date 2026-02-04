
import React, { useState, useRef } from 'react';
import { X, CheckCircle, BrainCircuit, FileCode, Image, Video, FileText, Upload, Trash2, Plus, ListPlus, Layout, Target } from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Employee, Attachment, KpiRule } from '../../types';
import { DEPARTMENTS } from '../../constants';
import { suggestTasks } from '../../services/geminiService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
  employees: Employee[];
  projects: any[];
  kpiRules: KpiRule[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onAdd, employees, projects, kpiRules }) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: employees[0]?.id || '',
    departmentId: DEPARTMENTS[0].id,
    projectId: projects[0]?.id || '',
    priority: TaskPriority.MEDIUM,
    dueDate: new Date().toISOString().split('T')[0],
    estimatedHours: 8,
    kpiPoints: 25
  });

  const [bulkTasks, setBulkTasks] = useState([
    { title: '', description: '', priority: TaskPriority.MEDIUM, points: 25 }
  ]);

  const applyKpiRule = (ruleId: string) => {
    const rule = kpiRules.find(r => r.id === ruleId);
    if (rule) {
      setFormData(prev => ({
        ...prev,
        title: rule.title,
        kpiPoints: rule.defaultPoints,
        estimatedHours: rule.defaultHours
      }));
    }
  };

  const handleAiAssist = async () => {
    setIsLoadingAi(true);
    const suggestions = await suggestTasks("إعداد تقرير فني لمراجعة جودة الخرسانة في مشروع البرج");
    if (suggestions && suggestions.length > 0) {
      if (isBulkMode) {
        const newBulkTasks = suggestions.map((s: any) => ({
          title: s.title,
          description: s.description,
          priority: s.priority as TaskPriority || TaskPriority.MEDIUM,
          points: 25
        }));
        setBulkTasks(newBulkTasks);
      } else {
        setFormData(prev => ({
          ...prev,
          title: suggestions[0].title,
          description: suggestions[0].description
        }));
      }
    }
    setIsLoadingAi(false);
  };

  const addBulkRow = () => {
    setBulkTasks([...bulkTasks, { title: '', description: '', priority: TaskPriority.MEDIUM, points: 25 }]);
  };

  const removeBulkRow = (index: number) => {
    if (bulkTasks.length > 1) {
      setBulkTasks(bulkTasks.filter((_, i) => i !== index));
    }
  };

  const updateBulkRow = (index: number, field: string, value: any) => {
    const newTasks = [...bulkTasks];
    (newTasks[index] as any)[field] = value;
    setBulkTasks(newTasks);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file: File) => {
        let type = 'other';
        if (file.name.endsWith('.dwg') || file.name.endsWith('.dxf')) type = 'autocad';
        else if (file.name.endsWith('.max') || file.name.endsWith('.3ds')) type = '3dmax';
        else if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type === 'application/pdf') type = 'pdf';

        return {
          id: `att-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: type,
          uploadedAt: new Date().toISOString()
        };
      });
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'autocad': return <FileCode className="text-orange-600" size={20} />;
      case '3dmax': return <Box className="text-blue-600" size={20} />;
      case 'image': return <Image className="text-emerald-600" size={20} />;
      case 'video': return <Video className="text-rose-600" size={20} />;
      case 'pdf': return <FileText className="text-red-600" size={20} />;
      default: return <FileText className="text-slate-400" size={20} />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBulkMode) {
      bulkTasks.forEach((bt, idx) => {
        if (bt.title.trim()) {
          const newTask: Task = {
            id: `task-bulk-${Date.now()}-${idx}`,
            title: bt.title,
            description: bt.description || 'مهمة ضمن قائمة مهام متعددة',
            assignedTo: formData.assignedTo,
            departmentId: employees.find(emp => emp.id === formData.assignedTo)?.departmentId || DEPARTMENTS[0].id,
            projectId: formData.projectId,
            priority: bt.priority,
            dueDate: formData.dueDate,
            status: TaskStatus.NEW,
            estimatedHours: formData.estimatedHours,
            actualHours: 0,
            attachments: attachments,
            comments: [],
            kpiPoints: bt.points,
            weight: 10
          };
          onAdd(newTask);
        }
      });
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...formData,
        status: TaskStatus.NEW,
        actualHours: 0,
        attachments: attachments,
        comments: [],
        weight: 10
      };
      onAdd(newTask);
    }
    onClose();
    setAttachments([]);
    setBulkTasks([{ title: '', description: '', priority: TaskPriority.MEDIUM, points: 25 }]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[95vh] border border-white/10">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">إسناد مهام هندسية</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">يرجى ملء تفاصيل العمل الموكل للموظف</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
               <button type="button" onClick={() => setIsBulkMode(false)} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${!isBulkMode ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}><Layout size={14} /> مهمة واحدة</button>
               <button type="button" onClick={() => setIsBulkMode(true)} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${isBulkMode ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}><ListPlus size={14} /> إسناد متعدد</button>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          
          <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 text-indigo-700 dark:text-indigo-400">
              <div className="p-2.5 bg-white dark:bg-indigo-900/40 rounded-xl shadow-sm"><BrainCircuit size={22} /></div>
              <div>
                <span className="text-xs font-black block">مساعد الذكاء الاصطناعي المهني</span>
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-tight">توليد {isBulkMode ? 'قائمة مهام مترابطة' : 'وصف فني دقيق'} للمشروع</span>
              </div>
            </div>
            <button type="button" onClick={handleAiAssist} disabled={isLoadingAi} className="text-xs font-black bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95">{isLoadingAi ? 'جاري التحليل...' : isBulkMode ? 'اقتراح قائمة مهام' : 'اقتراح الوصف'}</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">الموظف المسؤول</label>
              <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">المشروع</label>
              <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">موعد التسليم النهائي</label>
              <input type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
            </div>
          </div>

          {!isBulkMode ? (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
               {/* استخدام قوالب KPI المهنية */}
               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1 flex items-center gap-2">
                  <Target size={14} className="text-blue-600" /> تطبيق قالب مهمة معتمد (KPI Template)
                </label>
                <select 
                  className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  onChange={e => applyKpiRule(e.target.value)}
                >
                  <option value="">اختيار قالب للحساب التلقائي...</option>
                  {kpiRules.map(rule => (
                    <option key={rule.id} value={rule.id}>{rule.title} ({rule.defaultPoints} نقطة)</option>
                  ))}
                </select>
              </div>

               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">عنوان المهمة</label>
                <input required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" placeholder="مثلاً: مراجعة مخططات الطابق العاشر" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">التفاصيل والملاحظات الفنية</label>
                <textarea rows={4} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white leading-relaxed" placeholder="اكتب التعليمات الهندسية هنا..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">الأولوية</label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none dark:text-white" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}>
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">الوقت التقديري (ساعة)</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black outline-none dark:text-white" value={formData.estimatedHours} onChange={e => setFormData({...formData, estimatedHours: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mr-1">نقاط الـ KPI</label>
                  <input type="number" className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-xs font-black outline-none dark:text-white" value={formData.kpiPoints} onChange={e => setFormData({...formData, kpiPoints: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-left duration-300">
               <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">قائمة المهام المتعددة</label>
                  <button type="button" onClick={addBulkRow} className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:underline bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg"><Plus size={14} /> إضافة سطر جديد</button>
               </div>
               
               <div className="space-y-4">
                  {bulkTasks.map((bt, index) => (
                    <div key={index} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 relative group">
                       <button type="button" onClick={() => removeBulkRow(index)} className="absolute top-4 left-4 p-1.5 text-slate-300 hover:text-rose-500 transition-colors bg-white dark:bg-slate-800 rounded-lg shadow-sm"><Trash2 size={14} /></button>
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">عنوان المهمة {index + 1}</label>
                            <input required type="text" className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500 dark:text-white" placeholder="أدخل العنوان..." value={bt.title} onChange={e => updateBulkRow(index, 'title', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">الأولوية</label>
                            <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold outline-none dark:text-white" value={bt.priority} onChange={e => updateBulkRow(index, 'priority', e.target.value)}>
                              {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">النقاط</label>
                            <input type="number" className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black outline-none dark:text-white" value={bt.points} onChange={e => updateBulkRow(index, 'points', parseInt(e.target.value))} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المرفقات الهندسية {isBulkMode && '(سيتم إرفاقها لكافة المهام)'}</label>
            </div>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".dwg,.max,.pdf,image/*,video/*" />
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 transition-colors"><Upload size={28} /></div>
                <p className="text-sm font-black text-slate-600 dark:text-slate-300">اسحب الملفات هنا أو انقر لاختيار المخططات</p>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map(att => (
                  <div key={att.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl group hover:border-blue-200 transition-all shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex-shrink-0">{getFileIcon(att.type)}</div>
                      <div className="min-w-0"><p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{att.name}</p></div>
                    </div>
                    <button type="button" onClick={() => removeAttachment(att.id)} className="text-slate-300 hover:text-rose-600 p-2 rounded-xl transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 sticky bottom-0 bg-white dark:bg-slate-900 pb-2 flex gap-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-blue-700 shadow-[0_15px_30px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 transition-all active:scale-95"><CheckCircle size={24} /> {isBulkMode ? `إسناد ${bulkTasks.length} مهام للموظف` : 'إسناد المهمة للموظف'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Box = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
);

export default TaskModal;
