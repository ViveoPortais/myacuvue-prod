import CardAdmin from "@/components/cards/CardAdmin";
import CardPacient from "@/components/cards/CardPacient";
import CardEcp from "@/components/cards/CardEcp";

import useLogin from "@/hooks/useLogin";
import React from "react";
import CardPdv from "@/components/cards/CardPdv";
import DataAdmin from "@/components/myData/DataAdmin";
import DataPartiner from "@/components/myData/DataPartiner";
import DataPatient from "@/components/myData/DataPatient";

const Profile = () => {
  const auth = useLogin();
  const isEcpUser = auth.role === "Partner ECP VisionCare";
  const isPdvUser = auth.role === "Partner POS VisionCare";
  const isPatientUser = auth.role === "Patient VisionCare";
  const isAdminUser = auth.role === "Admin JeJ - VisionCare";

  return (
    <div className="fade-in">
      {isAdminUser ? (
        <DataAdmin />
      ) : isEcpUser ? (
        <DataPartiner />
      ) : isPdvUser ? (
        <DataPartiner />
      ) : isPatientUser ? (
        <DataPatient />
      ) : null}
    </div>
  );
};

export default Profile;
