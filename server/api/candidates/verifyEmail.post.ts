import type { IEmailVerificationResp } from "~/types/types";
export default defineEventHandler(async (event) => {
  const db = useDatabase();
  const body = await readBody(event);
  const email: string = body.email;

  const { rows } =
    await db.sql<any>`SELECT COUNT(*) as count FROM candidates WHERE email = ${email}`;
  let resp: IEmailVerificationResp = { uniqe: rows[0].count === 0 };
  return resp;
});
