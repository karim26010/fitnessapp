import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Droplets, Flame, Activity, Moon, Plus, Minus, ArrowUpRight, PlusCircle, TrendingUp } from 'lucide-react';
import { DashboardData } from '../types';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface DashboardProps {
  data: DashboardData;
  updateWater: (amount: number, isTotal?: boolean) => void;
  logNutrition: (data: { calories: number; protein: number; carbs: number; fat: number }) => Promise<void>;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, updateWater, logNutrition }) => {
  const [manualWater, setManualWater] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logData, setLogData] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [isLogging, setIsLogging] = useState(false);

  const { analytics, graph_series } = data;

  // Process data for charts
  const weightChartData = graph_series.weight.labels.map((label, index) => ({
    name: label.split('-').slice(1).join('/'), // Format "MM/DD"
    value: graph_series.weight.data[index] ?? null
  }));

  // Prepare Macro Data with Magical Theme Colors
  const macroData = [
    { name: 'Protein', value: analytics.nutrition_status.protein.current || 0, color: '#8b5cf6' }, // Violet
    { name: 'Carbs', value: analytics.nutrition_status.carbs.current || 0, color: '#06b6d4' }, // Cyan
    { name: 'Fats', value: analytics.nutrition_status.fat.current || 0, color: '#ec4899' },   // Pink
  ];
  // If all are 0, add a placeholder
  if (macroData.every(m => m.value === 0)) {
    macroData.push({ name: 'Remaining', value: 1, color: '#334155' });
  }

  const bmiValue = analytics.bmi;
  let bmiCategory = 'Normal';
  let bmiColor = 'text-primary-400';
  let bmiGradient = 'from-primary-400 to-primary-600';

  if (bmiValue < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'text-cyan-400'; bmiGradient = 'from-cyan-400 to-cyan-600'; }
  else if (bmiValue >= 25 && bmiValue < 30) { bmiCategory = 'Overweight'; bmiColor = 'text-fuchsia-400'; bmiGradient = 'from-fuchsia-400 to-fuchsia-600'; }
  else if (bmiValue >= 30) { bmiCategory = 'Obese'; bmiColor = 'text-red-400'; bmiGradient = 'from-red-400 to-red-600'; }

  const waterCurrent = analytics.water_status.today || 0;
  const waterTarget = analytics.water_status.target || 2000;
  const waterPercentage = Math.min((waterCurrent / waterTarget) * 100, 100);

  const handleManualAddWater = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(manualWater);
    if (amount && amount > 0) {
      updateWater(amount);
      setManualWater('');
    }
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    await logNutrition({
      calories: Number(logData.calories) || 0,
      protein: Number(logData.protein) || 0,
      carbs: Number(logData.carbs) || 0,
      fat: Number(logData.fat) || 0
    });
    setIsLogging(false);
    setIsLogModalOpen(false);
    setLogData({ calories: '', protein: '', carbs: '', fat: '' });
  };

  return (
    <div className="space-y-6 animate-slide-up pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-slate-400 mt-1 text-base md:text-lg">Your daily health intelligence</p>
        </div>
        <div className="glass-card px-4 py-2 rounded-xl flex items-center space-x-3 w-fit">
          <span className="text-sm text-slate-300">Today's Focus</span>
          <span className="text-xs font-bold text-primary-300 bg-primary-500/20 border border-primary-500/30 px-3 py-1 rounded-lg uppercase tracking-wider">
            Cardio & Hydration
          </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Calories Card (Theme: Pink/Fuchsia) - Removed Background Emoji */}
        <div className="glass-card p-4 md:p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div className="p-3 bg-pink-500/20 rounded-2xl border border-pink-500/20 shadow-inner shadow-pink-500/10">
              <Flame className="text-pink-400" size={24} />
            </div>
            {analytics.nutrition_status.calories.percent > 0 && (
              <span className="flex items-center text-xs font-bold text-pink-300 bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/10">
                {analytics.nutrition_status.calories.percent?.toFixed(0)}% <ArrowUpRight size={12} className="ml-1" />
              </span>
            )}
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Calories Consumed</h3>
            <div className="flex items-baseline mt-2 flex-wrap">
              <span className="text-3xl md:text-4xl font-bold text-white">{analytics.nutrition_status.calories.current}</span>
              <span className="text-xs md:text-sm text-slate-500 ml-2 font-medium whitespace-nowrap">/ {analytics.nutrition_status.calories.target} kcal</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-700/50 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                style={{ width: `${Math.min(analytics.nutrition_status.calories.percent || 0, 100)}%` }}
              />
            </div>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="mt-4 w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-sm font-semibold transition-colors border border-pink-500/20"
            >
              <PlusCircle size={16} />
              <span>Log Meal</span>
            </button>
          </div>
        </div>

        {/* BMI Card (Theme: Primary/Violet) */}
        <div className="glass-card p-4 md:p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div className="p-3 bg-primary-500/20 rounded-2xl border border-primary-500/20 shadow-inner shadow-primary-500/10">
              <Activity className="text-primary-400" size={24} />
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border bg-opacity-20 ${bmiColor} border-current`}>
              {bmiCategory}
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">BMI Score</h3>
            <p className="text-3xl md:text-4xl font-bold text-white mt-2">{bmiValue}</p>
            <p className="text-xs text-slate-500 mt-2">Target: 22.0</p>
          </div>
          {/* Decorative blurred circle */}
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${bmiGradient} rounded-full blur-2xl opacity-20`}></div>
        </div>

        {/* Sleep Card (Theme: Cyan/Blue) */}
        <div className="glass-card p-4 md:p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/20 shadow-inner shadow-cyan-500/10">
              <Moon className="text-cyan-400" size={24} />
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-white">{analytics.sleep_status.today}<span className="text-sm text-slate-400 font-normal">h</span></span>
              <span className="text-xs text-cyan-300">Last Night</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Sleep Goal</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xl font-bold text-slate-200">{analytics.sleep_status.target} <span className="text-sm font-normal text-slate-500">hours</span></p>
              <div className="flex space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-6 rounded-full ${i < (analytics.sleep_status.today || 0) ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-slate-700/50'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Hydration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weight Chart */}
        <div className="lg:col-span-2 glass-card p-4 md:p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-primary-400" size={20} />
                Weight Trends
              </h3>
              <p className="text-xs text-slate-400 mt-1">Target: {analytics.weight_status.target}kg • Current: {analytics.weight_status.current}kg</p>
            </div>
            <select className="bg-white/5 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-primary-500/50 self-end md:self-auto">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightChartData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#8b5cf6' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorWeight)"
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hydration Panel - Advanced Glass */}
        <div className="glass-card p-0 rounded-3xl overflow-hidden flex flex-col relative">
          <div className="p-4 md:p-6 pb-0 z-10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Droplets className="text-cyan-400" size={20} />
                Hydration
              </h3>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
                {Math.round(waterPercentage)}%
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative py-6">
            {/* Glowing backing for bottle */}
            <div className="absolute w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>

            <div className="flex items-center gap-6 z-10">
              {/* Bottle Visualization */}
              <div className="relative w-24 h-40 md:w-28 md:h-48 bg-slate-800/30 rounded-[2rem] border-2 border-white/10 backdrop-blur-sm overflow-hidden shadow-2xl">
                {/* Water Liquid */}
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 ease-out opacity-90"
                  style={{ height: `${waterPercentage}%` }}
                >
                  {/* Bubbles / Surface Effect */}
                  <div className="absolute top-0 w-full h-1 bg-white/30"></div>
                  <div className="absolute w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
                </div>
                {/* Glass Reflections */}
                <div className="absolute top-4 right-4 w-2 h-12 bg-white/10 rounded-full blur-[1px]"></div>
              </div>

              <div className="text-left">
                <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  {(waterCurrent / 1000).toFixed(1)}
                  <span className="text-lg text-slate-400 font-medium ml-1">L</span>
                </p>
                <p className="text-sm text-slate-400 mt-1">Goal: {(waterTarget / 1000).toFixed(1)}L</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 md:p-6 bg-black/20 backdrop-blur-md border-t border-white/5 space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => updateWater(250)}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-cyan-900/40 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Plus size={18} /> 250ml
              </button>
              <button
                onClick={() => updateWater(-250)}
                className="px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors"
              >
                <Minus size={18} />
              </button>
            </div>

            <form onSubmit={handleManualAddWater} className="relative group">
              <input
                type="number"
                placeholder="Custom ml..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all"
                value={manualWater}
                onChange={(e) => setManualWater(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white p-1.5 rounded-lg transition-all"
              >
                <PlusCircle size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-4 md:p-6 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 md:mb-6">Macro Distribution</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around h-auto sm:h-48 gap-6 sm:gap-0">
            <div className="w-full sm:w-[45%] h-48 sm:h-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(8px)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:flex-1 space-y-3 sm:pl-4">
              {macroData.filter(m => m.name !== 'Remaining').map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}></div>
                    <span className="text-sm text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-0 rounded-3xl border border-primary-500/30 relative overflow-hidden flex flex-col justify-center min-h-[250px]">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-purple-900/20"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl"></div>

          <div className="relative z-10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider">AI INSIGHT</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Daily Summary</h3>
            <p className="text-indigo-100/80 text-sm leading-relaxed mb-6 font-light">
              {analytics.nutrition_status.calories.current === 0
                ? "You haven't logged any meals today. Start tracking to get personalized insights! Hydration is on point, keep it up."
                : `Your protein intake is ${analytics.nutrition_status.protein.percent?.toFixed(0)}% of your goal. Try adding a shake to reach your ${analytics.nutrition_status.protein.target}g target. Hydration is looking great at ${waterPercentage.toFixed(0)}%!`}
            </p>
            <button className="inline-flex items-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-900/50 group">
              View Recommendations
              <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Log Meal Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Meal & Macros"
      >
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <Input
            label="Calories (kcal)"
            type="number"
            value={logData.calories}
            onChange={(e) => setLogData(prev => ({ ...prev, calories: e.target.value }))}
            placeholder="0"
            autoFocus
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Protein (g)"
              type="number"
              value={logData.protein}
              onChange={(e) => setLogData(prev => ({ ...prev, protein: e.target.value }))}
              placeholder="0"
            />
            <Input
              label="Carbs (g)"
              type="number"
              value={logData.carbs}
              onChange={(e) => setLogData(prev => ({ ...prev, carbs: e.target.value }))}
              placeholder="0"
            />
            <Input
              label="Fat (g)"
              type="number"
              value={logData.fat}
              onChange={(e) => setLogData(prev => ({ ...prev, fat: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div className="pt-4">
            <Button fullWidth isLoading={isLogging}>
              Add Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};