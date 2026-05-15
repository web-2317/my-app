-- Neon で実行する初期スキーマ
CREATE TABLE IF NOT EXISTS deadlines (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  deadline_date DATE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('ES', 'アンケート', 'その他')),
  memo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 一覧の ORDER BY deadline_date ASC を高速化
CREATE INDEX IF NOT EXISTS idx_deadlines_deadline_date ON deadlines (deadline_date);
