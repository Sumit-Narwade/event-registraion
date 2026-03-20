-- TECH FEST 2025 Database Schema
-- Run this SQL in your PostgreSQL database to create the required tables

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  venue VARCHAR(255),
  event_date TIMESTAMP,
  price DECIMAL(10, 2) DEFAULT 0,
  image_url TEXT,
  category VARCHAR(100),
  max_participants INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  registration_id VARCHAR(50) UNIQUE NOT NULL,
  transaction_id VARCHAR(50) NOT NULL,
  event_id INTEGER REFERENCES events(id),
  event_name VARCHAR(255),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_mobile VARCHAR(20),
  college_name VARCHAR(255),
  address TEXT,
  amount_paid DECIMAL(10, 2),
  payment_id VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'pending',
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(50) UNIQUE NOT NULL,
  payment_id VARCHAR(100),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_mobile VARCHAR(20),
  total_amount DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_main_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sub_admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample events for TECH FEST 2025
INSERT INTO events (name, description, venue, event_date, price, image_url, category) VALUES
('Hackathon 2025', 'A 24-hour coding marathon to build innovative solutions. Showcase your coding skills and creativity!', 'Main Auditorium', '2025-03-15 09:00:00', 500, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', 'Coding'),
('AI/ML Workshop', 'Learn the fundamentals of Artificial Intelligence and Machine Learning from industry experts.', 'Lab 101', '2025-03-16 10:00:00', 300, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800', 'Workshop'),
('Robotics Challenge', 'Build and program robots to complete challenging tasks. Test your engineering skills!', 'Robotics Lab', '2025-03-17 11:00:00', 400, 'https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=800', 'Competition'),
('Cybersecurity CTF', 'Capture The Flag competition - Test your security skills by solving challenges.', 'Cyber Lab', '2025-03-18 14:00:00', 350, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', 'Security'),
('Web Dev Bootcamp', 'Intensive bootcamp covering modern web development technologies and frameworks.', 'Computer Lab 3', '2025-03-19 09:00:00', 250, 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800', 'Workshop'),
('Gaming Tournament', 'Esports tournament featuring popular competitive games. Compete for amazing prizes!', 'Gaming Arena', '2025-03-20 15:00:00', 200, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', 'Gaming'),
('Tech Talk: Future of AI', 'Panel discussion with tech leaders about the future of artificial intelligence.', 'Seminar Hall', '2025-03-21 16:00:00', 100, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', 'Talk'),
('Drone Racing', 'High-speed FPV drone racing competition. Experience the thrill of drone piloting!', 'Open Ground', '2025-03-22 10:00:00', 450, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800', 'Competition')
ON CONFLICT DO NOTHING;

-- Create default admin (password: abc)
-- Using plain text password hash as the login logic compares it directly
INSERT INTO admins (username, password_hash, role, is_main_admin) VALUES
('admin', 'abc', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- Create default sub-admin (password: abc)
INSERT INTO sub_admins (username, password_hash) VALUES
('subadmin', 'abc')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_transaction_id ON registrations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_id ON registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON transactions(transaction_id);
