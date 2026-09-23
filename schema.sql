-- Neon で実行するスキーマ

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

CREATE TABLE IF NOT EXISTS deadlines (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  deadline_date DATE NOT NULL,
  type VARCHAR(50) NOT NULL,
  memo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 既存カラムが VARCHAR(20) の場合に備えて拡張（種別名の長さ制限を deadline_types と揃える）
ALTER TABLE deadlines ALTER COLUMN type TYPE VARCHAR(50);

-- type は種別マスタの name を参照する
-- ON UPDATE CASCADE: 種別名を変更したら既存の締め切りにも自動反映
-- ON DELETE RESTRICT: 使用中の種別は削除できない（アプリ側でも事前チェックする）
ALTER TABLE deadlines DROP CONSTRAINT IF EXISTS deadlines_type_check;
ALTER TABLE deadlines DROP CONSTRAINT IF EXISTS deadlines_type_fkey;
ALTER TABLE deadlines
  ADD CONSTRAINT deadlines_type_fkey
  FOREIGN KEY (type) REFERENCES deadline_types (name)
  ON UPDATE CASCADE ON DELETE RESTRICT;

-- 一覧の ORDER BY deadline_date ASC を高速化
CREATE INDEX IF NOT EXISTS idx_deadlines_deadline_date ON deadlines (deadline_date);
