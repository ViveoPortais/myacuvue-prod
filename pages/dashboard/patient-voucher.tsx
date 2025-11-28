import VoucherPatient from "@/components/voucher/VoucherPatient";
import React, { useEffect, useState } from "react";
import {getClientDataNew } from "@/services/login";
import useDataStorage from "@/hooks/useDataStorage";



const PatientVoucher = () => {
  const dataStorage = useDataStorage();



  useEffect(() => {
    getClientDataNew().then((response) => {
      dataStorage.setCpf(response.data[0]?.cpf);
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [dataStorage.cpf]);

       
  return (
    <div>
      <VoucherPatient  />
    </div>
  );
};

export default PatientVoucher;
