-- Створюємо таблицю contacts
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    favorite BOOLEAN DEFAULT FALSE
);

-- Тестові дані 
INSERT INTO contacts (name, email, phone, favorite) VALUES
('Alice', 'alice@example.com', '1234567', true),
('Bob', 'bob@example.com', '9876543', false),
('Charlie', 'charlie@example.com', '5556667', false);
