import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Crown, X, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  rank: number;
  user_name: string;
  email: string;
  college_name: string;
  correct_answers: number;
  total_questions: number;
  score_percentage: number;
  time_taken_seconds: number;
  course_id?: string;
  week?: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
  courseId?: string;
  week?: string;
}

const LeaderboardModal = ({ 
  isOpen, 
  onClose, 
  currentUserEmail,
  courseId,
  week
}: LeaderboardModalProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard whenever modal opens or courseId/week changes
  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, courseId, week]);

  // Set up auto-refresh every 5 seconds when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      fetchLeaderboard(false); // Fetch without showing loading spinner
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [isOpen, courseId, week]);

  const fetchLeaderboard = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const { data, error } = await supabase.rpc('get_leaderboard_by_course_week', {
        p_course_id: courseId || null,
        p_week: week || null,
        p_limit: 1000,
      });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const getBadgeIcon = (rank: number, isMobile = false) => {
    const iconSize = isMobile ? "w-6 h-6" : "w-10 h-10";
    switch (rank) {
      case 1:
        return <Crown className={`${iconSize} text-yellow-400 drop-shadow-lg`} />;
      case 2:
        return <Medal className={`${iconSize} text-gray-300 drop-shadow-lg`} />;
      case 3:
        return <Award className={`${iconSize} text-amber-600 drop-shadow-lg`} />;
      default:
        return null;
    }
  };

  const getBadgeGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-300 via-gray-400 to-gray-500';
      case 3:
        return 'from-amber-500 via-amber-600 to-amber-700';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getBadgeGlow = (rank: number) => {
    switch (rank) {
      case 1:
        return 'shadow-yellow-500/50';
      case 2:
        return 'shadow-gray-400/50';
      case 3:
        return 'shadow-amber-500/50';
      default:
        return '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">
                {courseId && week ? `Course ${courseId} • Week ${week}` : 'All Courses'}
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close leaderboard"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-300">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-800 z-10">
                  <tr className="text-left text-gray-300 text-sm">
                    <th className="p-4 w-16 text-center">Rank</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">College</th>
                    <th className="p-4 text-right">Score</th>
                    <th className="p-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {entries.map((entry, index) => (
                    <tr 
                      key={entry.email} 
                      className={`${
                        entry.email === currentUserEmail 
                          ? 'bg-blue-900/30' 
                          : 'hover:bg-slate-700/50'
                      } transition-colors`}
                    >
                      <td className="p-4 text-center">
                        {entry.rank <= 3 ? (
                          <div className="flex justify-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${getBadgeGradient(entry.rank)} ${getBadgeGlow(entry.rank) ? `shadow-lg ${getBadgeGlow(entry.rank)}` : ''}`}>
                              <span className="text-white font-bold">{entry.rank}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300">{entry.rank}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {entry.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-white font-medium">{entry.user_name}</div>
                            <div className="text-xs text-gray-400">{entry.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{entry.college_name || 'N/A'}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end">
                          <span className="text-white font-medium">
                            {entry.correct_answers}/{entry.total_questions}
                          </span>
                          <span className="ml-2 px-2 py-1 bg-blue-900/50 text-blue-200 text-xs rounded-full">
                            {entry.score_percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-gray-300">
                        {formatTime(entry.time_taken_seconds)}
                      </td>
                    </tr>
                  ))}
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        No leaderboard data available for this selection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="md:hidden">
              {entries.map((entry) => (
                <div
                  key={entry.email}
                  className={`p-4 border-b border-slate-700 ${
                    entry.email === currentUserEmail
                      ? 'bg-blue-900/20'
                      : 'hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {entry.rank <= 3 ? (
                        <div className="flex-shrink-0">
                          {getBadgeIcon(entry.rank, true)}
                        </div>
                      ) : (
                        <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                          {entry.rank}
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="font-medium text-white">{entry.user_name}</div>
                        <div className="text-sm text-gray-400">{entry.college_name || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">
                        {entry.correct_answers}/{entry.total_questions}
                      </div>
                      <div className="text-xs text-blue-300">
                        {entry.score_percentage}% • {formatTime(entry.time_taken_seconds)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No leaderboard data available.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-800/50 p-4 border-t border-slate-700 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {entries.length} participants
          </div>
          <button
            onClick={() => fetchLeaderboard()}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;