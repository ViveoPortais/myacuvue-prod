import React, { useState } from "react";
import ButtonEcpVoucher from "@/components/button/ButtonEcpVoucher";
import useDataStorage from "@/hooks/useDataStorage";
import ButtonValidateVoucherEcp from "@/components/button/ButtonValidateVoucherEcp";
import Button from "@/components/button/Button";
import useValidateEcpVoucher from "@/hooks/useValidateEcpVoucher";

export interface Rows {
  id: string;
  discountType: string;
  deadlineInDays: number;
  discountValue: number;
  statusRescue: string;
  status: string;
  number: string;
  createdDate: string;
  quantityBox: string;
}

export const TableMockupValidateVoucher: TableData = {
  columns: [
    {
      field: "number",
      headerName: "ID",   
      minWidth: 150,  
      sortable: false,
      flex: 1,
    },
    {
      field: "discountType",
      headerName: "Promoção",
      minWidth: 150,   
      sortable: false,
      flex: 1,
    },
     {
      field: "discountValue",
      headerName: "Desconto",
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const discount = Math.round(params.value);
        return (
          <div className="bg-[#EAF6FD] border border-[#EAF6FD] rounded-full w-20 py-2 text-center text-careLightBlue font-bold text-base">
            <span>{discount}%</span>
          </div>
        );
      },
    },
     {
      field: "status",
      headerName: "Status", 
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params: any) => (

        
        <div className={`w-full`}>
          {params.value === "9f98e94f-499b-4dcb-ac3c-383179dbc3e2" && (

            <div className="bg-careDarkPurple border border-careDarkPurple rounded-full w-full md:w-36  py-2 text-center text-white">
              <span>Resgatado</span>
            </div>
           
          )}
        </div>
      ),
    },
   {
  field: "deadlineInDays",
  headerName: "Prazo",
  minWidth: 150,
  sortable: false,
  flex: 1,
 renderCell: (params: { value: any }) => {
  const prazo = params.value ?? 0;
  const isAtrasado = Number(prazo) === 0;

  return (
    <div>
      <span className={`font-bold ${isAtrasado ? "text-red-500" : "text-black"}`}>
        {`${prazo} dias`}
      </span>{" "}
      <span className="font-normal">restantes</span>
    </div>
  );
}
},
   
    {
      field: "voucherRescue",
      headerName: "Ações",
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const useValideEcp = useValidateEcpVoucher();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const dataStorage = useDataStorage()

        const handleVoucherRescue = () => {
          useValideEcp.onOpen();
          dataStorage.setIdProduct(params.row.number);
          dataStorage.setPromotionName(params.row.discountType);
          dataStorage.setPorcentPromotion(params.row.discountValue);
          dataStorage.setIdVoucher(params.row.id);
          dataStorage.setCpf(params.row.cpf);
          dataStorage.setQuantityBox(params.row.quantityBox);
        }

        return (
          <div className={`w-24 md:w-40`}>
            <Button
            onClick={handleVoucherRescue}
              id="button-resgatar-voucher-por-cpf-partiner-ecp"
              label="APLICAR"
              customClass="bg-careDarkBlue border-careDarkBlue h-12  w-full text-sm mr-2 "
            />
          </div>
        );
      },
    },
  ],

  rows: [
    {
      id: "1",
      voucherRescue: "Utilizar",
      status: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      deadlineInDays: "30 dias",
      discountValue: "R$ 100,00",
      discountType: "COMBO LEVE 4 PAGUE 3",
    },
  ],
};
