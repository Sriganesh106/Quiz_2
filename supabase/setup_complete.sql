-- =====================================================
-- COMPLETE QUIZ APP DATABASE SETUP
-- =====================================================
-- This script will:
-- 1. Drop existing tables (if any)
-- 2. Create fresh tables with proper structure
-- 3. Set up Row Level Security policies
-- 4. Insert all 15 web development quiz questions
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Create quiz_questions table
CREATE TABLE quiz_questions (
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

-- Create quiz_results table with user details
CREATE TABLE quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  mobile_number text NOT NULL DEFAULT '',
  college_name text NOT NULL DEFAULT '',
  total_questions integer NOT NULL DEFAULT 15,
  correct_answers integer NOT NULL DEFAULT 0,
  time_taken_seconds integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  answers jsonb
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE SECURITY POLICIES
-- =====================================================

-- Quiz questions policies (public read access)
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Quiz results policies
CREATE POLICY "Anyone can insert quiz results with details"
  ON quiz_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view leaderboard results"
  ON quiz_results FOR SELECT
  TO anon, authenticated
  USING (true);

-- =====================================================
-- INSERT 15 WEB DEVELOPMENT QUIZ QUESTIONS
-- =====================================================
-- Standard Round (Questions 1-8): Choose CORRECT answer
-- Final Boss Round (Questions 9-15): Choose WRONG answer
-- =====================================================

INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, order_number) VALUES

-- ========== STANDARD ROUND (8 questions) ==========
-- These questions ask for the CORRECT answer

('Which tag is the most semantically appropriate for the main content of a webpage?', 
 '<div id="main">', '<main>', '<section id="main">', '<article>', 
 'b', 'standard', 1),

('Which input type provides a user interface element for selecting a value from a specified range?', 
 'type="number"', 'type="slider"', 'type="range"', 'type="select"', 
 'c', 'standard', 2),

('What is the purpose of the alt attribute on an <img> tag?', 
 'Hover title', 'Accessibility & fallback text', 'Alignment', 'Links to URL', 
 'b', 'standard', 3),

('To group related controls in a form, use:', 
 '<section>', '<fieldset>', '<div>', '<group>', 
 'b', 'standard', 4),

('Which tag defines a self-contained content like a blog post?', 
 '<section>', '<div>', '<article>', '<aside>', 
 'c', 'standard', 5),

('What does box-sizing: border-box; do?', 
 'Hides borders', 'Includes padding/border in width/height', 'Excludes padding/border', 'Applies box model only to borders', 
 'b', 'standard', 6),

('What does flex-direction: column; do?', 
 'Aligns horizontally', 'Stacks vertically', 'Reverses order', 'Wraps items', 
 'b', 'standard', 7),

('To create a CSS Grid container, use:', 
 'display: grid;', 'display: flex;', 'grid: true;', 'layout: grid;', 
 'a', 'standard', 8),

('Select the WRONG media query syntax for screens wider than 1200px:', 
 '@media screen (min-width > 1200px)', '@media (min-width: 1200px)', '@media screen and (min-width: 1200px)', '@media only screen and (min-width: 1200px)', 
 'a', 'boss', 9),

-- ========== FINAL BOSS ROUND (7 questions) ==========
-- These questions ask for the WRONG answer

('Select the WRONG statement about CSS selectors:', 
 '. = Class, # = ID', '. = ID, # = Class', 'Both are used for styling', 'None of these', 
 'b', 'boss', 10),

('Select the WRONG way to center a block element horizontally:', 
 'text-align: center;', 'align: center;', 'margin: 0 auto;', 'Using flexbox justify-content: center;', 
 'b', 'boss', 11),

('Select the WRONG statement about z-index:', 
 'It controls stacking order', 'It affects how elements overlap', 'It changes the zoom level', 'It only works on positioned elements', 
 'c', 'boss', 12),

('Select the WRONG way to declare a constant:', 
 'const myVar = 10;', 'const', 'const name = "John";', 'const PI = 3.14;', 
 'b', 'boss', 13),

('Select the WRONG version of the loop that logs numbers 0 to 4:', 
 'for (let i = 0; i < 5; i++) { console.log(i); }', 'for (let i = 0; i <= 5; i++) { console.log(i); }', 'for (let i = 0; i < 5; i++) console.log(i);', 'All are correct', 
 'b', 'boss', 14),

('Select the WRONG use of document.getElementById():', 
 'document.getElementById("title")', 'document.getElementById("#title")', 'let element = document.getElementById("idName")', 'It selects element by ID', 
 'b', 'boss', 15);

-- =====================================================
-- CREATE LEADERBOARD FUNCTIONS AND VIEWS
-- =====================================================

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  user_name,
  email,
  college_name,
  correct_answers,
  total_questions,
  time_taken_seconds,
  completed_at,
  RANK() OVER (ORDER BY correct_answers DESC, time_taken_seconds ASC) as rank
FROM quiz_results
WHERE user_name != '' AND email != ''
ORDER BY 
  correct_answers DESC,
  time_taken_seconds ASC;

-- Grant access to leaderboard view
GRANT SELECT ON leaderboard TO anon, authenticated;

-- Create function to get top N leaderboard entries
CREATE OR REPLACE FUNCTION get_top_leaderboard(limit_count integer DEFAULT 10)
RETURNS TABLE (
  rank bigint,
  user_name text,
  email text,
  college_name text,
  correct_answers integer,
  total_questions integer,
  time_taken_seconds integer,
  score_percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY qr.correct_answers DESC, qr.time_taken_seconds ASC) as rank,
    qr.user_name,
    qr.email,
    qr.college_name,
    qr.correct_answers,
    qr.total_questions,
    qr.time_taken_seconds,
    ROUND((qr.correct_answers::numeric / qr.total_questions::numeric) * 100, 2) as score_percentage
  FROM quiz_results qr
  WHERE qr.user_name != '' AND qr.email != ''
  ORDER BY qr.correct_answers DESC, qr.time_taken_seconds ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to submit quiz with user details
CREATE OR REPLACE FUNCTION submit_quiz_with_details(
  p_user_name text,
  p_email text,
  p_mobile_number text,
  p_college_name text,
  p_total_questions integer,
  p_correct_answers integer,
  p_time_taken_seconds integer,
  p_answers jsonb
) RETURNS uuid AS $$
DECLARE
  result_id uuid;
BEGIN
  INSERT INTO quiz_results (
    user_name,
    email,
    mobile_number,
    college_name,
    total_questions,
    correct_answers,
    time_taken_seconds,
    answers
  ) VALUES (
    p_user_name,
    p_email,
    p_mobile_number,
    p_college_name,
    p_total_questions,
    p_correct_answers,
    p_time_taken_seconds,
    p_answers
  ) RETURNING id INTO result_id;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFY SETUP
-- =====================================================

-- Count questions by difficulty
SELECT 
  difficulty,
  COUNT(*) as question_count
FROM quiz_questions
GROUP BY difficulty
ORDER BY difficulty;

-- Show all questions in order
SELECT 
  order_number,
  difficulty,
  LEFT(question_text, 50) || '...' as question_preview
FROM quiz_questions
ORDER BY order_number;
