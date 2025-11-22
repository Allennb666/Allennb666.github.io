import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SubjectData } from '../types';
import { calculateTotalScore, calculateFinalGrade, getGradeColorRaw } from '../services/gradeService';
import { GraduationCap, TrendingUp, Award } from 'lucide-react';

interface DashboardProps {
  subjects: SubjectData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ subjects }) => {
  const subjectsWithGrades = subjects.map(s => {
    const total = calculateTotalScore(s.scores);
    const grade = calculateFinalGrade(total);
    
    // Use ID for standardized abbreviations (e.g., DD for Digital Design, PD for Product Design)
    const shortName = s.id.toUpperCase();

    return {
      name: s.name,
      shortName: shortName,
      grade: grade,
      total: total
    };
  });

  const totalPoints = subjectsWithGrades.reduce((acc, curr) => acc + curr.grade, 0);
  const gpa = totalPoints / subjects.length;

  // Calculate max possible score (Standard MYP typically sums grades, max 63 for 9 subjects, but here we just show GPA average out of 7)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Stats Cards */}
      <div className="lg:col-span-1 grid grid-cols-1 gap-4">
        
        {/* GPA Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <GraduationCap className="w-5 h-5" />
              <span className="font-semibold tracking-wide text-sm uppercase">Average GPA</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-bold text-gray-900">{gpa.toFixed(2)}</span>
              <span className="text-gray-400 font-medium">/ 7.00</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Across {subjects.length} subjects</p>
          </div>
        </div>

        {/* Total Points Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-emerald-600 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold tracking-wide text-sm uppercase">Total Points</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-gray-900">{totalPoints}</span>
              <span className="text-gray-400 font-medium">/ {subjects.length * 7}</span>
            </div>
             <p className="text-sm text-gray-500 mt-2">Cumulative subject score</p>
          </div>
        </div>

      </div>

      {/* Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-gray-700">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-semibold">Performance Overview</h3>
            </div>
        </div>
        
        <div className="flex-grow h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectsWithGrades} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="shortName" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 11 }} 
                dy={10}
                interval={0}
              />
              <YAxis 
                domain={[0, 7]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                ticks={[1,2,3,4,5,6,7]}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="grade" radius={[4, 4, 0, 0]} barSize={40}>
                {subjectsWithGrades.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getGradeColorRaw(entry.grade)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};