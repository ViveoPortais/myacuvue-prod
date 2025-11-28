import { api } from "./api";

export const userLogin = async (data: ILoginData) => {
  const response = await api.post("/login", data);
  return response.data;
};

export const changePassword = async (data: IChangePasswordData) => {
  const response = await api.post("/changePassword", data);
  return response.data;
};

export const registerUser = async (data: IRegisterAccount) => {
  const response = await api.post("/diagnostic/add", data);
  return response.data;
};

export const registerAdm = async (data: IRegisterAdm) => {
  const response = await api.post("/user/create", data);
  return response.data;
};

export const resetPassword = async (data: IResetPasswordData) => {
  const response = await api.post("user/forgotpassword", data);
  return response.data;
};

export const resendToken = async (data: any) => {
  const response = await api.post("/diagnostic/resendTokenRegister", data);
  return response.data;
};

export const newPassword = async (data: INewPasswordData) => {
  const response = await api.post("/validatechangepasswordtoken", data);
  return response.data;
};

export const confirmationRegisterSmsToken = async (
  data: IConfirmationRegisterSmsToken
) => {
  const response = await api.post("/validateRegisterTokenSmsAndEmail", data);
  return response.data;
};

export const getClientData = async () => {
  const response = await api.get<IDateClient>("/diagnostic/getdiagnostics", {
    params: {
      programCode: "073",
    },
  });
  return response.data;
};

export const getClientDataNew = async () => {
  const response = await api.get("/diagnostic/getdiagnostics", {
    params: {
      programCode: "073",
      
    },
  });
  return response.data;
};

export const editClientData = async (data: IEditClientData) => {
  const response = await api.post("/diagnostic/updatediagnostic", data);
  return response.data;
};

export const editAdminData = async (data: IEditAdminData) => {
  const response = await api.post("/user/update", data);
  return response.data;
};

export const getAdmData = async () => {
  const response = await api.get("/user/getuserbyidaslistmodel", {
    params: {
      programCode: "073",
    },
  });
  return response.data;
};

export const strongPassword = async (data: string) => {
  const response = await api.post("/standard/validate", null, {
    params: {
      password: data,
    },
  });
  return response.data;
};
