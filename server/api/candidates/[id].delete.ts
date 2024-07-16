export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return {
      statusCode: 400,
      body: "Missing candidate ID",
    };
  }
  const db = useDatabase();
  //================
  // Here should be logic to remove file from cloud;
  // I should get file url from db, and send it to remove endpoint
  // then remove record from db
  // ===============
  const deleteQuery =
    await db.sql<any>`DELETE FROM candidates WHERE id = ${id}`;

  if (!deleteQuery.success) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete candidate",
    });
  }

  return {
    statusCode: 200,
    statusMessage: "Candidate deleted successfully",
  };
});
