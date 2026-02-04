
import React, { useState, useEffect } from 'react';
import { 
  X, Trash2, CheckCircle, Clock, Paperclip, MessageSquare, Save, 
  User, FileCode, Video, Image, FileText, AlertCircle, Calendar, 
  ChevronLeft, Layout, Target, Zap, Info, Flag, Send, Download
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Employee, Role } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface TaskDetailModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  employees: Employee[];
  projects: any[];
  currentUser: Employee;
}

const BoxIcon = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.29 7 12 12 20.71 7"></polyline>
    <line x1="12" y1="22" x2="12" y2="12"></line>
  </svg>
);

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  isOpen, task, onClose, onUpdate, onDelete, employees, projects, currentUser 
}) => {
  const [formData, setFormData] = useState<Task | null>(null);
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    }
  }, [task]);

  if (!isOpen || !formData) return null;

  const isAdmin = currentUser.role === Role.ADMIN;
  const isManager = currentUser.role === Role.ADMIN || currentUser.role === Role.DEPT_MANAGER;
  const isAssignee = currentUser.id === formData.assignedTo;
  const canEditMainFields = isAdmin || isManager;
  const canUpdateStatus = isAdmin || isManager || isAssignee;

  const handleUpdate = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    onUpdate(formData);
    setIsSaving(false);
    onClose();
  };

  const addComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      text: comment,
      createdAt: new Date().toISOString()
    };
    setFormData({ 
      ...formData, 
      comments: [...(formData.comments || []), newComment] 
    });
    setComment('');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'autocad': return <FileCode size={22} className="text-orange-500" />;
      case '3dmax': return <BoxIcon size={22} className="text-blue-500" />;
      case 'image': return <Image size={22} className="text-emerald-500" />;
      case 'video': return <Video size={22} className="text-rose-500" />;
      case 'pdf': return <FileText size={22} className="text-red-500" />;
      default: return <FileText size={22} className="text-slate-400" />;
    }
  };

  const project = projects.find(p => p.id === formData.projectId);
  const assignee = employees.find(e => e.id === formData.assignedTo);
  const progressPercent = formData.status === TaskStatus.COMPLETED ? 100 : formData.status === TaskStatus.REVIEW ? 80 : formData.status === TaskStatus.IN_PROGRESS ? 40 : 10;

  return (
    <>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md transition-all animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in slide-in-from-bottom-4 duration-500 border border-white/10">
          
          {/* Header Section */}
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/5 -skew-x-12 translate-x-32"></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className={`p-5 rounded-[1.8rem] shadow-2xl transition-all duration-700 ${
                formData.status === TaskStatus.COMPLETED ? 'bg-emerald-500' : 'bg-blue-600'
              } text-white group cursor-default hover:scale-110`}>
                <Layout size={32} className="group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{formData.title}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">#{formData.id.split('-').pop()}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {project && (
                    <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-xl">
                      <Zap size={14} fill="currentColor" /> {project.name}
                    </div>
                  )}
                  <div className={`flex items-center gap-1.5 text-xs font-black uppercase ${
                    formData.priority === TaskPriority.HIGH ? 'text-rose-500' : 
                    formData.priority === TaskPriority.MEDIUM ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    <Flag size={14} fill="currentColor" /> أولوية {formData.priority}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              {isAdmin && (
                <button 
                  onClick={() => setIsConfirmingDelete(true)} 
                  className="p-4 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-[1.5rem] transition-all group"
                  title="حذف المهمة"
                >
                  <Trash2 size={24} className="group-hover:scale-110" />
                </button>
              )}
              <button onClick={onClose} className="p-4 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[1.5rem] transition-all hover:rotate-90">
                <X size={28} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 text-right" dir="rtl">
              
              {/* Main Content (3 Columns) */}
              <div className="lg:col-span-3 space-y-12">
                
                {/* Progress Tracker */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">مستوى الإنجاز الهندسي <Target size={14} className="text-blue-500" /></h4>
                     <span className="text-sm font-black text-blue-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-white dark:bg-slate-900 rounded-full overflow-hidden shadow-inner p-0.5">
                     <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/20" 
                      style={{ width: `${progressPercent}%` }}
                     ></div>
                  </div>
                </div>

                {/* Description Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                      <Info size={18} className="text-blue-500" />
                      <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">الوصف الفني للمهمة</h4>
                    </div>
                    {canEditMainFields && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-lg">قابل للتعديل</span>}
                  </div>
                  <textarea 
                    disabled={!canEditMainFields}
                    className="w-full p-8 bg-white dark:bg-slate-950 border-2 border-slate-50 dark:border-slate-800 rounded-[2.5rem] text-sm font-medium leading-relaxed outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all dark:text-slate-300 text-right min-h-[180px] shadow-sm"
                    placeholder="يرجى كتابة التفاصيل التقنية هنا..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </section>

                {/* Attachments Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Paperclip size={18} className="text-blue-500" />
                      <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">المرفقات الهندسية والمخططات ({formData.attachments?.length || 0})</h4>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all">إدارة المرفقات</button>
                  </div>
                  
                  {formData.attachments && formData.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 rounded-3xl group hover:border-blue-200 dark:hover:border-blue-900/50 transition-all shadow-sm">
                          <div className="flex items-center gap-4 text-right overflow-hidden">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform">{getFileIcon(att.type)}</div>
                            <div className="truncate">
                              <p className="text-xs font-black text-slate-800 dark:text-white truncate max-w-[180px]">{att.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5 tracking-widest">{att.type} • {new Date(att.uploadedAt).toLocaleDateString('ar-SA')}</p>
                            </div>
                          </div>
                          <a 
                            href={att.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-3 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-950/20 flex flex-col items-center">
                       <AlertCircle size={40} className="text-slate-200 dark:text-slate-800 mb-4" />
                       <p className="text-sm font-black text-slate-400 tracking-wide uppercase">لا توجد مخططات مرفقة لهذه المهمة حالياً</p>
                    </div>
                  )}
                </section>

                {/* Comments Section */}
                <section className="space-y-8">
                  <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-4">
                    <MessageSquare size={18} className="text-blue-500" />
                    <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">سجل المناقشات والملاحظات</h4>
                  </div>
                  
                  <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar px-2">
                    {formData.comments && formData.comments.length > 0 ? (
                      formData.comments.map(c => {
                        const author = employees.find(e => e.id === c.authorId);
                        const isMe = currentUser.id === c.authorId;
                        return (
                          <div key={c.id} className={`flex gap-5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <img src={author?.avatar} className="w-12 h-12 rounded-[1.2rem] object-cover ring-4 ring-slate-50 dark:ring-slate-800 shadow-xl shrink-0" alt="" />
                            <div className={`flex-1 p-6 rounded-[2rem] border relative ${
                              isMe ? 'bg-blue-600 text-white border-blue-500' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm'
                            }`}>
                              <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-black uppercase ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>{author?.name}</span>
                                <span className={`text-[9px] font-bold ${isMe ? 'text-blue-200' : 'text-slate-300'}`}>{new Date(c.createdAt).toLocaleString('ar-SA')}</span>
                              </div>
                              <p className="text-sm leading-relaxed font-medium">{c.text}</p>
                              <div className={`absolute top-6 ${isMe ? '-left-2' : '-right-2'} w-4 h-4 rotate-45 ${isMe ? 'bg-blue-600' : 'bg-white dark:bg-slate-800 border-t border-r border-slate-100 dark:border-slate-700'}`}></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-10 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem]">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">كن أول من يضيف تعليقاً فنياً على هذه المهمة</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 mt-6 shadow-inner">
                     <button 
                      onClick={addComment} 
                      className="bg-blue-600 text-white w-14 h-14 rounded-[1.8rem] flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-500/20 shrink-0"
                     >
                       <Send size={24} className="rotate-180" />
                     </button>
                     <input 
                      type="text" 
                      placeholder="أضف ملاحظة فنية أو تحديثاً لفريق العمل..." 
                      className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold outline-none text-right dark:text-white"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addComment()}
                     />
                  </div>
                </section>
              </div>

              {/* Sidebar Controls (1 Column) */}
              <div className="space-y-10">
                
                {/* Status Card */}
                <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 space-y-8 shadow-sm">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-4 tracking-widest">تحديث الحالة التشغيلية</label>
                    <div className="relative group">
                      <select 
                        disabled={!canUpdateStatus}
                        className={`w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 rounded-2xl text-xs font-black outline-none shadow-sm transition-all appearance-none cursor-pointer text-center ${
                          formData.status === TaskStatus.COMPLETED ? 'border-emerald-200 dark:border-emerald-900/50 text-emerald-600' : 'border-blue-100 dark:border-blue-900/50 text-blue-600'
                        }`}
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})}
                      >
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronLeft size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none -rotate-90" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-4 tracking-widest flex items-center gap-2">الموعد النهائي <Calendar size={14} /></label>
                    <input 
                      disabled={!canEditMainFields}
                      type="date" 
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black outline-none shadow-sm text-center focus:ring-2 focus:ring-blue-500 dark:text-white"
                      value={formData.dueDate}
                      onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-4 tracking-widest">مستوى الجهد (KPI)</label>
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30">
                       <span className="text-xl font-black text-emerald-600 tabular-nums">+{formData.kpiPoints}</span>
                       <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">نقطة أداء</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-300" />
                      <span className="text-[10px] font-black text-slate-500 uppercase">الوقت المقدر: {formData.estimatedHours}س</span>
                    </div>
                  </div>
                </div>

                {/* Assignee Information */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150"></div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                     <User size={14} className="text-blue-500" /> المهندس الموكل إليه
                   </h4>
                   <div className="flex items-center gap-4 relative z-10">
                      <img 
                        src={assignee?.avatar} 
                        className="w-16 h-16 rounded-[1.5rem] object-cover border-4 border-white/10 shadow-2xl transition-transform group-hover:rotate-6" 
                        alt="" 
                      />
                      <div className="overflow-hidden">
                         <p className="text-base font-black leading-tight truncate">{assignee?.name}</p>
                         <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1.5">{assignee?.role}</p>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button 
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    {isSaving ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save size={24} /> 
                        <span>حفظ كافة التغييرات</span>
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-slate-400 font-bold text-center uppercase tracking-widest">تحديث البيانات يؤثر على تقارير KPI الدورية</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={() => {
          onDelete(formData.id);
          onClose();
        }}
        title="هل أنت متأكد من حذف هذه المهمة؟"
        message="سيتم إزالة كافة البيانات والمرفقات والتعليقات المرتبطة بهذه المهمة نهائياً من سجلات الشركة ولا يمكن التراجع عن هذا الإجراء."
      />
    </>
  );
};

export default TaskDetailModal;
