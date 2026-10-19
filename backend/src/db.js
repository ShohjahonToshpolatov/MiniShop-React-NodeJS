import "dotenv/config";
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", () => {
  console.error("Baza ulanishda xatolik");
});

export function query(text, params) {
  return pool.query(text, params);
}
