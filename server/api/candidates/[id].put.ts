import type { ICandidate } from "~/types/types";
import { uploadFile } from "./index.post";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    return {
      statusCode: 400,
      body: "Missing candidate ID",
    };
  }
  const formData = await readFormData(event);
  const db = useDatabase();
  const cv_file = formData.get("resume_file");

  let uploadCv = "";
  if (typeof cv_file === "object") {
    // If cv_file is a File object, upload it
    uploadCv = await uploadFile(
      cv_file as File,
      config.cloudKey,
      config.cloudFolder
    );
  } else {
    // If cv_file is not a File (e.g., it's a string), use it as-is
    uploadCv = String(cv_file);
  }

  const data: ICandidate = {
    id: -1,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    bio: formData.get("bio") as string,
    skills: formData.get("skills") as string,
    resume_file: uploadCv as string,
    github_url: formData.get("github_url") as string,
  };

  let skills = Array.isArray(data.skills)
    ? data.skills.join(", ")
    : data.skills;

  const updateQuery = await db.sql<any>`UPDATE candidates SET
    first_name = ${data.first_name},
    last_name = ${data.last_name},
    email = ${data.email},
    bio = ${data.bio},
    skills = ${skills},
    resume_file = ${uploadCv},
    github_url = ${data.github_url}
    WHERE id = ${id}`;

  if (!updateQuery.success) {
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
