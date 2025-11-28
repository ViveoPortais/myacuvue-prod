import ButtonRescueVoucher from "@/components/button/ButtonRescueVoucher";

export interface Rows {
  number: string;
  discountType: string;
  deadlineInDays: number;
  discountValue: number;
  status: string;
}

export const TableUserPacient: TableData = {
  columns: [
    {
      field: "number",
      headerName: "ID",
      minWidth: 95,
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
    },
    {
      field: "discountType",
      headerName: "Serviço",
      minWidth: 95,
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
    },
    {
      field: "deadlineInDays",
      headerName: "Prazo",
      headerAlign: "center",
      minWidth: 95,
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
      renderCell: (params: { value: any }) => `${params.value} dias`,
    },
    {
      field: "discountValue",
      headerName: "Valor",
      headerAlign: "center",
      minWidth: 95,
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
      renderCell: (params: { value: any }) => `${params.value}%`,
    },
    {
      field: "status",
      headerName: "Ações",
      headerAlign: "center",
      minWidth: 95,
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
      renderCell: (params: any) => (
        <div className={`w-full`}>
          {params.value === "9e8a5574-498a-4909-8444-4e95be06a82b" && (
            <ButtonRescueVoucher
              id="btn-voucher-patient-resgatar"
              params={params.row.id}
              disableHover
              label="Resgatar"
              customClass="bg-careGreen border-careGreen w-full py-2 "
            />
          )}
          {params.value === "c281779c-3dd9-4720-b80a-70275a8403a6" && (
            <ButtonRescueVoucher
              id="btn-voucher-patient-expirado"
              params={params.row.id}
              disableHover
              label="Expirado"
              customClass="bg-careMenuGrey border-careMenuGrey w-full py-2 "
            />
          )}
          {params.value === "9f98e94f-499b-4dcb-ac3c-383179dbc3e2" && (
            <ButtonRescueVoucher
              id="btn-voucher-patient-resgatado"
              params={params.row.id}
              disableHover
              label="Resgatado"
              customClass="bg-careYellow border-careYellow w-full py-2 "
            />
          )}
          {params.value === "815f3563-d634-4be8-a8f9-c5f112bc26ed" && (
            <ButtonRescueVoucher
              id="btn-voucher-patient-utilizado"
              params={params.row.id}
              disableHover
              label="Utilizado"
              customClass="bg-careRedButton border-careRedButton w-full py-2 "
            />
          )}
        </div>
      ),
    },
  ],

  rows: [
    {
      number: "0001",
      status: "20f3c61b-128c-4f11-9e5b-0fc47677f489",
      deadlineInDays: "30 dias",
      discountValue: "R$ 100,00",
      discountType: "COMBO LEVE 4 PAGUE 3",
    },
  ],
};
