
import React, { useMemo, useState } from 'react';
import { SubjectData, CriteriaKey } from '../types';
import { CRITERIA_LABELS } from '../constants';
import { calculateTotalScore, calculateFinalGrade, getGradeColor, calculateCriterionAverage } from '../services/gradeService';
import { BookOpen, Calculator, Monitor, Music, Activity, PenTool, Leaf, Atom, Languages, Edit2, Layers } from 'lucide-react';
import { CriteriaModal } from './CriteriaModal';

interface SubjectCardProps {
  subject: SubjectData;
  onUpdateScore: (id: string, criteria: CriteriaKey, value: number[]) => void;
}

const getIconForSubject = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('math')) return <Calculator className="w-5 h-5" />;
  if (lower.includes('design') && lower.includes('digital')) return <Monitor className="w-5 h-5" />;
  if (lower.includes('design')) return <PenTool className="w-5 h-5" />;
  if (lower.includes('music')) return <Music className="w-5 h-5" />;
  if (lower.includes('phe')) return <Activity className="w-5 h-5" />;
  if (lower.includes('bio')) return <Leaf className="w-5 h-5" />;
  if (lower.includes('phys')) return <Atom className="w-5 h-5" />;
  if (lower.includes('chinese') || lower.includes('english')) return <Languages className="w-5 h-5" />;
  return <BookOpen className="w-5 h-5" />;
};

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onUpdateScore }) => {
  const totalScore = useMemo(() => calculateTotalScore(subject.scores), [subject.scores]);
  const finalGrade = useMemo(() => calculateFinalGrade(totalScore), [totalScore]);
  const colorClass = getGradeColor(finalGrade);

  const [activeModal, setActiveModal] = useState<CriteriaKey | null>(null);

  const handleUpdateScores = (newScores: number[]) => {
    if (activeModal) {
      onUpdateScore(subject.id, activeModal, newScores);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
        <div className={`p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-white border shadow-sm text-gray-600`}>
              {getIconForSubject(subject.name)}
            </div>
            <h3 className="font-semibold text-gray-800">{subject.name}</h3>
          </div>
          <div className={`flex flex-col items-end`}>
             <span className={`text-2xl font-bold px-3 py-1 rounded-lg border ${colorClass}`}>
              {finalGrade}
             </span>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
          <div className="grid grid-cols-4 gap-2">
            {CRITERIA_LABELS.map((crit) => {
              const scores = subject.scores[crit];
              const average = calculateCriterionAverage(scores);
              const count = scores.length;
              
              return (
                <div key={crit} className="flex flex-col items-center space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase">Crit {crit}</label>
                  <button
                    onClick={() => setActiveModal(crit)}
                    className={`w-full relative group p-2 border rounded-lg transition-all outline-none
                      ${count > 0 
                        ? 'bg-white border-indigo-200 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100 text-indigo-900' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100 text-gray-400'
                      }`}
                  >
                    <div className="text-lg font-mono font-bold">
                      {average}
                    </div>
                    {count > 0 && (
                      <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-indigo-100 text-indigo-700 text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-indigo-200 shadow-sm">
                        {count}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 rounded-lg transition-opacity">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <Layers className="w-4 h-4" />
              Total Score
            </span>
            <span className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">{totalScore} / 32</span>
          </div>
        </div>
      </div>

      {activeModal && (
        <CriteriaModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          subjectName={subject.name}
          criteriaLabel={activeModal}
          scores={subject.scores[activeModal]}
          onUpdateScores={handleUpdateScores}
        />
      )}
    </>
  );
};
