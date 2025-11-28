import { api } from "./api";

export const logisticStuffDegree = async (value: any) => {
  const response = await api.get(`/Logistic/stuff/degree/${value}`, {
    params: {
      programCode: "073",
    },
  });
  return response.data;
};

export const logisticStuffCylinder = async (degree: any, value: any) => {
  const response = await api.get(`/Logistic/stuff/cylinder/${value}`, {
    params: {
      programCode: "073",
      degree: degree,
    },
  });
  return response.data;
};

export const logisticStuffAxle = async (
  degree: any,
  cylinder: any,
  value: any
) => {
  const response = await api.get(`/Logistic/stuff/axle/${value}`, {
    params: {
      programCode: "073",
      degree: degree,
      cylinder: cylinder,
    },
  });
  return response.data;
};

export const logisticStuffAddition = async (degree: any, value: any) => {
  const response = await api.get(`/Logistic/stuff/addition/${value}`, {
    params: {
      programCode: "073",
      degree: degree,
    },
  });
  return response.data;
};
