import { de } from "date-fns/locale";
import { api } from "./api";

export const useVoucher = async (data: IVoucherUse) => {
  const response = await api.post("/voucher/use", null, {
    params: {
      programCode: "073",
      voucherId: data.voucherId,
      productId: data.productId,
    },
  });
  return response.data;
};

export const rescueVoucher = async (data: IRescueVoucher) => {
  const response = await api.post("/voucher/rescue", null, {
    params: {
      programCode: "073",
      voucherId: data.voucherId,
    },
  });
  return response.data;
};

export const addVoucher = async (data: any) => {
  const response = await api.post("/voucher/add", data);
  return response.data;
};

export const updateVoucher = async (data: any) => {
  const response = await api.post("/voucher/update", data);
  return response.data;
};

export const deleteVoucher = async (id: string, programCode: string) => {
  const response = await api.post(
    `/voucher/delete?voucherId=${id}&programCode=${programCode}`
  );
  return response.data;
};

export const getListVoucher = async (filters?: any) => {
  const response = await api.get(`/voucher/list`, {
    params: {
      programCode: "073",
      ...filters,
    },
  });
  return response.data.value;
};

export const getVoucherTypes = async (filters?: any) => {
  const response = await api.get("/voucher/getVoucherTypes", {
    params: {
      programCode: "073",
      ...filters,
    },
  });
  return response.data;
};

export const getVoucherPatient = async (id: any) => {
  const response = await api.get(`/voucher/${id}`, {
    params: {
      programCode: "073",
    },
  });
  return response.data.value;
};

export const getListVoucherPatients = async (cpf:any) => {
  const response = await api.get("/voucher/listbypatient", {
    params: {
      programCode: "073",  
      cpf: cpf,
    },
  });
  return response.data.value;
};

export const getListAllPatients = async (filters?: any) => {
  const response = await api.get("/voucher/listallpatient", {
    params: {
      programCode: "073",
      ...filters,
    },
  });
  return response.data.value;
};

export const getResumeVoucher = async (filters?: any) => {
  const response = await api.get("/voucher/resulme", {
    params: {
      programCode: "073",
      ...filters,
    },
  });
  return response.data.value;
};

export const getListRescueVoucherPatients = async (filters?: any) => {
  const response = await api.get("/voucher/listbypatientrescue", {
    params: {
      programCode: "073",
      ...filters,
    },
  });
  return response.data.value;
};

export const getCodeNumberFields = async (filters?: any, codeNumber?:any) => {
  const response = await api.get("/logistic/stuff/codeNumber/fields", {
    params: {
      programCode: "073",
      codeNumber: codeNumber,
      ...filters,
    },
  });
  return response.data;
};


export const getCodeNumber = async (filters?: any, referenceId?:any) => {
  const response = await api.get("/logistic/stuff/codeNumber", {
    params: {
      programCode: "073",
      referenceId: referenceId,
      ...filters,
    },
  });
  return response.data;
};


export const getDegree = async (codeNumber?: string) => {
  const response = await api.get("/logistic/stuff/degree/voucher", {
    params: {
      programCode: "073",
      codeNumber: codeNumber,
    },
  });
  return response.data;
};

export const getCylinder = async (codeNumber?: string, degree?: string) => {
  const response = await api.get("/logistic/stuff/cylinder/voucher", {
    params: {
      programCode: "073",
      codeNumber: codeNumber,
      degree: degree,
    },
  });
  return response.data;
};

export const getAxle = async (
  codeNumber?: string,
  degree?: string,
  cylinder?: string
) => {
  const response = await api.get("/logistic/stuff/axle/voucher", {
    params: {
      programCode: "073",
      codeNumber: codeNumber,
      degree: degree,
      cylinder: cylinder,
    },
  });
  return response.data;
};

export const getAddition = async (
  codeNumber?: string,
  degree?: string,
  cylinder?: string,
  axe?: string
) => {
  const response = await api.get("/logistic/stuff/addition/voucher", {
    params: {
      programCode: "073",
      codeNumber: codeNumber,
      degree: degree,
      cylinder: cylinder,
      axe: axe,
    },
  });
  return response.data;
};

export const getAdditionTwo = async (
  codeNumber?: string,
  degree?: string,
) => {
  const response = await api.get("/logistic/stuff/addition/voucher", {
    params: {
      programCode: "073",
      degree: degree,
      codeNumber: codeNumber,
    },
  });
  return response.data;
};

export const listSalesByUser = async (filters?: any) => {
  const response = await api.get("/Voucher/rescue/user", {
    params: {
      programCode: "073",
      ...filters,
    },
  });
  return response.data.value;
};