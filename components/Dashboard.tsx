
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Users, CheckSquare, TrendingUp, Calendar, Building2, Clock, ArrowLeft, 
  Trophy, Star, Sparkles, Award, AlertCircle, Zap, BrainCircuit, ArrowUpRight, 
  ChevronLeft, Timer
} from 'lucide-react';
import { Task, Employee, TaskStatus, TaskPriority } from '../types';
import { DEPARTMENTS, MOCK_PROJECTS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  tasks: Task[];
  employees: Employee[];
  onTaskClick: (task: Task) => void;
}

// مكون الرسم البياني المصغر للبطاقات
const MiniSparkline = ({ data, color }: { data: any[], color: string }) => (
  <div className="h-10 w-20 opacity-50">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, trend, sparkData, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group relative overflow-hidden"
  >
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <MiniSparkline data={sparkData} color={color.includes('blue') ? '#2563eb' : color.includes('emerald') ? '#10b981' : '#f59e0b'} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-2">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>
        {trend && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <ArrowUpRight size={10} className={trend < 0 ? 'rotate-90' : ''} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black mt-1 text-slate-800 dark:text-white tabular-nums">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ tasks, employees, onTaskClick }) => {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // بيانات تجريبية للمخططات المصغرة
  const mockSparkData = [
    { value: 400 }, { value: 300 }, { value: 500 }, { value: 450 }, { value: 600 }, { value: 550 }, { value: 700 }
  ];

  const companyStats = useMemo(() => {
    const total = tasks.length || 1;
    const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const overdue = tasks.filter(t => t.status !== TaskStatus.COMPLETED && new Date(t.dueDate) < new Date()).length;
    const productivity = Math.round((completed / total) * 100);
    
    return { productivity, overdue, total, completed };
  }, [tasks]);

  const loadBalanceData = useMemo(() => {
    return DEPARTMENTS.map(dept => {
      const deptTasks = tasks.filter(t => t.departmentId === dept.id).length;
      const deptEmps = employees.filter(e => e.departmentId === dept.id).length;
      // حساب العبء: المهام لكل موظف
      const loadFactor = deptEmps > 0 ? (deptTasks / deptEmps).toFixed(1) : 0;
      return {
        name: dept.name.split(' ')[1] || dept.name,
        tasks: deptTasks,
        staff: deptEmps,
        load: parseFloat(loadFactor as string) * 10 // مقياس للرسم البياني
      };
    });
  }, [tasks, employees]);

  const criticalTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== TaskStatus.COMPLETED)
      .sort((a, b) => {
        if (a.priority === TaskPriority.HIGH) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 4);
  }, [tasks]);

  const generateAiInsight = async () => {
    setIsAiLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `حلل بيانات الشركة الهندسية التالية وقدم ملخصاً إدارياً ذكياً في 3 جمل فقط باللغة العربية:
        - الإنتاجية الكلية: ${companyStats.productivity}%
        - المهام المتأخرة: ${companyStats.overdue}
        - الأقسام الأكثر ضغطاً: ${loadBalanceData.sort((a,b) => b.load - a.load)[0].name}
        - عدد الموظفين: ${employees.length}`,
        config: {
          systemInstruction: "أنت مستشار إداري خبير. حلل البيانات بذكاء وقدم نصيحة استراتيجية للنمو.",
        }
      });
      setAiInsight(response.text);
    } catch (e) {
      setAiInsight("الوضع التشغيلي مستقر حالياً، يرجى التركيز على المهام المتأخرة لرفع معدل الـ KPI العام.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Dynamic Header & Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={20} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white">نظرة عامة على الإنجاز</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">مرحباً بك، تظهر البيانات نمو الإنتاجية بنسبة 4.2% هذا الأسبوع.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={generateAiInsight}
            disabled={isAiLoading}
            className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-5 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800 font-black text-xs hover:bg-indigo-100 transition-all active:scale-95 shadow-sm"
          >
            {isAiLoading ? <RefreshCw className="animate-spin" size={16} /> : <BrainCircuit size={18} />}
            تحليل Gemini الذكي
          </button>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <Timer size={18} className="text-blue-500" />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300">نظام تكوين v2.8 • نشط</span>
          </div>
        </div>
      </div>

      {/* AI Insight Panel */}
      {aiInsight && (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex items-start gap-5">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20"><Sparkles size={24} /></div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-widest opacity-80">توصية المستشار الذكي</h4>
              <p className="text-base font-bold leading-relaxed">{aiInsight}</p>
            </div>
            <button onClick={() => setAiInsight(null)} className="mr-auto opacity-60 hover:opacity-100"><X size={20} /></button>
          </div>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="الإنتاجية الكلية" 
          value={`${companyStats.productivity}%`} 
          icon={TrendingUp} 
          color="bg-blue-600" 
          trend={2.4}
          sparkData={mockSparkData}
          onClick={() => navigate('/analytics')}
        />
        <StatCard 
          label="الموظفين النشطين" 
          value={employees.length} 
          icon={Users} 
          color="bg-indigo-600" 
          trend={1.2}
          sparkData={mockSparkData.reverse()}
          onClick={() => navigate('/employees')}
        />
        <StatCard 
          label="مهام عاجلة" 
          value={criticalTasks.length} 
          icon={AlertCircle} 
          color="bg-rose-500" 
          trend={-5}
          sparkData={mockSparkData}
          onClick={() => navigate('/tasks')}
        />
        <StatCard 
          label="أقسام الشركة" 
          value={DEPARTMENTS.length} 
          icon={Building2} 
          color="bg-emerald-600" 
          sparkData={mockSparkData}
          onClick={() => navigate('/departments')}
        />
      </div>

      {/* Middle Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Load Balance Chart (Advanced) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <BarChart3 size={22} className="text-blue-600" /> توازن عبء العمل الهندسي
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1">مقارنة القوى البشرية مقابل المهام المسندة</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div><span className="text-[10px] font-black text-slate-400 uppercase">المهام</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div><span className="text-[10px] font-black text-slate-400 uppercase">الموظفين</span></div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={loadBalanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={35} />
                <Bar dataKey="staff" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={20} className="dark:fill-slate-700" />
                <Line type="monotone" dataKey="load" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6'}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Alerts Sidebar */}
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-8 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black flex items-center gap-2">
                <AlertCircle className="text-rose-500" size={20} /> أولويات تستوجب التدخل
              </h3>
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{criticalTasks.length}</span>
            </div>

            <div className="space-y-4">
              {criticalTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => onTaskClick(task)}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold group-hover:text-blue-400 transition-colors line-clamp-1">{task.title}</p>
                    <span className="text-[9px] font-black text-rose-400 uppercase tracking-tighter">عاجل</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                     <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>تنتهي في {task.dueDate}</span>
                     </div>
                     <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/10 text-center">
              <button 
                onClick={() => navigate('/tasks')}
                className="text-xs font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 w-full"
              >
                فتح لوحة Kanban كاملة <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Momentum Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">زخم المشاريع الهندسية</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">متابعة دقيقة لنبض التنفيذ في المشاريع الكبرى</p>
          </div>
          <Link to="/projects" className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">إدارة المحفظة</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {MOCK_PROJECTS.slice(0, 3).map(proj => (
            <div key={proj.id} className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-black text-slate-700 dark:text-slate-200">{proj.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{proj.client}</p>
                </div>
                <span className="text-2xl font-black text-blue-600 tabular-nums">{proj.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                  style={{ width: `${proj.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>تاريخ التسليم: {proj.deadline}</span>
                <div className="flex items-center gap-1 text-emerald-600">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                   نشط الآن
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

const X = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const RefreshCw = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);
const BarChart3 = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20V14"></path></svg>
);

export default Dashboard;
