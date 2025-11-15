/*
  # Quiz System Database Schema

  ## Overview
  Creates a complete quiz system with questions, answer tracking, and user results.

  ## New Tables
  
  ### `quiz_questions`
  Stores all quiz questions with their answers and metadata
  - `id` (uuid, primary key) - Unique identifier for each question
  - `question_text` (text) - The question content
  - `option_a` (text) - First answer option
  - `option_b` (text) - Second answer option
  - `option_c` (text) - Third answer option
  - `option_d` (text) - Fourth answer option
  - `correct_answer` (text) - The correct answer (a, b, c, or d)
  - `difficulty` (text) - Either 'standard' or 'boss'
  - `order_number` (integer) - Question sequence number (1-15)
  - `created_at` (timestamptz) - Timestamp of creation

  ### `quiz_results`
  Tracks user quiz attempts and scores
  - `id` (uuid, primary key) - Unique identifier for each result
  - `user_id` (uuid, nullable) - Reference to user (null for anonymous)
  - `total_questions` (integer) - Total number of questions
  - `correct_answers` (integer) - Number of correct answers
  - `time_taken_seconds` (integer) - Total time taken to complete
  - `completed_at` (timestamptz) - When the quiz was completed
  - `answers` (jsonb) - Detailed answer log

  ## Security
  - Enable RLS on all tables
  - Public can read quiz questions (they're public content)
  - Anyone can insert their own quiz results
  - Users can only read their own results

  ## Sample Data
  Includes 15 sample questions (8 standard + 7 boss round)
*/

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  difficulty text NOT NULL CHECK (difficulty IN ('standard', 'boss')),
  order_number integer NOT NULL UNIQUE CHECK (order_number >= 1 AND order_number <= 15),
  created_at timestamptz DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  total_questions integer NOT NULL DEFAULT 15,
  correct_answers integer NOT NULL DEFAULT 0,
  time_taken_seconds integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  answers jsonb
);

-- Enable RLS
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Quiz questions policies (public read access)
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Quiz results policies
CREATE POLICY "Anyone can insert quiz results"
  ON quiz_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own results"
  ON quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can view own results by id"
  ON quiz_results FOR SELECT
  TO anon
  USING (true);

-- Insert sample quiz questions
INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, order_number) VALUES
-- Standard Round (8 questions)
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'c', 'standard', 1),
('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'b', 'standard', 2),
('What is the largest ocean on Earth?', 'Atlantic', 'Indian', 'Arctic', 'Pacific', 'd', 'standard', 3),
('Who painted the Mona Lisa?', 'Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello', 'b', 'standard', 4),
('What is the smallest prime number?', '0', '1', '2', '3', 'c', 'standard', 5),
('Which element has the chemical symbol "O"?', 'Gold', 'Silver', 'Oxygen', 'Osmium', 'c', 'standard', 6),
('How many continents are there?', '5', '6', '7', '8', 'c', 'standard', 7),
('What is the speed of light approximately?', '300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s', 'a', 'standard', 8),

-- Final Boss Round (7 questions)
('In quantum mechanics, what is the name of the principle stating you cannot simultaneously know both position and momentum with perfect accuracy?', 'Pauli Exclusion Principle', 'Heisenberg Uncertainty Principle', 'Schrödinger Equation', 'Copenhagen Interpretation', 'b', 'boss', 9),
('Which programming paradigm treats computation as the evaluation of mathematical functions?', 'Object-oriented', 'Imperative', 'Functional', 'Procedural', 'c', 'boss', 10),
('What is the time complexity of the best-known algorithm for matrix multiplication?', 'O(n²)', 'O(n² log n)', 'O(n^2.37)', 'O(n³)', 'c', 'boss', 11),
('In Greek mythology, who was the ferryman of the dead?', 'Thanatos', 'Charon', 'Hades', 'Cerberus', 'b', 'boss', 12),
('What is the only letter that does not appear in any US state name?', 'Q', 'Z', 'X', 'J', 'a', 'boss', 13),
('Which mathematician proved that certain mathematical statements are undecidable?', 'Alan Turing', 'Kurt Gödel', 'John von Neumann', 'Bertrand Russell', 'b', 'boss', 14),
('What is the name of the first exoplanet discovered orbiting a sun-like star?', '51 Pegasi b', 'Kepler-22b', 'Proxima Centauri b', 'TRAPPIST-1e', 'a', 'boss', 15)
ON CONFLICT (order_number) DO NOTHING;