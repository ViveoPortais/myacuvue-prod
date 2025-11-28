import { api } from "./api";

export const schedulevisittoclinic = async (data: any) => {
  const response = await api.post("/diagnostic/schedulevisittoclinic", {
    ...data,
    programCode: "073",
    description: "Agendamento de adaptação de lentes de contato",
  });
  return response.data;
};

export const listVisitiClinic = async () => {
  const response = await api.get(`/diagnostic/listvisitstoclinic`, {
    params: {
      programCode: "073",
      isPreScheduling: true,
      pageSize: 1000000000,
    },
  });
  return response.data;
};

export const listConfirmedVisitiClinic = async () => {
  const response = await api.get(`/diagnostic/listvisitattendance`, {
    params: {
      programCode: "073",
      pageSize: 1000000000,
    },
  });
  return response.data;
};

export const getPatientData = async (visitid: string) => {
  const response = await api.get(`/diagnostic/listvisitdetails`, {
    params: {
      programCode: "073",
      visitid: visitid,
    },
  });
  return response.data;
};

export const confirmVisitClinic = async (data: any) => {
  const response = await api.post("/diagnostic/confirmvisittoclinic", null, {
    params: {
      programCode: "073",
      visitid: data.visitid,
    },
  });
  return response.data;
};

export const cancelVisitClinic = async (data: any) => {
  const response = await api.post("/diagnostic/cancelvisittoclinic", null, {
    params: {
      programCode: "073",
      visitid: data.visitid,
    },
  });
  return response.data;
};

// export const confirmVisitAttendance = async (data: any) => {
//   const response = await api.post("/diagnostic/confirmvisitattendance", {
//     programCode: "073",
//     originEntityId: data.originEntityId,
//   });
//   return response.data;
// };

export const cancelVisitAttendance = async (data: any) => {
  const response = await api.post("/diagnostic/cancelvisitattendance", {
    programCode: "073",
    originEntityId: data.originEntityId,
  });
  return response.data;
};

// export const patientNotAttended = async (data: any) => {
//   const response = await api.post("/diagnostic/patientnotattended", {
//     programCode: "073",
//     originEntityId: data.originEntityId,
//   });
//   return response.data;
// };

export const listVisitiClinicTwo = async () => {
  const response = await api.get(`/Diagnostic/listvisitstoclinic`, {
    params: {
      programCode: "073",
      pageSize: 1000000000,
    },
  });
  return response.data;
};

export const listVisitiClinicIndInvidual = async (visitId: any) => {
  const response = await api.get(`/Diagnostic/listvisitstoclinic`, {
    params: {
      programCode: "073",
      visitId: visitId,
    },
  });
  return response.data;
};

export const cancelVisittoClinic = async (data: ICancelVisit) => {
  const response = await api.post("/diagnostic/cancelvisittoclinic", data);
  return response.data;
};

export const patientNotAttended = async (data: INotAttendedVisit) => {
  const response = await api.post("/diagnostic/patientnotattended", data);
  return response.data;
};

export const confirmVisitAttendance = async (data: IAttendedVisit) => {
  const response = await api.post("/diagnostic/confirmvisitattendance", data);
  return response.data;
};

export const editVisittoClinic = async (data: IEditVisit) => {
  const response = await api.post("/diagnostic/editvisittoclinic", data);
  return response.data;
};

export const blockDateTimeVisit = async (data: any) => {
  const response = await api.post(
    "/diagnostic/blockanddesblockdatetimevisit",
    data
  );
  return response.data;
};

export const patientHasScheduling = async () => {
  const response = await api.get(`/diagnostic/hasVisit`, {
    params: {
      programCode: "073",
    },
  });
  return response.data;
};
