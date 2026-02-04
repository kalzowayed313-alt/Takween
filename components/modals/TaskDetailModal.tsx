
import React, { useState } from 'react';
import { X, Trash2, CheckCircle, Clock, Paperclip, MessageSquare, Save, User, FileCode, Video, Image, FileText } from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Employee, Role } from '../../types';

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

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, task, onClose, onUpdate, onDelete, employees, projects, currentUser }) => {
  if (!isOpen || !task) return null;

  const [formData, setFormData] = useState<Task>({ ...task });
  const [comment, setComment] = useState('');
  const canEdit = currentUser.role === Role.ADMIN || currentUser.role === Role.DEPT_MANAGER;

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة نهائياً؟')) {
      onDelete(task.id);
      onClose();
    }
  };

  const addComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      text: comment,
      createdAt: new Date().toISOString()
    };
    const updated = { ...formData, comments: [...(formData.comments || []), newComment] };
    setFormData(updated);
    setComment('');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'autocad': return <FileCode size={20} className="text-orange-500" />;
      case '3dmax': return <BoxIcon size={20} className="text-blue-500" />;
      case 'image': return <Image size={20} className="text-emerald-500" />;
      case 'video': return <Video size={20} className="text-rose-500" />;
      case 'pdf': return <FileText size={20} className="text-red-500" />;
      default: return <FileText size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in fade-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md"><CheckSquare size={20} /></div>
             <div>
               <h3 className="text-xl font-bold text-slate-800">{task.title}</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">معرف المهمة: {task.id}</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <button onClick={handleDelete} className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="حذف المهمة">
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-xl transition-colors"><X size={20} className="text-slate-500" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">وصف المهمة</label>
                {canEdit ? (
                  <textarea 
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium leading-relaxed" 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">{task.description}</p>
                )}
              </div>

              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">المرفقات الهندسية ({formData.attachments?.length || 0})</label>
                  <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><Paperclip size={14} /> إضافة مرفق</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.attachments?.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                      <div className="flex items-center gap-3">
                        {getFileIcon(att.type)}
                        <div>
                          <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{att.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase">{att.type}</p>
                        </div>
                      </div>
                      <a href={att.url} download className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Save size={14} /></a>
                    </div>
                  ))}
                  {(!formData.attachments || formData.attachments.length === 0) && (
                    <p className="text-xs text-slate-400 italic col-span-2 p-4 text-center bg-slate-50 rounded-2xl">لا يوجد مرفقات تقنية لهذه المهمة.</p>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block flex items-center gap-2"><MessageSquare size={14} /> المناقشة والتعليقات</label>
                <div className="space-y-4 mb-6">
                  {formData.comments?.map(c => {
                    const author = employees.find(e => e.id === c.authorId);
                    return (
                      <div key={c.id} className="flex gap-3">
                        <img src={author?.avatar} className="w-8 h-8 rounded-full object-cover mt-1" alt="" />
                        <div className="flex-1 bg-slate-50 p-3 rounded-2xl">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-700">{author?.name}</span>
                            <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="اكتب تعليقاً أو ملاحظة فنية..." 
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addComment()}
                  />
                  <button onClick={addComment} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">إرسال</button>
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl space-y-6 border border-slate-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">حالة المهمة</label>
                  <select 
                    disabled={!canEdit}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold shadow-sm outline-none"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})}
                  >
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">الأولوية</label>
                  <select 
                    disabled={!canEdit}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold shadow-sm outline-none"
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}
                  >
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">المسؤول</label>
                  <select 
                    disabled={!canEdit}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold shadow-sm outline-none"
                    value={formData.assignedTo}
                    onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                  >
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">تاريخ التسليم</label>
                  <input 
                    disabled={!canEdit}
                    type="date" 
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold shadow-sm outline-none"
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                   <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-400 font-bold">نقاط KPI:</span>
                     <span className="text-blue-600 font-bold">+{formData.kpiPoints}</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-400 font-bold">الوقت المقدر:</span>
                     <span className="text-slate-700 font-bold">{formData.estimatedHours} ساعة</span>
                   </div>
                </div>
              </div>

              {canEdit && (
                <button 
                  onClick={handleUpdate}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Save size={18} /> حفظ التعديلات
                </button>
              )}
              
              {!canEdit && formData.status !== TaskStatus.COMPLETED && (
                <button 
                  onClick={() => { setFormData({...formData, status: TaskStatus.COMPLETED}); onUpdate({...formData, status: TaskStatus.COMPLETED}); onClose(); }}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle size={18} /> إنهاء المهمة
                </button>
              )}
            </div>
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

const CheckSquare = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

export default TaskDetailModal;
