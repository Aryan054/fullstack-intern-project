-- Create database
CREATE DATABASE IF NOT EXISTS teacher_auth_db;
USE teacher_auth_db;

-- Create auth_user table
CREATE TABLE auth_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create teachers table with 1-1 relationship
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    university_name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL DEFAULT 'other',
    year_joined YEAR NOT NULL,
    department VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO auth_user (email, first_name, last_name, password, profile_picture) VALUES
('john.doe@university.edu', 'John', 'Doe', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL),
('jane.smith@university.edu', 'Jane', 'Smith', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL),
('aryanrathod791@gmail.com', 'Aryan', 'Rathod', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL);

INSERT INTO teachers (user_id, university_name, gender, year_joined, department) VALUES
(1, 'Savitribai Phule Pune University', 'male', 2020, 'Computer Science'),
(2, 'Savitribai Phule Pune University', 'female', 2019, 'Mathematics'),
(3, 'Savitribai Phule Pune University', 'male', 2021, 'Artificial Intelligence and Machine Learning');