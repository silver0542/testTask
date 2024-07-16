import type { ICandidate } from "~/types/types";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const db = useDatabase();
  const formData = await readFormData(event);
  const cv_file = formData.get("resume_file") as File;

  const uploadCv = await uploadFile(
    cv_file,
    config.cloudKey,
    config.cloudFolder
  );
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

  const inserQuery =
    await db.sql<any>`INSERT INTO candidates ('first_name', 'last_name', 'email', 'bio', 'skills', 'resume_file', 'github_url') VALUES 
     (${data.first_name}, ${data.last_name}, ${data.email}, ${data.bio}, ${skills}, ${uploadCv}, ${data.github_url})
    `;

  if (!inserQuery.success) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to insert candidate",
    });
  }
  return {
    statusCode: 200,
    statusMessage: "Candidate inserted successfully",
  };
});

export const uploadFile = async (file: File, key: string, folderID: string) => {
  // Upload File logic

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderId", folderID);

  try {
    const uploadResponse = await fetch(
      "https://store1.gofile.io/contents/uploadfile",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
        },
        body: formData,
      }
    );

    const uploadResult = await uploadResponse.json();
    // console.log(uploadResult);
    if (uploadResult.status !== "ok") {
      // throw new Error(`Failed to upload file: ${uploadResult.message}`);
      console.log("Error uploading");
      return "/failed/upload.pdf";
    }

    return uploadResult.data.downloadPage;
  } catch (err) {
    console.log("Error uploading", err);
    return "/failed/upload.pdf";
  }
};
