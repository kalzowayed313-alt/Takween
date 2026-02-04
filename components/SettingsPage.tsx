
import React, { useState } from 'react';
import { Employee, Role, KpiRule } from '../types';
import { 
  User, Bell, Save, CheckCircle2, Shield, Palette, 
  Briefcase, Globe, Moon, Sun, Camera, Lock, Key, Award, Cpu,
  X, Target, Plus, Trash2, ListChecks
} from 'lucide-react';

interface SettingsPageProps {
  currentUser: Employee;
  onUpdateUser: (data: Partial<Employee>) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  kpiRules: KpiRule[];
  setKpiRules: React.Dispatch<React.SetStateAction<KpiRule[]>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateUser, isDarkMode, setIsDarkMode, kpiRules, setKpiRules }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'professional' | 'security' | 'appearance' | 'kpi'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState('');
  
  const [newRule, setNewRule] = useState({ title: '', category: 'عام', points: 20, hours: 2 });
  const isAdmin = currentUser.role === Role.ADMIN;

  const handleSave = () => {
    setIsSaving(true);
    onUpdateUser({ name });
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const addKpiRule = () => {
    if (!newRule.title.trim()) return;
    const rule: KpiRule = {
      id: `rule-${Date.now()}`,
      title: newRule.title,
      category: newRule.category,
      defaultPoints: newRule.points,
      defaultHours: newRule.hours
    };
    setKpiRules([...kpiRules, rule]);
    setNewRule({ title: '', category: 'عام', points: 20, hours: 2 });
  };

  const deleteKpiRule = (id: string) => {
    setKpiRules(kpiRules.filter(r => r.id !== id));
  };

  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 w-full text-right transition-all duration-300 border-l-4 ${
        activeTab === id 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-600 font-bold' 
        : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
            <span className="font-bold text-base">تم حفظ التغييرات بنجاح وتحديث النظام!</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">إعدادات النظام</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">تحكم في هويتك المهنية وتفضيلات بيئة عملك في تكوين</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <Award size={16} className="text-amber-500" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">عضوية ذهبية • المستوى {currentUser.kpi > 90 ? 'الخبير' : 'المتقدم'}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <aside className="w-full md:w-72 bg-slate-50/50 dark:bg-slate-950/50 border-l border-slate-100 dark:border-slate-800 pt-8">
          <div className="px-6 mb-8 text-center">
            <div className="relative inline-block group">
              <img src={currentUser.avatar} className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-lg mx-auto mb-4 transition-transform group-hover:scale-105" alt="" />
              <button className="absolute -bottom-1 -left-1 p-2 bg-blue-600 text-white rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={14} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">{currentUser.name}</h3>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{currentUser.role}</p>
          </div>
          
          <nav className="space-y-1">
            <TabButton id="profile" icon={User} label="الملف الشخصي" />
            <TabButton id="professional" icon={Briefcase} label="المعلومات المهنية" />
            <TabButton id="security" icon={Shield} label="الأمان والخصوصية" />
            <TabButton id="appearance" icon={Palette} label="المظهر والأداء" />
            {isAdmin && <TabButton id="kpi" icon={Target} label="سياسة الـ KPI (مدير عام)" />}
          </nav>
        </aside>

        <main className="flex-1 p-10 overflow-y-auto bg-white dark:bg-slate-900">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                <User size={24} className="text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">المعلومات الأساسية</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1">الاسم بالكامل</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700 dark:text-slate-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1">البريد المهني</label>
                  <input type="email" defaultValue={currentUser.email} disabled className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-400 dark:text-slate-500 cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kpi' && isAdmin && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                <Target size={24} className="text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">سياسة احتساب الـ KPI والمعايير</h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 space-y-6">
                 <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Plus size={18} className="text-blue-600" /> تعريف قالب مهمة جديد
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">اسم المهمة المعياري</label>
                      <input 
                        type="text" 
                        placeholder="مثلاً: مراجعة مخطط إنشائي"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                        value={newRule.title}
                        onChange={e => setNewRule({...newRule, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">التصنيف</label>
                      <input 
                        type="text" 
                        placeholder="مثلاً: هندسة، تصميم، إدارة"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                        value={newRule.category}
                        onChange={e => setNewRule({...newRule, category: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">النقاط (KPI Points)</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black outline-none"
                        value={newRule.points}
                        onChange={e => setNewRule({...newRule, points: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">الوقت المعياري (ساعات)</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black outline-none"
                        value={newRule.hours}
                        onChange={e => setNewRule({...newRule, hours: parseInt(e.target.value)})}
                      />
                    </div>
                 </div>
                 <button 
                  onClick={addKpiRule}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                 >
                   إضافة لسياسة الشركة
                 </button>
              </div>

              <div className="space-y-4">
                 <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <ListChecks size={18} className="text-blue-600" /> القوالب المعتمدة حالياً
                 </h4>
                 <div className="grid grid-cols-1 gap-3">
                    {kpiRules.map(rule => (
                      <div key={rule.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                             <Target size={20} />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-800 dark:text-white">{rule.title}</p>
                              <div className="flex gap-3 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rule.category}</span>
                                <span className="text-[10px] font-black text-emerald-600">النقاط: {rule.defaultPoints}</span>
                                <span className="text-[10px] font-black text-blue-600">الزمن: {rule.defaultHours}س</span>
                              </div>
                           </div>
                        </div>
                        <button 
                          onClick={() => deleteKpiRule(rule.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-6">
                <Palette size={24} className="text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">المظهر واللغة</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mr-1">نمط المظهر</label>
                  <div className="flex gap-4">
                    <button onClick={() => setIsDarkMode(false)} className={`flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${!isDarkMode ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100'}`}>
                      <Sun size={24} className={!isDarkMode ? 'text-blue-600' : 'text-slate-400'} />
                      <span className={`text-xs font-bold ${!isDarkMode ? 'text-blue-600' : 'text-slate-500'}`}>الوضع النهاري</span>
                    </button>
                    <button onClick={() => setIsDarkMode(true)} className={`flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${isDarkMode ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100'}`}>
                      <Moon size={24} className={isDarkMode ? 'text-blue-600' : 'text-slate-400'} />
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-blue-600' : 'text-slate-500'}`}>الوضع الليلي</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`bg-blue-600 text-white px-12 py-5 rounded-2xl font-black shadow-2xl hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 ${isSaving ? 'animate-pulse' : ''}`}
            >
              <Save size={24} /> 
              {isSaving ? 'جاري حفظ البيانات...' : 'حفظ كافة التغييرات'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
