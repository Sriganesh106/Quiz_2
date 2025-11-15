/*
  # Update Quiz Questions with Web Development Content

  ## Overview
  Replaces existing quiz questions with web development focused content.
  Updates all 15 questions to cover HTML, CSS, JavaScript, frameworks, and web technologies.

  ## Changes
  - Deletes all existing questions
  - Inserts 15 new web development questions
  - First 8 questions: Standard Round (choose correct answer)
  - Last 7 questions: Final Boss Round (choose INCORRECT answer)

  ## Question Topics
  Standard Round covers:
  - HTML semantics and structure
  - CSS fundamentals and layout
  - JavaScript basics and ES6+
  - Web APIs and browser features
  
  Boss Round covers advanced topics:
  - Framework concepts
  - Performance optimization
  - Modern web standards
  - Advanced JavaScript patterns
*/

-- Clear existing questions
DELETE FROM quiz_questions;

-- Insert new web development focused questions
INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, order_number) VALUES

-- Standard Round (8 questions - Choose CORRECT answer)
('Which HTML5 element is used to define navigation links?', '<navigation>', '<nav>', '<menu>', '<links>', 'b', 'standard', 1),

('What does CSS stand for?', 'Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets', 'c', 'standard', 2),

('Which JavaScript method is used to add elements to the end of an array?', 'append()', 'push()', 'add()', 'insert()', 'b', 'standard', 3),

('What is the correct way to declare a constant variable in JavaScript?', 'var myConst = 5;', 'let myConst = 5;', 'const myConst = 5;', 'constant myConst = 5;', 'c', 'standard', 4),

('Which CSS property is used to change the text color?', 'text-color', 'font-color', 'color', 'text-style', 'c', 'standard', 5),

('What does the "box-sizing: border-box;" CSS property do?', 'Adds a border to the box', 'Makes the box a square', 'Includes padding and border in the element total width and height', 'Removes the box shadow', 'c', 'standard', 6),

('Which method is used to parse a JSON string in JavaScript?', 'JSON.parse()', 'JSON.stringify()', 'JSON.decode()', 'JSON.read()', 'a', 'standard', 7),

('What is the purpose of the "async" attribute in a script tag?', 'Makes the script run after page load', 'Downloads the script asynchronously and executes it immediately', 'Prevents the script from executing', 'Makes the script run in a worker thread', 'b', 'standard', 8),

-- Final Boss Round (7 questions - Choose INCORRECT answer)
('Which of these is NOT a valid React Hook?', 'useState', 'useEffect', 'useContext', 'useRender', 'd', 'boss', 9),

('Which statement about CSS Grid is INCORRECT?', 'Grid can create two-dimensional layouts', 'Grid uses grid-template-columns and grid-template-rows', 'Grid cannot work together with Flexbox', 'Grid items can span multiple rows and columns', 'c', 'boss', 10),

('Which of the following is NOT a valid JavaScript data type?', 'String', 'Boolean', 'Float', 'Symbol', 'c', 'boss', 11),

('Which statement about the Virtual DOM in React is FALSE?', 'It is a lightweight copy of the actual DOM', 'It helps improve performance by minimizing direct DOM manipulation', 'It automatically makes your website faster without optimization', 'It calculates the most efficient way to update the browser DOM', 'c', 'boss', 12),

('Which of these is NOT a valid HTTP status code category?', '2xx Success', '3xx Redirection', '4xx Client Error', '6xx Server Timeout', 'd', 'boss', 13),

('Which statement about JavaScript closures is INCORRECT?', 'Closures allow functions to access variables from outer scope', 'Closures are created every time a function is created', 'Closures cannot access variables from parent functions after execution', 'Closures help in data encapsulation', 'c', 'boss', 14),

('Which of these is NOT a valid CSS pseudo-class?', ':hover', ':active', ':onclick', ':focus', 'c', 'boss', 15);