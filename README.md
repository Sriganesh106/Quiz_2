# Quiz Application

A modern, interactive web development quiz application with real-time leaderboard tracking.

## Features

- **15 Quiz Questions**: 8 standard questions + 7 boss-level challenges
- **Real-time Leaderboard**: Auto-refreshes every 5 seconds
- **User Tracking**: Save scores with name, email, and college details
- **Boss Mode Transition**: Dynamic difficulty progression
- **Dark Mode UI**: Sleek neon-themed design with smooth animations
- **Timed Challenge**: Track completion time and compete for top rankings

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sriganesh106/Quiz.git
cd Quiz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/setup_complete.sql`
4. Paste and run the script

This will create:
- Quiz questions table (15 questions)
- Quiz results table with user details
- Leaderboard view and RPC functions
- Security policies

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

The build output will be in the `dist/` directory.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

## Project Structure

```
Quiz/
├── src/
│   ├── components/         # React components
│   │   ├── UserDetailsForm.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── BossTransition.tsx
│   │   ├── LeaderboardModal.tsx
│   │   └── ...
│   ├── lib/
│   │   └── supabase.ts    # Supabase client
│   ├── App.tsx            # Main app logic
│   └── main.tsx           # Entry point
├── supabase/
│   ├── setup_complete.sql # Database setup script
│   └── migrations/        # SQL migrations
├── dist/                  # Production build (generated)
└── package.json
```

## Quiz Flow

1. **User Details**: Enter name, email, mobile, and college
2. **Welcome Screen**: Start the quiz
3. **Standard Round**: Questions 1-8 (select correct answers)
4. **Boss Transition**: Difficulty warning after Q8
5. **Boss Round**: Questions 9-15 (select wrong/incorrect answers)
6. **Results**: View score and access leaderboard
7. **Leaderboard**: Real-time rankings with auto-refresh

## Database Schema

### quiz_questions
- 15 questions with 4 options each
- Difficulty: `standard` (Q1-8) or `boss` (Q9-15)
- Ordered by `order_number`

### quiz_results
- User details (name, email, mobile, college)
- Quiz performance (correct answers, time taken)
- Timestamp and answers JSON

### RPC Functions
- `get_top_leaderboard(limit_count)`: Fetch ranked users
- `submit_quiz_with_details(...)`: Save quiz results

## License

MIT

## Author

Sriganesh
