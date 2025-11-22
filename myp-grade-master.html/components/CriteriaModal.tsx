
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { calculateCriterionRawAverage, calculateCriterionAverage } from '../services/gradeService';

interface CriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  criteriaLabel: string;
  scores: number[];
  onUpdateScores: (newScores: number[]) => void;
}

export const CriteriaModal: React.FC<CriteriaModalProps> = ({
  isOpen,
  onClose,
  subjectName,
  criteriaLabel,
  scores,
  onUpdateScores,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val >= 0 && val <= 8) {
      onUpdateScores([...scores, val]);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    const newScores = [...scores];
    newScores.splice(index, 1);
    onUpdateScores(newScores);
  };

  const average = calculateCriterionAverage(scores);
  const rawAverage = calculateCriterionRawAverage(scores);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{subjectName}</h3>
            <p className="text-sm text-gray-500">Criterion {criteriaLabel} Assessments</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Stats */}
          <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div>
              <p className="text-xs font-semibold uppercase text-indigo-600 tracking-wider">Average Score</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-bold text-indigo-900">{average}</span>
                <span className="text-sm text-indigo-400">/ 8</span>
              </div>
            </div>
            <div className="text-right">
               <p className="text-xs text-indigo-500">Raw: {rawAverage}</p>
               <p className="text-xs text-indigo-500">{scores.length} project{scores.length !== 1 && 's'}</p>
            </div>
          </div>

          {/* Add Score Form */}
          <form onSubmit={handleAdd} className="flex space-x-2">
            <input
              ref={inputRef}
              type="number"
              min="0"
              max="8"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter score (0-8)"
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg font-mono"
            />
            <button
              type="submit"
              disabled={!inputValue}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          {/* List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">History</h4>
            {scores.length === 0 ? (
              <div className="text-center py-6 text-gray-400 flex flex-col items-center border-2 border-dashed border-gray-100 rounded-xl">
                <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                <p>No scores added yet</p>
              </div>
            ) : (
              scores.map((score, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-300 transition-colors group shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-mono">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-gray-800 text-lg">{score}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(idx)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
            <button onClick={onClose} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Done
            </button>
        </div>
      </div>
    </div>
  );
};
