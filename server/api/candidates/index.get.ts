import type {
  TCandidateListAPI,
  IQueryParams,
  ICandidate,
} from "~/types/types";

export default defineEventHandler(async (event) => {
  const query = getQuery<IQueryParams>(event);
  const page: number = Number(query.page ?? 1);

  const search_value: string = query.search_value ?? "";

  const per_page: number = Number(query.per_page ?? 5);
  const offset: number = page == 1 ? 0 : (page - 1) * per_page;

  const db = useDatabase();

  const { rows } = await db.sql<any>`
  SELECT * FROM candidates 
  WHERE first_name LIKE '%' || ${search_value} || '%'
     OR last_name LIKE '%' || ${search_value} || '%'
     OR email LIKE '%' || ${search_value} || '%'
     OR skills LIKE '%' || ${search_value} || '%'
  ORDER BY id DESC
  LIMIT ${per_page} OFFSET ${offset};
`;

  const total = await getCount();
  const result: TCandidateListAPI = {
    rows: rows,
    page: page,
    per_page: per_page,
    total: total,
  };

  return result;
});

const getCount = async () => {
  const db = useDatabase();
  const { rows } =
    await db.sql<any>`SELECT COUNT(*) AS total_count FROM candidates`;

  return rows[0].total_count;
};
