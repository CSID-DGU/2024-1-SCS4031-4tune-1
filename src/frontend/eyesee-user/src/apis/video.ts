import { apiWithoutAuth } from ".";

export const videoPost = async (
  userId: number,
  startTime: string,
  endTime: string,
  video: File
) => {
  const formData = new FormData();

  formData.append("userId", userId.toString());
  formData.append("startOffset", new Date(startTime).toISOString());
  formData.append("endOffset", new Date(endTime).toISOString());
  formData.append("video", video);

  const response = await apiWithoutAuth.post(`/video`, formData);
  return response.data;
};
