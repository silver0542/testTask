import type {
  TCandidateListAPI,
  IQueryParams,
  ICandidate,
} from "~/types/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return {
      statusCode: 400,
      body: "Missing candidate ID",
    };
  }

  const db = useDatabase();

  const { rows } = await db.sql<any>`
    SELECT * FROM candidates 
    WHERE id=${id};
  `;

  const result: ICandidate = rows[0];

  return result;
});
