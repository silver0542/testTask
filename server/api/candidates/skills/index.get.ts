export default defineEventHandler(async (event) => {
  const db = useDatabase();

  const { rows } = await db.sql`SELECT * FROM skills`;

  return { rows };
});
