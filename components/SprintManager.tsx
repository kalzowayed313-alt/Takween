
import React, { useState, useMemo } from 'react';
import { Project, Sprint, Employee, Role, SprintExtension } from '../types';
import { Zap, Calendar, Play, Lock, Plus, X, Briefcase, RefreshCcw, Save, AlertTriangle, Clock, History, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface SprintManagerProps {
  projects: Project[];
  sprints: Sprint[];
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  currentUser: Employee;
}

const RescheduleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newEndDate: string, reason: string) => void;
  sprint: Sprint;
}> = ({ isOpen, onClose, onConfirm, sprint }) => {
  const [newEndDate, setNewEndDate] = useState(sprint.endDate);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
             <Calendar className="text-amber-500" /> إعادة جدولة السبرنت
           </h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-400">
             <X size={20} />
           </button>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
            <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
              تنبيه: بصفتك المدير العام، سيتم أرشفة تاريخ التمديد والسبب في سجل السبرنت الدائم للرجوع إليه في تقارير الجودة.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">تاريخ الانتهاء الجديد</label>
            <input 
              type="date" 
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              value={newEndDate}
              onChange={e => setNewEndDate(e.target.value)}
              min={sprint.endDate}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">سبب التمديد (سيتم أرشفته)</label>
            <textarea 
              rows={4}
              placeholder="يرجى ذكر السبب التقني أو الإداري للتأخير..."
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <button 
            disabled={!reason.trim()}
            onClick={() => onConfirm(newEndDate, reason)}
            className="w-full bg-amber-500 text-white py-5 rounded-3xl font-black shadow-xl hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
             <Save size={20} /> اعتماد التمديد وأرشفة السبب
          </button>
        </div>
      </div>
    </div>
  );
};

const NewSprintModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (s: Sprint) => void;
  projects: Project[];
}> = ({ isOpen, onClose, onAdd, projects }) => {
  const [formData, setFormData] = useState({
    name: '',
    projectId: projects[0]?.id || '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `spr-${Date.now()}`,
      ...formData,
      status: 'PLANNED',
      extensions: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
             <Plus className="text-blue-600" /> إضافة سبرنت جديد
           </h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-400">
             <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">اسم السبرنت</label>
            <input 
              required
              type="text" 
              placeholder="مثلاً: تطوير واجهات المشروع - المرحلة 1"
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">المشروع المرتبط</label>
            <select 
              required
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={formData.projectId}
              onChange={e => setFormData({...formData, projectId: e.target.value})}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">تاريخ البدء</label>
              <input 
                type="date" 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">تاريخ الانتهاء</label>
              <input 
                type="date" 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3">
             <Save size={20} /> اعتماد السبرنت
          </button>
        </form>
      </div>
    </div>
  );
};

const SprintCard: React.FC<{
  spr: Sprint;
  projects: Project[];
  isAdmin: boolean;
  isManager: boolean;
  onStatusChange: (id: string, newStatus: any) => void;
  onDelete: (id: string) => void;
  onReschedule: (spr: Sprint) => void;
  getDaysRemaining: (date: string) => number;
}> = ({ spr, projects, isAdmin, isManager, onStatusChange, onDelete, onReschedule, getDaysRemaining }) => {
  const [showHistory, setShowHistory] = useState(false);
  const project = projects.find(p => p.id === spr.projectId);
  const daysLeft = getDaysRemaining(spr.endDate);
  const isExpiringSoon = spr.status === 'ACTIVE' && daysLeft <= 3 && daysLeft >= 0;

  return (
    <div 
      className={`group p-8 rounded-[2.5rem] border shadow-sm transition-all relative overflow-hidden flex flex-col h-full ${
        isExpiringSoon 
          ? 'pulse-red-animate border-rose-500 ring-4 ring-rose-500/20' 
          : spr.status === 'ACTIVE'
            ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900 ring-4 ring-blue-50 dark:ring-blue-900/10'
            : spr.status === 'CLOSED'
              ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 opacity-80'
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-90'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl transition-all shadow-md ${
            isExpiringSoon ? 'bg-rose-600 text-white animate-bounce' :
            spr.status === 'ACTIVE' ? 'bg-blue-600 text-white' : 
            spr.status === 'CLOSED' ? 'bg-slate-400 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}>
            <Zap size={28} className={spr.status === 'ACTIVE' ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className={`text-lg font-black leading-tight ${isExpiringSoon ? 'text-rose-700 dark:text-rose-400' : 'text-slate-800 dark:text-white'}`}>
              {spr.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-blue-600 dark:text-blue-400">
              <Briefcase size={14} />
              <span className="text-[11px] font-black truncate max-w-[150px]">{project?.name || 'مشروع غير معروف'}</span>
            </div>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
          isExpiringSoon ? 'bg-rose-100 text-rose-600' :
          spr.status === 'ACTIVE' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 
          spr.status === 'CLOSED' ? 'bg-slate-200 text-slate-600 dark:bg-slate-700' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
        }`}>
          {isExpiringSoon ? 'عاجل: يوشك على الانتهاء' : spr.status === 'ACTIVE' ? 'نشط الآن' : spr.status === 'CLOSED' ? 'مؤرشف' : 'قيد التخطيط'}
        </div>
      </div>

      {spr.status === 'ACTIVE' && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between ${isExpiringSoon ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
           <div className="flex items-center gap-2">
             <Clock size={16} />
             <span className="text-xs font-black">الوقت المتبقي:</span>
           </div>
           <span className="text-sm font-black">{daysLeft > 0 ? `${daysLeft} أيام` : daysLeft === 0 ? 'ينتهي اليوم!' : 'متأخر'}</span>
        </div>
      )}

      {/* Extensions history archive */}
      {spr.extensions && spr.extensions.length > 0 && (
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="mb-4 flex items-center gap-2 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 rounded-lg w-fit hover:bg-amber-100 transition-colors border border-amber-100"
        >
          <History size={12} />
          أرشيف التمديد ({spr.extensions.length})
          {showHistory ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      )}

      {showHistory && spr.extensions && (
        <div className="mb-6 space-y-3 p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl animate-in slide-in-from-top-2 duration-300 border border-slate-200 dark:border-slate-700">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">سجل التمديدات المؤرشفة</p>
          {spr.extensions.map(ext => (
            <div key={ext.id} className="text-[10px] space-y-1 relative pr-3 border-r-2 border-amber-300">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>تم التمديد إلى {ext.newEndDate}</span>
                <span className="text-[8px] opacity-60 tabular-nums">{ext.extendedAt.split('T')[0]}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 italic">السبب الموثق: {ext.reason}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
        <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-widest">تاريخ البدء</p>
          <p className="text-xs font-black text-slate-700 dark:text-slate-300 tabular-nums">{spr.startDate}</p>
        </div>
        <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-widest">تاريخ الانتهاء</p>
          <p className="text-xs font-black text-slate-700 dark:text-slate-300 tabular-nums">{spr.endDate}</p>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
        {isManager && (
          <>
            {spr.status === 'PLANNED' && (
              <button 
                onClick={() => onStatusChange(spr.id, 'ACTIVE')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-md transition-all active:scale-95"
              >
                <Play size={14} /> تفعيل السبرنت
              </button>
            )}
            
            {/* التمديد حصراً للمدير العام (ADMIN) */}
            {(spr.status === 'ACTIVE') && isAdmin && (
              <button 
                onClick={() => onReschedule(spr)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl text-xs font-black hover:bg-amber-600 shadow-md transition-all active:scale-95"
              >
                <Calendar size={14} /> تمديد (مدير عام)
              </button>
            )}
            
            {spr.status === 'ACTIVE' && (
              <button 
                onClick={() => onStatusChange(spr.id, 'CLOSED')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white rounded-xl text-xs font-black hover:bg-rose-700 shadow-md transition-all active:scale-95"
              >
                <Lock size={14} /> إنهاء الدورة
              </button>
            )}
            
            {spr.status === 'CLOSED' && isAdmin && (
              <button 
                onClick={() => onStatusChange(spr.id, 'ACTIVE')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                <RefreshCcw size={14} /> إعادة فتح
              </button>
            )}

            <button 
              onClick={() => onDelete(spr.id)}
              className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
            >
              <X size={18} />
            </button>
          </>
        )}
        
        {!isManager && (
          <div className="w-full text-center py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            {spr.status === 'ACTIVE' ? 'جاري العمل حالياً' : spr.status === 'CLOSED' ? 'سجل مؤرشف' : 'مخطط مستقبلي'}
          </div>
        )}
      </div>
    </div>
  );
};

const SprintManager: React.FC<SprintManagerProps> = ({ projects, sprints, setSprints, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Sprint | null>(null);
  
  const isManager = currentUser.role === Role.ADMIN || currentUser.role === Role.DEPT_MANAGER;
  const isAdmin = currentUser.role === Role.ADMIN;

  const handleStatusChange = (id: string, newStatus: 'ACTIVE' | 'PLANNED' | 'CLOSED') => {
    setSprints(prev => prev.map(spr => {
      if (spr.id === id) {
        return { ...spr, status: newStatus };
      }
      return spr;
    }));
  };

  const handleAddNewSprint = (newSprint: Sprint) => {
    setSprints(prev => [newSprint, ...prev]);
  };

  const handleDeleteSprint = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السبرنت؟')) {
      setSprints(prev => prev.filter(spr => spr.id !== id));
    }
  };

  const handleReschedule = (newEndDate: string, reason: string) => {
    if (!rescheduleTarget) return;

    const extension: SprintExtension = {
      id: `ext-${Date.now()}`,
      oldEndDate: rescheduleTarget.endDate,
      newEndDate,
      reason,
      extendedAt: new Date().toISOString(),
      extendedBy: currentUser.id
    };

    setSprints(prev => prev.map(spr => {
      if (spr.id === rescheduleTarget.id) {
        return {
          ...spr,
          endDate: newEndDate,
          extensions: [...(spr.extensions || []), extension]
        };
      }
      return spr;
    }));
    setRescheduleTarget(null);
  };

  const getDaysRemaining = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = end.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">إدارة السبرنتات (Agile)</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">نظام دورات العمل المكثفة لتحقيق الأهداف الهندسية السريعة</p>
        </div>
        {isManager && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus size={18} /> سبرنت جديد
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sprints.map(spr => (
          <SprintCard 
            key={spr.id}
            spr={spr}
            projects={projects}
            isAdmin={isAdmin}
            isManager={isManager}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteSprint}
            onReschedule={setRescheduleTarget}
            getDaysRemaining={getDaysRemaining}
          />
        ))}

        {sprints.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-white dark:bg-slate-900/50">
             <Zap size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
             <h4 className="text-lg font-bold text-slate-400">لا توجد سبرنتات نشطة أو مخططة</h4>
             {isManager && (
               <button onClick={() => setIsModalOpen(true)} className="mt-4 text-blue-600 font-bold text-sm hover:underline">أضف أول سبرنت الآن</button>
             )}
          </div>
        )}
      </div>

      <NewSprintModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddNewSprint}
        projects={projects}
      />

      {rescheduleTarget && (
        <RescheduleModal 
          isOpen={!!rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onConfirm={handleReschedule}
          sprint={rescheduleTarget}
        />
      )}
    </div>
  );
};

export default SprintManager;
