import { Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuestionTimerProps {
  isRunning: boolean;
  onTimeUp: () => void;
  timeLimit?: number;
  questionId: string;
}

export default function QuestionTimer({
  isRunning,
  onTimeUp,
  timeLimit = 45,
  questionId,
}: QuestionTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);

  useEffect(() => {
    setSecondsLeft(timeLimit);
  }, [questionId, timeLimit]);

  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onTimeUp]);

  const percentage = (secondsLeft / timeLimit) * 100;
  const isLowTime = secondsLeft <= 10;
  const isCritical = secondsLeft <= 5;

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-lg border-2 transition-all duration-300 ${
        isCritical
          ? 'bg-red-50 border-red-400 animate-pulse'
          : isLowTime
          ? 'bg-orange-50 border-orange-400'
          : 'bg-white border-gray-200'
      }`}
    >
      {isCritical ? (
        <AlertCircle className="w-5 h-5 text-red-600 animate-bounce" />
      ) : (
        <Clock
          className={`w-5 h-5 ${
            isLowTime ? 'text-orange-600' : 'text-blue-600'
          }`}
        />
      )}
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-xl font-bold ${
            isCritical
              ? 'text-red-600'
              : isLowTime
              ? 'text-orange-600'
              : 'text-gray-800'
          }`}
        >
          {secondsLeft}s
        </span>
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isCritical
                ? 'bg-red-500'
                : isLowTime
                ? 'bg-orange-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
