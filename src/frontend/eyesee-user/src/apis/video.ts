import { api } from ".";

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

  const response = await api.post(`/cheatings/video`, formData);
  return response.data;
};
