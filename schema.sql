CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'INSPECTOR',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
  report_no TEXT PRIMARY KEY,
  employer TEXT NOT NULL,
  location TEXT NOT NULL,
  equipment_desc TEXT NOT NULL,
  safe_working_load TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  status TEXT DEFAULT 'PASS'
);