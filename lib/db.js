import { neon } from "@neondatabase/serverless";
import { unstable_cache, revalidateTag } from "next/cache";
import { FALLBACK_TYPES } from "./constants";

const DEADLINES_TAG = "deadlines";
const TYPES_TAG = "deadline-types";
const COMPANIES_TAG = "companies";

// DATABASE_URL 未設定時の開発用フォールバック
let memoryCompanies = [
  { id: 1, name: "株式会社サンプル" },
  { id: 2, name: "テック株式会社" },
];
let nextCompanyId = 3;

let memoryStore = [
  {
    id: 1,
    company_id: 1,
    deadline_date: "2026-05-20",
    type: "ES",
    memo: "Web ES 提出",
  },
  {
    id: 2,
    company_id: 2,
    deadline_date: "2026-05-25",
    type: "アンケート",
    memo: "",
  },
];
let nextMemoryId = 3;

let memoryTypes = FALLBACK_TYPES.map((t) => ({ ...t }));
let nextTypeId = memoryTypes.length + 1;

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

function rowToDeadline(row) {
  return {
    id: row.id,
    company_name: row.company_name,
    deadline_date:
      typeof row.deadline_date === "string"
        ? row.deadline_date.slice(0, 10)
        : row.deadline_date,
    type: row.type,
    memo: row.memo || "",
  };
}

function rowToType(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    sort_order: row.sort_order,
  };
}

function validateBasicInput({ company_name, deadline_date }) {
  if (!company_name?.trim()) {
    throw new Error("企業名は必須です");
  }
  if (!deadline_date) {
    throw new Error("締め切り日は必須です");
  }
}

async function validateType(sql, type) {
  if (!type) {
    throw new Error("種別は必須です");
  }
  if (!sql) {
    if (!memoryTypes.some((t) => t.name === type)) {
      throw new Error("種別が不正です");
    }
    return;
  }
  const rows = await sql`SELECT 1 FROM deadline_types WHERE name = ${type}`;
  if (rows.length === 0) {
    throw new Error("種別が不正です");
  }
}

// 企業名から企業を取得、なければ作成して id を返す（1企業に複数の締め切りイベントがぶら下がる）
async function getOrCreateCompanyId(sql, name) {
  const rows = await sql`
    INSERT INTO companies (name) VALUES (${name})
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `;
  return rows[0].id;
}

function getOrCreateCompanyIdMemory(name) {
  const existing = memoryCompanies.find((c) => c.name === name);
  if (existing) return existing.id;
  const item = { id: nextCompanyId++, name };
  memoryCompanies.push(item);
  return item.id;
}

async function fetchAllDeadlines() {
  const sql = getSql();
  if (!sql) {
    return [...memoryStore]
      .map((d) => ({
        ...d,
        company_name:
          memoryCompanies.find((c) => c.id === d.company_id)?.name || "",
      }))
      .sort((a, b) => new Date(a.deadline_date) - new Date(b.deadline_date));
  }
  const rows = await sql`
    SELECT d.id, c.name AS company_name, d.deadline_date::text, d.type, d.memo
    FROM deadlines d
    JOIN companies c ON c.id = d.company_id
    ORDER BY d.deadline_date ASC
  `;
  return rows.map(rowToDeadline);
}

// 書き込み時に revalidateTag(DEADLINES_TAG) でキャッシュを無効化する
export const getAllDeadlines = unstable_cache(
  fetchAllDeadlines,
  ["deadlines:all"],
  { tags: [DEADLINES_TAG] }
);

export async function createDeadline(data) {
  validateBasicInput(data);
  const { deadline_date, type, memo = "" } = data;
  const companyName = data.company_name.trim();

  const sql = getSql();
  await validateType(sql, type);

  if (!sql) {
    const company_id = getOrCreateCompanyIdMemory(companyName);
    const item = {
      id: nextMemoryId++,
      company_id,
      deadline_date,
      type,
      memo: memo || "",
    };
    memoryStore.push(item);
    revalidateTag(DEADLINES_TAG);
    revalidateTag(COMPANIES_TAG);
    return rowToDeadline({ ...item, company_name: companyName });
  }

  const companyId = await getOrCreateCompanyId(sql, companyName);
  const rows = await sql`
    INSERT INTO deadlines (company_id, deadline_date, type, memo)
    VALUES (${companyId}, ${deadline_date}, ${type}, ${memo || ""})
    RETURNING id, deadline_date::text, type, memo
  `;
  revalidateTag(DEADLINES_TAG);
  revalidateTag(COMPANIES_TAG);
  return rowToDeadline({ ...rows[0], company_name: companyName });
}

export async function updateDeadline(id, data) {
  validateBasicInput(data);
  const { deadline_date, type, memo = "" } = data;
  const companyName = data.company_name.trim();

  const sql = getSql();
  await validateType(sql, type);

  if (!sql) {
    const idx = memoryStore.findIndex((d) => d.id === Number(id));
    if (idx === -1) return null;
    const company_id = getOrCreateCompanyIdMemory(companyName);
    memoryStore[idx] = {
      ...memoryStore[idx],
      company_id,
      deadline_date,
      type,
      memo: memo || "",
    };
    revalidateTag(DEADLINES_TAG);
    revalidateTag(COMPANIES_TAG);
    return rowToDeadline({ ...memoryStore[idx], company_name: companyName });
  }

  const companyId = await getOrCreateCompanyId(sql, companyName);
  const rows = await sql`
    UPDATE deadlines
    SET company_id = ${companyId},
        deadline_date = ${deadline_date},
        type = ${type},
        memo = ${memo || ""},
        updated_at = NOW()
    WHERE id = ${Number(id)}
    RETURNING id, deadline_date::text, type, memo
  `;
  if (rows.length === 0) return null;
  revalidateTag(DEADLINES_TAG);
  revalidateTag(COMPANIES_TAG);
  return rowToDeadline({ ...rows[0], company_name: companyName });
}

export async function deleteDeadline(id) {
  const sql = getSql();
  if (!sql) {
    const before = memoryStore.length;
    memoryStore = memoryStore.filter((d) => d.id !== Number(id));
    const changed = memoryStore.length < before;
    if (changed) revalidateTag(DEADLINES_TAG);
    return changed;
  }
  const rows = await sql`
    DELETE FROM deadlines WHERE id = ${Number(id)} RETURNING id
  `;
  if (rows.length > 0) revalidateTag(DEADLINES_TAG);
  return rows.length > 0;
}

// ---- 企業 (companies) ----
// 締め切り追加フォームの企業名オートコンプリート用に一覧を提供する

async function fetchAllCompanies() {
  const sql = getSql();
  if (!sql) {
    return [...memoryCompanies].sort((a, b) => a.name.localeCompare(b.name, "ja"));
  }
  const rows = await sql`SELECT id, name FROM companies ORDER BY name ASC`;
  return rows;
}

export const getAllCompanies = unstable_cache(
  fetchAllCompanies,
  ["companies:all"],
  { tags: [COMPANIES_TAG] }
);

// ---- 締め切り種別 (deadline_types) ----

function validateTypeInput({ name, color }) {
  if (!name?.trim()) {
    throw new Error("種別名は必須です");
  }
  if (!color) {
    throw new Error("色を選択してください");
  }
}

async function fetchAllTypes() {
  const sql = getSql();
  if (!sql) {
    return [...memoryTypes].sort((a, b) => a.sort_order - b.sort_order);
  }
  const rows = await sql`
    SELECT id, name, color, sort_order
    FROM deadline_types
    ORDER BY sort_order ASC, id ASC
  `;
  return rows.map(rowToType);
}

// 書き込み時に revalidateTag(TYPES_TAG) でキャッシュを無効化する
export const getAllTypes = unstable_cache(
  fetchAllTypes,
  ["deadline-types:all"],
  { tags: [TYPES_TAG] }
);

export async function createType(data) {
  validateTypeInput(data);
  const name = data.name.trim();
  const { color } = data;

  const sql = getSql();
  if (!sql) {
    if (memoryTypes.some((t) => t.name === name)) {
      throw new Error("同じ名前の種別が既にあります");
    }
    const item = {
      id: nextTypeId++,
      name,
      color,
      sort_order: memoryTypes.length,
    };
    memoryTypes.push(item);
    revalidateTag(TYPES_TAG);
    return item;
  }

  try {
    const rows = await sql`
      INSERT INTO deadline_types (name, color, sort_order)
      VALUES (
        ${name},
        ${color},
        COALESCE((SELECT MAX(sort_order) + 1 FROM deadline_types), 0)
      )
      RETURNING id, name, color, sort_order
    `;
    revalidateTag(TYPES_TAG);
    return rowToType(rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      throw new Error("同じ名前の種別が既にあります");
    }
    throw e;
  }
}

export async function updateType(id, data) {
  validateTypeInput(data);
  const name = data.name.trim();
  const { color } = data;

  const sql = getSql();
  if (!sql) {
    const idx = memoryTypes.findIndex((t) => t.id === Number(id));
    if (idx === -1) return null;
    if (memoryTypes.some((t) => t.id !== Number(id) && t.name === name)) {
      throw new Error("同じ名前の種別が既にあります");
    }
    const oldName = memoryTypes[idx].name;
    memoryTypes[idx] = { ...memoryTypes[idx], name, color };
    memoryStore.forEach((d) => {
      if (d.type === oldName) d.type = name;
    });
    revalidateTag(TYPES_TAG);
    revalidateTag(DEADLINES_TAG);
    return memoryTypes[idx];
  }

  try {
    const rows = await sql`
      UPDATE deadline_types
      SET name = ${name}, color = ${color}
      WHERE id = ${Number(id)}
      RETURNING id, name, color, sort_order
    `;
    if (rows.length === 0) return null;
    revalidateTag(TYPES_TAG);
    // 種別名の変更は ON UPDATE CASCADE で deadlines.type にも反映されるためキャッシュも無効化
    revalidateTag(DEADLINES_TAG);
    return rowToType(rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      throw new Error("同じ名前の種別が既にあります");
    }
    throw e;
  }
}

export async function deleteType(id) {
  const sql = getSql();
  if (!sql) {
    const target = memoryTypes.find((t) => t.id === Number(id));
    if (!target) return { ok: false, reason: "not_found" };
    const inUse = memoryStore.some((d) => d.type === target.name);
    if (inUse) return { ok: false, reason: "in_use" };
    memoryTypes = memoryTypes.filter((t) => t.id !== Number(id));
    revalidateTag(TYPES_TAG);
    return { ok: true };
  }

  try {
    const rows = await sql`
      DELETE FROM deadline_types WHERE id = ${Number(id)} RETURNING id
    `;
    if (rows.length === 0) return { ok: false, reason: "not_found" };
    revalidateTag(TYPES_TAG);
    return { ok: true };
  } catch (e) {
    // 外部キー制約違反 = 使用中の種別
    if (e.code === "23503") {
      return { ok: false, reason: "in_use" };
    }
    throw e;
  }
}

// orderedIds の並び順どおりに sort_order (0, 1, 2, ...) を振り直す
export async function reorderTypes(orderedIds) {
  const ids = orderedIds.map(Number);

  const sql = getSql();
  if (!sql) {
    ids.forEach((id, index) => {
      const t = memoryTypes.find((t) => t.id === id);
      if (t) t.sort_order = index;
    });
    revalidateTag(TYPES_TAG);
    return;
  }

  await Promise.all(
    ids.map((id, index) => sql`
      UPDATE deadline_types SET sort_order = ${index} WHERE id = ${id}
    `)
  );
  revalidateTag(TYPES_TAG);
}
