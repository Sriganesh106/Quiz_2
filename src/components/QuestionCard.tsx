import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface QuizQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: 'standard' | 'boss';
  order_number: number;
  course_id: number;
  week: number;
}

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  onAnswer,
  questionNumber,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const isBossRound = question.difficulty === 'boss';

  const options = [
    { key: 'a', text: question.option_a },
    { key: 'b', text: question.option_b },
    { key: 'c', text: question.option_c },
    { key: 'd', text: question.option_d },
  ];

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [question.id]);

  const handleSelect = (key: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(key);
    setTimeout(() => {
      onAnswer(key);
    }, 400);
  };

  return (
    <div
      className={`transform transition-all duration-300 ${
        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div
        className={`rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden ${
          isBossRound
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300'
            : 'bg-white border border-gray-100'
        }`}
      >
        {isBossRound && (
          <div className="absolute top-0 right-0 -mt-2 -mr-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse"></div>
              <AlertTriangle className="relative w-12 h-12 text-red-500 animate-bounce" />
            </div>
          </div>
        )}

        <div className="mb-6 relative">
          <div
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 ${
              isBossRound
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
            }`}
          >
            {isBossRound ? (
              <>
                <XCircle className="w-4 h-4" />
                <span>Question {questionNumber} - Choose INCORRECT</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Question {questionNumber}</span>
              </>
            )}
          </div>
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed break-words ${
              isBossRound ? 'text-red-900' : 'text-gray-900'
            }`}
          >
            {question.question_text}
          </h2>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option.key;
            const optionLabels = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={option.key}
                onClick={() => handleSelect(option.key)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-3 sm:p-4 md:p-5 rounded-xl font-medium transition-all duration-200 transform relative group ${
                  isSelected
                    ? isBossRound
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white scale-[1.02] shadow-2xl border-2 border-red-400'
                      : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white scale-[1.02] shadow-2xl border-2 border-emerald-400'
                    : isBossRound
                    ? 'bg-white border-2 border-red-200 text-gray-800 hover:border-red-400 hover:shadow-lg hover:scale-[1.01]'
                    : 'bg-gray-50 border-2 border-gray-200 text-gray-800 hover:border-emerald-400 hover:shadow-lg hover:bg-emerald-50 hover:scale-[1.01]'
                } ${selectedAnswer && !isSelected ? 'opacity-50' : ''}`}
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.08}s both`,
                }}
              >
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative z-10">
                  <span
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      isSelected
                        ? 'bg-white bg-opacity-30 scale-110'
                        : isBossRound
                        ? 'bg-red-100 text-red-700 group-hover:bg-red-200'
                        : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                    }`}
                  >
                    {optionLabels[index]}
                  </span>
                  <span className="flex-1 text-sm sm:text-base md:text-lg break-words">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
