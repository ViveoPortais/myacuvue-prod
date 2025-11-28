import { api } from "./api";

export const listEditCalendar = async () => {
  const response = await api.get(`/account/list`, {
    params: {
      isSelf: true,
      programCode: "073",
      pageSize: 1000000000,
      friendlyCode: "",
      mainContact: "",
    },
  });
  return response.data;
};
