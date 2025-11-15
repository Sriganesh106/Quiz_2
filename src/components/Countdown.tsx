import { useEffect, useState } from 'react';
import { Sparkles, Code, Zap } from 'lucide-react';

interface CountdownProps {
  onComplete: () => void;
}

export default function Countdown({ onComplete }: CountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      setTimeout(onComplete, 800);
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  const getCountColor = () => {
    if (count === 3) return 'from-blue-400 to-cyan-400';
    if (count === 2) return 'from-purple-400 to-pink-400';
    if (count === 1) return 'from-orange-400 to-red-400';
    return 'from-emerald-400 to-green-400';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Code className="w-6 h-6 text-blue-400" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-5 h-5 text-purple-400" />
            ) : (
              <Zap className="w-4 h-4 text-orange-400" />
            )}
          </div>
        ))}
      </div>

      <div className="text-center relative z-10">
        <div className="relative">
          {count > 0 && (
            <>
              <div
                className="absolute inset-0 blur-3xl opacity-60"
                style={{
                  animation: 'pulse 1s ease-in-out',
                  background: `radial-gradient(circle, ${
                    count === 3
                      ? 'rgba(59, 130, 246, 0.6)'
                      : count === 2
                      ? 'rgba(168, 85, 247, 0.6)'
                      : 'rgba(251, 146, 60, 0.6)'
                  } 0%, transparent 70%)`,
                }}
              />
              <div
                className={`text-[240px] font-black text-transparent bg-clip-text bg-gradient-to-br ${getCountColor()} relative`}
                style={{
                  animation: 'countPulse 1s ease-out',
                  textShadow: '0 0 60px rgba(255, 255, 255, 0.3)',
                }}
              >
                {count}
              </div>
              <div className="absolute -inset-20">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${getCountColor()}`}
                    style={{
                      top: '50%',
                      left: '50%',
                      animation: `particle 1s ease-out`,
                      transform: `rotate(${i * 45}deg) translateX(0)`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </>
          )}
          {count === 0 && (
            <div className="relative">
              <div
                className="absolute inset-0 blur-3xl bg-emerald-500 opacity-60 animate-pulse"
              />
              <div
                className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 mb-4"
                style={{
                  animation: 'zoomIn 0.5s ease-out',
                  textShadow: '0 0 40px rgba(16, 185, 129, 0.5)',
                }}
              >
                START!
              </div>
              <div className="flex justify-center gap-3">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
                <Code className="w-8 h-8 text-green-400 animate-bounce" />
                <Zap className="w-8 h-8 text-teal-400 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes countPulse {
          0% {
            transform: scale(0.3) rotate(-10deg);
            opacity: 0;
            filter: blur(10px);
          }
          50% {
            transform: scale(1.15) rotate(2deg);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes zoomIn {
          0% {
            transform: scale(0.5) rotate(-5deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.1) rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes particle {
          0% {
            transform: rotate(var(--angle, 0deg)) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle, 0deg)) translateX(150px) scale(0);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
