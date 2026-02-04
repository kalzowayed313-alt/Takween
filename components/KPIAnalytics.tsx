
import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Target, BrainCircuit, Sparkles, User, ChevronDown } from 'lucide-react';
import { Task, Employee } from '../types';
import { DEPARTMENTS } from '../constants';
import { analyzePerformance } from '../services/geminiService';

interface KPIAnalyticsProps {
  employees: Employee[];
  tasks: Task[];
}

const KPIAnalytics: React.FC<KPIAnalyticsProps> = ({ employees, tasks }) => {
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedEmployee = useMemo(() => employees.find(e => e.id === selectedEmpId) || employees[0], [selectedEmpId, employees]);
  const empTasks = useMemo(() => tasks.filter(t => t.assignedTo === selectedEmpId), [selectedEmpId, tasks]);

  const handleAiAnalysis = async () => {
    setIsLoading(true);
    const analysis = await analyzePerformance(selectedEmployee, empTasks);
    setAiReport(analysis);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">تحليلات الأداء والـ KPI</h2>
          <p className="text-slate-500 text-sm">تقارير دقيقة ومؤشرات أداء هندسية مدعومة بالذكاء الاصطناعي</p>
        </div>
        
        {/* Simplified Employee Selector */}
        <div className="relative group min-w-[280px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block mr-2">اختر الموظف للتحليل</label>
          <div className="relative">
            <select 
              value={selectedEmpId} 
              onChange={(e) => { setSelectedEmpId(e.target.value); setAiReport(null); }}
              className="w-full appearance-none bg-white border border-slate-200 rounded-2xl px-12 py-3.5 text-sm font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.kpi}%)</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-blue-600">
              <User size={18} />
            </div>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Employee Performance Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-5 mb-8">
              <img src={selectedEmployee.avatar} className="w-20 h-20 rounded-2xl ring-4 ring-blue-50 shadow-md object-cover" alt="" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{selectedEmployee.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {DEPARTMENTS.find(d => d.id === selectedEmployee.departmentId)?.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">منذ {selectedEmployee.joinedDate.split('-')[0]}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-emerald-600 font-bold uppercase">درجة الإنتاجية</p>
                  <Trophy size={16} className="text-emerald-500" />
                </div>
                <p className="text-3xl font-black text-emerald-700">{selectedEmployee.kpi}%</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-blue-600 font-bold uppercase">إجمالي المهام</p>
                  <Target size={16} className="text-blue-500" />
                </div>
                <p className="text-3xl font-black text-blue-700">{empTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 bg-slate-50/50 rounded-2xl border border-slate-100 p-4 min-h-[250px]">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">توزيع المهارات الفنية</h4>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                {subject:'السرعة',A:80},
                {subject:'الجودة',A:90},
                {subject:'التعاون',A:70},
                {subject:'الالتزام',A:95},
                {subject:'الإبداع',A:85}
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fontSize:10, fontWeight: 'bold', fill: '#64748b'}} />
                <Radar name="Performance" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group min-h-[300px] flex items-center">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner">
                  <Sparkles size={28} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">تحليل الأداء الذكي (Gemini AI)</h3>
                  <p className="text-blue-100 text-sm font-medium">نظام متقدم لمراجعة السلوك المهني والنتائج</p>
                </div>
              </div>
              
              {!aiReport && (
                <button 
                  onClick={handleAiAnalysis} 
                  disabled={isLoading} 
                  className="bg-white text-indigo-700 px-10 py-4 rounded-2xl font-black shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-3 border-indigo-700/30 border-t-indigo-700 rounded-full animate-spin"></div>
                  ) : (
                    <BrainCircuit size={20} className="group-hover:rotate-12 transition-transform" />
                  )}
                  {isLoading ? 'جاري التحليل...' : 'توليد تقرير الأداء'}
                </button>
              )}
            </div>

            {aiReport ? (
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-base leading-relaxed whitespace-pre-wrap font-medium text-white/95">
                  {aiReport}
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-white/50 italic">تم إنشاء هذا التقرير بناءً على بيانات المهام المنجزة والـ KPI للموظف.</span>
                  <button onClick={() => setAiReport(null)} className="text-xs font-black text-white hover:text-blue-200 underline transition-colors">إعادة التحليل</button>
                </div>
              </div>
            ) : !isLoading && (
              <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-[2rem] bg-white/5">
                <p className="text-blue-100 font-bold mb-2">جاهز لتحليل بيانات {selectedEmployee.name}</p>
                <p className="text-xs text-white/40">سيتم استخدام محرك Gemini 3.0 لتحليل نقاط القوة والضعف للموظف</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIAnalytics;
