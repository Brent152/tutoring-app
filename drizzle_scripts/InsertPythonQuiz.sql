-- Insert a QuestionSet for the quiz
INSERT INTO question_sets (description, subject, title, created_at)
VALUES ('A quiz for beginners learning Python', 'Python', 'Python Basics Quiz', CURRENT_TIMESTAMP);

-- Get the ID of the newly inserted question set
SET @questionSetId = (SELECT MAX(id) FROM question_sets);

INSERT INTO questions (question_set_id, text, created_at)
VALUES 
(@questionSetId, 'What is the correct way to comment a line in Python?', CURRENT_TIMESTAMP),
(@questionSetId, 'What is the output of print(str(10) + "2")?', CURRENT_TIMESTAMP),
(@questionSetId, 'Which of the following is not a valid variable name declaration?', CURRENT_TIMESTAMP),
(@questionSetId, 'Which of the following data types does not support the "+" operation?', CURRENT_TIMESTAMP),
(@questionSetId, 'How do you create a function in Python?', CURRENT_TIMESTAMP),
(@questionSetId, 'What is the output of print(3 * "un" + "ium")?', CURRENT_TIMESTAMP),
(@questionSetId, 'How do you insert ITEMS from a list "b" into list "a"?', CURRENT_TIMESTAMP),
(@questionSetId, 'What is the output of print(list(range(10, 30, 2)))?', CURRENT_TIMESTAMP),
(@questionSetId1, 'What is the method to get the length of a list or tuple?', CURRENT_TIMESTAMP),
(@questionSetId, 'What does the "is" operator do in Python?', CURRENT_TIMESTAMP);

SET @questionId = (SELECT id FROM questions WHERE text = 'What is the correct way to comment a line in Python?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, '# This is a comment', true, CURRENT_TIMESTAMP),
(@questionId, '// This is a comment', false, CURRENT_TIMESTAMP),
(@questionId, '/* This is a comment */', false, CURRENT_TIMESTAMP),
(@questionId, '<!-- This is a comment -->', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about print output
SET @questionId = (SELECT id FROM questions WHERE text = 'What is the output of print(str(10) + "2")?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, '102', true, CURRENT_TIMESTAMP),
(@questionId, '12', false, CURRENT_TIMESTAMP),
(@questionId, '10.2', false, CURRENT_TIMESTAMP),
(@questionId, 'Error', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about valid variable name
SET @questionId = (SELECT id FROM questions WHERE text = 'Which of the following is not a valid variable name declaration?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, '1st_variable', true, CURRENT_TIMESTAMP),
(@questionId, '_variable', false, CURRENT_TIMESTAMP),
(@questionId, 'variable1', false, CURRENT_TIMESTAMP),
(@questionId, 'variable_name', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about data types supporting "+"
SET @questionId = (SELECT id FROM questions WHERE text = 'Which of the following data types does not support the "+" operation?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, 'set', true, CURRENT_TIMESTAMP),
(@questionId, 'string', false, CURRENT_TIMESTAMP),
(@questionId, 'list', false, CURRENT_TIMESTAMP),
(@questionId, 'tuple', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about creating a function
SET @questionId = (SELECT id FROM questions WHERE text = 'How do you create a function in Python?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, 'def myFunction():', true, CURRENT_TIMESTAMP),
(@questionId, 'function myFunction():', false, CURRENT_TIMESTAMP),
(@questionId, 'create myFunction():', false, CURRENT_TIMESTAMP),
(@questionId, 'myFunction() => {}', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about print output with strings
SET @questionId = (SELECT id FROM questions WHERE text = 'What is the output of print(3 * "un" + "ium")?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, 'unununium', true, CURRENT_TIMESTAMP),
(@questionId, 'uniumuniumunium', false, CURRENT_TIMESTAMP),
(@questionId, '3unium', false, CURRENT_TIMESTAMP),
(@questionId, 'Error', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about inserting items from list
SET @questionId = (SELECT id FROM questions WHERE text = 'How do you insert ITEMS from a list "b" into list "a"?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, 'a.extend(b)', true, CURRENT_TIMESTAMP),
(@questionId, 'a.append(b)', false, CURRENT_TIMESTAMP),
(@questionId, 'a.insert(b)', false, CURRENT_TIMESTAMP),
(@questionId, 'a.add(b)', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about print output with range
SET @questionId = (SELECT id FROM questions WHERE text = 'What is the output of print(list(range(10, 30, 2)))?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, '[10, 12, 14, 16, 18, 20, 22, 24, 26, 28]', true, CURRENT_TIMESTAMP),
(@questionId, '[10, 12, 14, 16, 18, 20]', false, CURRENT_TIMESTAMP),
(@questionId, '10, 12, 14, 16, 18, 20, 22, 24, 26, 28', false, CURRENT_TIMESTAMP),
(@questionId, 'Error', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about getting the length of a list or tuple
SET @questionId = (SELECT id FROM questions WHERE text = 'What is the method to get the length of a list or tuple?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, 'len()', true, CURRENT_TIMESTAMP),
(@questionId, 'length()', false, CURRENT_TIMESTAMP),
(@questionId, 'size()', false, CURRENT_TIMESTAMP),
(@questionId, 'count()', false, CURRENT_TIMESTAMP);

-- Insert answers for the question about the "is" operator
SET @questionId = (SELECT id FROM questions WHERE text = 'What does the "is" operator do in Python?');
INSERT INTO answers (question_id, text, correct, created_at)
VALUES 
(@questionId, 'Checks if both variables refer to the same object', true, CURRENT_TIMESTAMP),
(@questionId, 'Compares values of variables', false, CURRENT_TIMESTAMP),
(@questionId, 'Checks if variables are of the same type', false, CURRENT_TIMESTAMP),
(@questionId, 'Checks for value equality within a collection', false, CURRENT_TIMESTAMP);