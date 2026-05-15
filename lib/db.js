import { neon } from "@neondatabase/serverless";
import { unstable_cache, revalidateTag } from "next/cache";
import { DEADLINE_TYPES } from "./constants";

const DEADLINES_TAG = "deadlines";

// DATABASE_URL 未設定時の開発用フォールバック
let memoryStore = [
  {
    id: 1,
    company_name: "株式会社サンプル",
    deadline_date: "2026-05-20",
    type: "ES",
    memo: "Web ES 提出",
  },
  {
    id: 2,
    company_name: "テック株式会社",
    deadline_date: "2026-05-25",
    type: "アンケート",
    memo: "",
  },
];
let nextMemoryId = 3;

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

function validateInput({ company_name, deadline_date, type, memo }) {
  if (!company_name?.trim()) {
    throw new Error("企業名は必須です");
  }
  if (!deadline_date) {
    throw new Error("締め切り日は必須です");
  }
  if (!DEADLINE_TYPES.includes(type)) {
    throw new Error("種別が不正です");
  }
}

async function fetchAllDeadlines() {
  const sql = getSql();
  if (!sql) {
    return [...memoryStore].sort(
      (a, b) => new Date(a.deadline_date) - new Date(b.deadline_date)
    );
  }
  const rows = await sql`
    SELECT id, company_name, deadline_date::text, type, memo
    FROM deadlines
    ORDER BY deadline_date ASC
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
  validateInput(data);
  const { company_name, deadline_date, type, memo = "" } = data;

  const sql = getSql();
  if (!sql) {
    const item = {
      id: nextMemoryId++,
      company_name: company_name.trim(),
      deadline_date,
      type,
      memo: memo || "",
    };
    memoryStore.push(item);
    revalidateTag(DEADLINES_TAG);
    return item;
  }

  const rows = await sql`
    INSERT INTO deadlines (company_name, deadline_date, type, memo)
    VALUES (${company_name.trim()}, ${deadline_date}, ${type}, ${memo || ""})
    RETURNING id, company_name, deadline_date::text, type, memo
  `;
  revalidateTag(DEADLINES_TAG);
  return rowToDeadline(rows[0]);
}

export async function updateDeadline(id, data) {
  validateInput(data);
  const { company_name, deadline_date, type, memo = "" } = data;

  const sql = getSql();
  if (!sql) {
    const idx = memoryStore.findIndex((d) => d.id === Number(id));
    if (idx === -1) return null;
    memoryStore[idx] = {
      ...memoryStore[idx],
      company_name: company_name.trim(),
      deadline_date,
      type,
      memo: memo || "",
    };
    revalidateTag(DEADLINES_TAG);
    return memoryStore[idx];
  }

  const rows = await sql`
    UPDATE deadlines
    SET company_name = ${company_name.trim()},
        deadline_date = ${deadline_date},
        type = ${type},
        memo = ${memo || ""},
        updated_at = NOW()
    WHERE id = ${Number(id)}
    RETURNING id, company_name, deadline_date::text, type, memo
  `;
  if (rows.length === 0) return null;
  revalidateTag(DEADLINES_TAG);
  return rowToDeadline(rows[0]);
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
