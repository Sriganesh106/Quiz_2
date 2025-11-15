import { Trophy } from 'lucide-react';

interface LeaderboardButtonProps {
  onClick: () => void;
}

const LeaderboardButton = ({ onClick }: LeaderboardButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="leaderboard-button group"
    >
      {/* Button content */}
      <div className="relative flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 w-10 h-10 rounded-full shadow-lg transform transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl border-2 border-amber-300/50">
        <Trophy className="w-5 h-5 text-white drop-shadow-sm" />
        <div className="absolute inset-0 rounded-full shine-effect"></div>
      </div>
      

      <style>{`
        .leaderboard-button {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 40;
          cursor: pointer;
          border: none;
          background: transparent;
        }
        

        /* Shine effect */
        .shine-effect {
          background: linear-gradient(
            120deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 60%,
            transparent 100%
          );
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }


        /* Responsive positioning and sizing */
        
        /* Tablet and small desktop */
        @media (max-width: 1024px) {
          .leaderboard-button {
            top: 15px;
            right: 15px;
          }
        }
        
        /* Mobile landscape and small tablets */
        @media (max-width: 768px) {
          .leaderboard-button {
            top: 12px;
            right: 12px;
          }
          
          .leaderboard-button .relative {
            width: 2.5rem;
            height: 2.5rem;
          }
          
          .leaderboard-button .relative .w-5 {
            width: 1.125rem;
            height: 1.125rem;
          }
          
        }
        
        /* Mobile portrait */
        @media (max-width: 480px) {
          .leaderboard-button {
            top: 8px;
            right: 8px;
          }
          
          .leaderboard-button .relative {
            width: 2.25rem;
            height: 2.25rem;
          }
          
          .leaderboard-button .relative .w-5 {
            width: 1rem;
            height: 1rem;
          }
          
        }
        
        /* Very small mobile devices */
        @media (max-width: 360px) {
          .leaderboard-button {
            top: 6px;
            right: 6px;
          }
          
          .leaderboard-button .relative {
            width: 2rem;
            height: 2rem;
          }
          
          .leaderboard-button .relative .w-5 {
            width: 0.875rem;
            height: 0.875rem;
          }
          
        }

        /* Button press effect */
        .leaderboard-button:active .relative {
          transform: scale(0.95);
        }
        
        /* Enhanced touch feedback for mobile */
        @media (hover: none) and (pointer: coarse) {
          .leaderboard-button {
            /* Ensure minimum touch target size of 44px */
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .leaderboard-button:active {
            /* More pronounced feedback on touch */
            transform: scale(0.9);
          }
          
          /* Disable hover effects on touch devices */
          .leaderboard-button:hover .relative {
            transform: none;
          }
          
          /* But keep the active/pressed state */
          .leaderboard-button:active .relative {
            transform: scale(0.85);
          }
        }
      `}</style>
    </button>
  );
};

export default LeaderboardButton;
