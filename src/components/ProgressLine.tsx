import { Sparkles, Flame } from 'lucide-react';

interface ProgressLineProps {
  currentQuestion: number;
  totalQuestions: number;
  phase: 'standard' | 'boss';
}

export default function ProgressLine({ currentQuestion, totalQuestions, phase }: ProgressLineProps) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const isBossRound = phase === 'boss';

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {isBossRound ? (
            <>
              <Flame className="w-5 h-5 text-red-400 animate-bounce" />
              <span className="text-sm font-bold text-white animate-pulse">
                FINAL BOSS ROUND - Choose Incorrect!
              </span>
              <Flame className="w-5 h-5 text-red-300 animate-bounce" style={{ animationDelay: '0.1s' }} />
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">Standard Round</span>
            </>
          )}
        </div>
        <div className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
          {currentQuestion} / {totalQuestions}
        </div>
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-visible shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
            isBossRound
              ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-lg shadow-red-500/50'
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 shadow-md shadow-emerald-500/30'
          }`}
          style={{ width: `${progress}%` }}
        >
          <div className={`h-full w-full ${isBossRound ? 'animate-pulse-fast' : 'animate-pulse-slow'}`}>
            <div
              className={`h-full w-full ${
                isBossRound
                  ? 'bg-gradient-to-r from-transparent via-white to-transparent opacity-50'
                  : 'bg-gradient-to-r from-transparent via-white to-transparent opacity-40'
              }`}
              style={{
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </div>

          {isBossRound && (
            <>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-yellow-300 to-transparent"
                  style={{
                    left: `${(i / 12) * 100}%`,
                    animation: `sparkRise ${0.6 + (i % 3) * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.08}s`,
                    filter: 'blur(0.5px)',
                  }}
                />
              ))}

              <div className="absolute -top-1 -bottom-1 left-0 right-0 opacity-60">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`glow-${i}`}
                    className="absolute w-2 h-2 rounded-full bg-yellow-300"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `sparkle ${0.8 + Math.random() * 0.4}s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                      boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)',
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {!isBossRound && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white opacity-60"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    animation: `twinkle ${1 + (i % 2) * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes sparkRise {
          0%, 100% {
            opacity: 0;
            transform: scaleY(0.3);
          }
          50% {
            opacity: 1;
            transform: scaleY(2);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(-50%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateY(-50%) scale(1.2);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes pulse-fast {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
