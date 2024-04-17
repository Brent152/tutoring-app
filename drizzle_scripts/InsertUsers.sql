@CURRENT_TIMESTAMP = NOW();

INSERT INTO users (username, email, first_name, last_name, created_at, updated_at)
VALUES (
    ('brent152', 'btjulius@asu.edu', 'Brent', 'Julius', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('afausett', 'afausett@asu.edu', 'Andrew', 'Fausett', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
);
