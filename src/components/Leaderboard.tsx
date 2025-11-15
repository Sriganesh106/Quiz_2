import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  rank: number;
  user_name: string;
  email: string;
  college_name: string;
  correct_answers: number;
  total_questions: number;
  score_percentage: number;
}

interface LeaderboardProps {
  currentUserEmail?: string;
}

const Leaderboard = ({ currentUserEmail }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase.rpc('get_top_leaderboard', {
        limit_count: 1000,
      });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-500 to-amber-700';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank <= 3) {
      return `hanging-badge-${rank}`;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Top Performers</h2>
      </div>

      {/* Leaderboard Container with Glowing Border */}
      <div className="glowing-border-container relative">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-3">
            <h3 className="text-white font-bold text-center text-sm">All Participants</h3>
          </div>

          {/* Table Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-white font-semibold text-sm">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-3">College</div>
              <div className="col-span-2 text-center">Score</div>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="divide-y divide-gray-100">
            {entries.map((entry, index) => {
              const isCurrentUser = entry.email === currentUserEmail;
              const isTopThree = entry.rank <= 3;

              return (
                <div
                  key={index}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-300 hover:bg-gray-50 ${
                    isCurrentUser ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                  } ${isTopThree ? 'bg-gradient-to-r from-yellow-50/30 to-transparent' : ''}`}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Rank with Badge */}
                  <div className="col-span-1 flex justify-center relative">
                    {isTopThree ? (
                      <div className={`relative ${getRankBadgeStyle(entry.rank)}`}>
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getBadgeColor(
                            entry.rank
                          )} flex items-center justify-center shadow-lg`}
                        >
                          {getBadgeIcon(entry.rank)}
                        </div>
                        {/* Hanging String Effect */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0.5 h-2 bg-gray-400"></div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                        {entry.rank}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="col-span-3">
                    <p className="font-semibold text-gray-800 truncate">
                      {entry.user_name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="col-span-3">
                    <p className="text-gray-600 text-sm truncate">{entry.email}</p>
                  </div>

                  {/* College */}
                  <div className="col-span-3">
                    <p className="text-gray-600 text-sm truncate">{entry.college_name}</p>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-center">
                    <div className="inline-flex flex-col">
                      <span className="text-lg font-bold text-gray-800">
                        {entry.correct_answers} / {entry.total_questions}
                      </span>
                      <span className="text-xs text-gray-500">
                        {entry.score_percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {entries.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No entries yet. Be the first to complete the quiz!</p>
            </div>
          )}
        </div>

        {/* Glowing Border Animation */}
        <div className="glowing-border"></div>
      </div>

      <style>{`
        /* Glowing Border Animation */
        .glowing-border-container {
          position: relative;
          padding: 4px;
        }

        .glowing-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 1rem;
          background: linear-gradient(
            90deg,
            rgba(16, 185, 129, 0) 0%,
            rgba(16, 185, 129, 0.8) 25%,
            rgba(59, 130, 246, 0.8) 50%,
            rgba(16, 185, 129, 0.8) 75%,
            rgba(16, 185, 129, 0) 100%
          );
          background-size: 200% 100%;
          animation: glowMove 3s linear infinite;
          pointer-events: none;
          z-index: -1;
        }

        @keyframes glowMove {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Hanging Badge Animations */
        .hanging-badge-1 {
          animation: swingBadge 3s ease-in-out infinite;
          transform-origin: top center;
        }

        .hanging-badge-2 {
          animation: swingBadge 3.5s ease-in-out infinite;
          animation-delay: 0.2s;
          transform-origin: top center;
        }

        .hanging-badge-3 {
          animation: swingBadge 4s ease-in-out infinite;
          animation-delay: 0.4s;
          transform-origin: top center;
        }

        @keyframes swingBadge {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(3deg);
          }
          75% {
            transform: rotate(-3deg);
          }
        }

        /* Fade In Up Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .glowing-border-container {
            padding: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
