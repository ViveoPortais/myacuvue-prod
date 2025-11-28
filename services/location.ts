import { api } from "./api";

export const getLocation = async (filters?: any) => {
  const response = await api.get(`/diagnostic/listnearbyaccounts`, {
    params: {
      postalCode: "",
      programCode: "073",
      pageSize: 10,
      ...filters,
    },
  });
  return response.data;
};
