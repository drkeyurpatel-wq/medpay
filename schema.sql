-- MedPay Database Schema
-- Apply with: npx wrangler d1 execute medpay-db --file=schema.sql

-- Doctors registered in the system
CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT,
  pin TEXT,
  active INTEGER DEFAULT 1
);

-- One row per doctor = their full contract definition
CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id),
  contract_type TEXT NOT NULL,
  mgm_amount REAL,
  threshold_amount REAL,
  incentive_pct REAL,
  retainer_pool_pct REAL,
  cash_base_method TEXT,
  cash_b_pct REAL,
  cash_self_pct REAL,
  cash_other_pct REAL,
  tpa_base_method TEXT,
  tpa_b_pct REAL,
  tpa_self_pct REAL,
  tpa_other_pct REAL,
  pmjay_base_method TEXT,
  pmjay_pct REAL,
  pmjay_in_mgm_pool INTEGER DEFAULT 1,
  govt_base_method TEXT,
  govt_b_pct REAL,
  govt_self_pct REAL,
  govt_other_pct REAL,
  opd_non_govt_pct REAL,
  opd_govt_pct REAL,
  rb_hospital_fixed REAL,
  rb_includes_robotic INTEGER,
  notes TEXT,
  effective_date TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Fixed procedure packages
CREATE TABLE IF NOT EXISTS procedure_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id),
  procedure_keyword TEXT NOT NULL,
  doctor_fee REAL NOT NULL
);

-- eCW name aliases -> canonical doctor name
CREATE TABLE IF NOT EXISTS doctor_aliases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT NOT NULL UNIQUE,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id)
);

-- Monthly settlement records
CREATE TABLE IF NOT EXISTS monthly_settlements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id),
  month TEXT NOT NULL,
  centre TEXT NOT NULL,
  calculated_pool REAL,
  pmjay_pool REAL,
  final_payout REAL,
  mgm_triggered INTEGER,
  incentive_triggered INTEGER,
  incentive_amount REAL,
  notes TEXT,
  locked INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Individual bill calculation log (audit trail)
CREATE TABLE IF NOT EXISTS bill_calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  settlement_id INTEGER REFERENCES monthly_settlements(id),
  bill_no TEXT,
  patient_name TEXT,
  consulting_doctor TEXT,
  referring_doctor TEXT,
  payor_type TEXT,
  payor_raw TEXT,
  base_method TEXT,
  base_amount REAL,
  self_ref INTEGER,
  split_pct REAL,
  doctor_earning REAL,
  pkg_override INTEGER DEFAULT 0,
  pkg_name TEXT,
  centre TEXT,
  bill_date TEXT,
  flagged INTEGER DEFAULT 0,
  flag_reason TEXT
);
