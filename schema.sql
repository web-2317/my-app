-- Neon で実行するスキーマ

-- 企業マスタ（1つの企業に複数の締め切りイベントがぶら下がる）
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 締め切り種別マスタ（ユーザーが自由に追加・編集・削除できる）
CREATE TABLE IF NOT EXISTS deadline_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(20) NOT NULL DEFAULT 'gray',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期データ（元の固定種別をそのまま登録）
INSERT INTO deadline_types (name, color, sort_order) VALUES
  ('ES', 'blue', 0),
  ('アンケート', 'orange', 1),
  ('その他', 'pink', 2)
ON CONFLICT (name) DO NOTHING;

-- 締め切りイベント（企業 1 : イベント多）
CREATE TABLE IF NOT EXISTS deadlines (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  deadline_date DATE NOT NULL,
  type VARCHAR(50) NOT NULL,
  memo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deadlines DROP CONSTRAINT IF EXISTS deadlines_type_check;
ALTER TABLE deadlines DROP CONSTRAINT IF EXISTS deadlines_type_fkey;
ALTER TABLE deadlines
  ADD CONSTRAINT deadlines_type_fkey
  FOREIGN KEY (type) REFERENCES deadline_types (name)
  ON UPDATE CASCADE ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_deadlines_deadline_date ON deadlines (deadline_date);
CREATE INDEX IF NOT EXISTS idx_deadlines_company_id ON deadlines (company_id);
