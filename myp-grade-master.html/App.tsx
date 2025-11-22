
import React, { useState, useEffect, useCallback } from 'react';
import { DEFAULT_SUBJECTS } from './constants';
import { SubjectData, CriteriaKey } from './types';
import { SubjectCard } from './components/SubjectCard';
import { Dashboard } from './components/Dashboard';
import { RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  // Initialize state from localStorage if available, otherwise use default
  const [subjects, setSubjects] = useState<SubjectData[]>(() => {
    const saved = localStorage.getItem('myp-subjects-v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: Ensure all scores are arrays (v0 -> v1)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return parsed.map((sub: any) => ({
          ...sub,
          scores: {
            A: Array.isArray(sub.scores.A) ? sub.scores.A : (sub.scores.A ? [sub.scores.A] : []),
            B: Array.isArray(sub.scores.B) ? sub.scores.B : (sub.scores.B ? [sub.scores.B] : []),
            C: Array.isArray(sub.scores.C) ? sub.scores.C : (sub.scores.C ? [sub.scores.C] : []),
            D: Array.isArray(sub.scores.D) ? sub.scores.D : (sub.scores.D ? [sub.scores.D] : []),
          }
        }));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return DEFAULT_SUBJECTS;
  });

  // Persist to local storage whenever subjects change
  useEffect(() => {
    localStorage.setItem('myp-subjects-v1', JSON.stringify(subjects));
  }, [subjects]);

  const handleUpdateScore = useCallback((id: string, criteria: CriteriaKey, value: number[]) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          scores: {
            ...sub.scores,
            [criteria]: value
          }
        };
      }
      return sub;
    }));
  }, []);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all scores to 0?')) {
      setSubjects(DEFAULT_SUBJECTS);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-indigo-200 shadow-lg">
              IB
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">MYP Grade Master</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleReset}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Reset all scores"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-500">Your academic performance overview based on IB criteria.</p>
        </div>

        <Dashboard subjects={subjects} />

        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Subjects</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                <span>Tap scores to manage projects</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>Avg rounded to nearest int</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              onUpdateScore={handleUpdateScore} 
            />
          ))}
        </div>

        {/* Grade Boundaries Legend */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
           <h3 className="text-lg font-semibold mb-4 text-gray-800">Grade Boundaries Reference (Total Score / 32)</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="font-bold text-red-700 text-lg">1</div>
                  <div className="text-xs text-red-600">0 - 5</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="font-bold text-red-700 text-lg">2</div>
                  <div className="text-xs text-red-600">6 - 9</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="font-bold text-orange-700 text-lg">3</div>
                  <div className="text-xs text-orange-600">10 - 14</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="font-bold text-yellow-700 text-lg">4</div>
                  <div className="text-xs text-yellow-600">15 - 18</div>
              </div>
               <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="font-bold text-blue-700 text-lg">5</div>
                  <div className="text-xs text-blue-600">19 - 23</div>
              </div>
               <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="font-bold text-green-700 text-lg">6</div>
                  <div className="text-xs text-green-600">24 - 27</div>
              </div>
               <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="font-bold text-emerald-700 text-lg">7</div>
                  <div className="text-xs text-emerald-600">28 - 32</div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
