
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, CheckSquare, TrendingUp, Calendar, Building2, Clock, ArrowLeft, Trophy, Star, Sparkles, Award
} from 'lucide-react';
import { Task, Employee, TaskStatus } from '../types';
import { DEPARTMENTS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardProps {
  tasks: Task[];
  employees: Employee[];
  onTaskClick: (task: Task) => void;
}

const StatCard = ({ label, value, icon: Icon, color, trend, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
    <p className="text-2xl font-black mt-1 text-slate-800 dark:text-white">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ tasks, employees, onTaskClick }) => {
  const navigate = useNavigate();
  
  const is30th = useMemo(() => new Date().getDate() === 30, []);

  const topEmployee = useMemo(() => {
    return [...employees].sort((a, b) => b.kpi - a.kpi)[0];
  }, [employees]);

  const topDept = useMemo(() => {
    const deptPerformances = DEPARTMENTS.map(dept => {
      const members = employees.filter(e => e.departmentId === dept.id);
      const avgKpi = members.length > 0 ? members.reduce((sum, e) => sum + e.kpi, 0) / members.length : 0;
      return { ...dept, avgKpi: parseFloat(avgKpi.toFixed(1)) };
    });
    return [...deptPerformances].sort((a, b) => b.avgKpi - a.avgKpi)[0];
  }, [employees]);

  const deptStats = useMemo(() => {
    return DEPARTMENTS.map(d => ({
      name: d.name,
      tasks: tasks.filter(t => t.departmentId === d.id).length,
      employees: employees.filter(e => e.departmentId === d.id).length
    }));
  }, [tasks, employees]);

  const taskStats = useMemo(() => [
    { name: 'جديد', value: tasks.filter(t => t.status === TaskStatus.NEW).length, color: '#3b82f6' },
    { name: 'قيد التنفيذ', value: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length, color: '#f59e0b' },
    { name: 'المراجعة', value: tasks.filter(t => t.status === TaskStatus.REVIEW).length, color: '#8b5cf6' },
    { name: 'مكتمل', value: tasks.filter(t => t.status === TaskStatus.COMPLETED).length, color: '#10b981' }
  ], [tasks]);

  const recentTasks = useMemo(() => [...tasks].reverse().slice(0, 5), [tasks]);

  const avgKpi = useMemo(() => {
    if (employees.length === 0) return 0;
    return (employees.reduce((acc, emp) => acc + emp.kpi, 0) / employees.length).toFixed(1);
  }, [employees]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">لوحة القيادة المركزية</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">مرحباً بك مجدداً في نظام تكوين الهندسي</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <Calendar size={18} className="text-blue-500" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">تحديثات الشركة المباشرة</span>
        </div>
      </div>

      {/* Monthly Celebration Highlights - Visible only on the 30th */}
      {is30th && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Employee of the Month */}
          {topEmployee && (
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 p-1 rounded-[2.5rem] shadow-xl">
              <div className="bg-white dark:bg-slate-900 rounded-[2.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 dark:bg-amber-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="relative">
                    <img src={topEmployee.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-400 shadow-lg" />
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-lg shadow-md"><Trophy size={16} /></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">موظف الشهر</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{topEmployee.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">KPI: {topEmployee.kpi}%</p>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center relative z-10">
                  <p className="text-amber-700 dark:text-amber-400 font-black text-xs italic">"شكراً لك ولجهودك العظيمة"</p>
                </div>
              </div>
            </div>
          )}

          {/* Department of the Month */}
          {topDept && (
            <div className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 p-1 rounded-[2.5rem] shadow-xl">
              <div className="bg-white dark:bg-slate-900 rounded-[2.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-100 dark:border-emerald-800">
                    <Award size={40} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">قسم الشهر المتميز</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{topDept.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">متوسط KPI: {topDept.avgKpi}%</p>
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center relative z-10">
                  <p className="text-emerald-700 dark:text-emerald-400 font-black text-xs italic">"فريق واحد.. إنجاز استثنائي"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="إجمالي الموظفين" 
          value={employees.length} 
          icon={Users} 
          color="bg-blue-600" 
          trend={5}
          onClick={() => navigate('/employees')}
        />
        <StatCard 
          label="المهام المفتوحة" 
          value={tasks.filter(t => t.status !== TaskStatus.COMPLETED).length} 
          icon={CheckSquare} 
          color="bg-amber-500" 
          onClick={() => navigate('/tasks')}
        />
        <StatCard 
          label="متوسط الـ KPI" 
          value={`${avgKpi}%`} 
          icon={TrendingUp} 
          color="bg-emerald-600" 
          trend={1.2}
          onClick={() => navigate('/analytics')}
        />
        <StatCard 
          label="أقسام الشركة" 
          value={DEPARTMENTS.length} 
          icon={Building2} 
          color="bg-purple-600" 
          onClick={() => navigate('/departments')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Building2 size={18} className="text-blue-500" /> توزيع المهام حسب القسم
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptStats} layout="vertical" margin={{ right: 30, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:opacity-10" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-amber-500" /> أحدث المهام المُسندة
              </h3>
              <Link to="/tasks" className="text-blue-600 dark:text-blue-400 text-[10px] font-black hover:underline flex items-center gap-1 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors">
                عرض الكل في Kanban <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentTasks.map(task => {
                const assignee = employees.find(e => e.id === task.assignedTo);
                return (
                  <div 
                    key={task.id} 
                    onClick={() => onTaskClick(task)}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg rounded-2xl border border-slate-100 dark:border-slate-700 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={assignee?.avatar} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-white dark:ring-slate-600 shadow-sm" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">مسندة إلى: {assignee?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-lg border ${
                        task.status === TaskStatus.COMPLETED ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 
                        task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-fit sticky top-24">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">مخطط حالة المهام</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={taskStats} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {taskStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {taskStats.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-800 dark:text-white">{item.value}</span>
                  <span className="text-[10px] text-slate-300 dark:text-slate-600 font-bold">مهام</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200 text-center">
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">الإنتاجية الكلية</p>
            <p className="text-2xl font-black">{(taskStats.find(s => s.name === 'مكتمل')?.value || 0) / (tasks.length || 1) * 100}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
