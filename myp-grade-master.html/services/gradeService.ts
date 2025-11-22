
import { GRADE_BOUNDARIES } from '../constants';
import { CriteriaScores, CriteriaKey } from '../types';

// Calculate average of an array of scores, rounded to nearest integer
export const calculateCriterionAverage = (scores: number[]): number => {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  // Standard rounding: 5.5 -> 6, 5.4 -> 5
  return Math.round(sum / scores.length);
};

// Calculate exact average for display purposes (e.g., 5.3)
export const calculateCriterionRawAverage = (scores: number[]): number => {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return parseFloat((sum / scores.length).toFixed(1));
};

export const calculateTotalScore = (scores: CriteriaScores): number => {
  const scoreA = calculateCriterionAverage(scores.A);
  const scoreB = calculateCriterionAverage(scores.B);
  const scoreC = calculateCriterionAverage(scores.C);
  const scoreD = calculateCriterionAverage(scores.D);
  
  return scoreA + scoreB + scoreC + scoreD;
};

export const calculateFinalGrade = (totalScore: number): number => {
  const boundary = GRADE_BOUNDARIES.find(
    (b) => totalScore >= b.min && totalScore <= b.max
  );
  return boundary ? boundary.grade : 1;
};

export const getGradeColor = (grade: number): string => {
  if (grade === 7) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (grade === 6) return 'text-green-600 bg-green-50 border-green-200';
  if (grade === 5) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (grade === 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (grade === 3) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

export const getGradeColorRaw = (grade: number): string => {
  if (grade === 7) return '#059669'; // emerald-600
  if (grade === 6) return '#16a34a'; // green-600
  if (grade === 5) return '#2563eb'; // blue-600
  if (grade === 4) return '#ca8a04'; // yellow-600
  if (grade === 3) return '#ea580c'; // orange-600
  return '#dc2626'; // red-600
};
