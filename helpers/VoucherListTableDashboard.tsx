import Button from "@/components/button/Button";
import ButtonEditVoucher from "@/components/button/ButtonEditVoucher";
import { format } from "date-fns";

export interface Rows {
  registerDate: string;
  id: string;
  service: string;
  time: string;
  status: string;
  actions: string;
}

export const VoucherListTableDashboard: TableData = {
  columns: [
    {
      field: "createdDate",
      headerName: "Data",
      minWidth: 95,
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle-borderLeft",
      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const formattedDate = format(new Date(params.value), "dd/MM/yyyy");
        return (
          <div
            style={{
              paddingLeft: "5px",
            }}
          >
            {formattedDate}
          </div>
        );
      },
    },
    {
      field: "number",
      headerName: "ID Campanha",
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
      minWidth: 95,
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
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      minWidth: 95,
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,

      renderCell: (params: any) => (
        <div className={`w-full`}>
          {params.value === "9e8a5574-498a-4909-8444-4e95be06a82b" && (
            <Button
              disableHover
              label="Válido"
              customClass="bg-careGreen border-careGreen w-full py-2 text-sm"
            />
          )}
          {params.value === "c281779c-3dd9-4720-b80a-70275a8403a6" && (
            <Button
              disableHover
              label="Expirado"
              customClass="bg-careYellow border-careYellow w-full py-2 text-sm"
            />
          )}
          {params.value === "44156585-ab3e-4b5a-ba24-3326e3e1caa6" && (
            <Button
              disableHover
              label="Cancelado"
              customClass="bg-careDarkPurple border-careDarkPurple w-full py-2 text-sm"
            />
          )}
          {params.value === "815f3563-d634-4be8-a8f9-c5f112bc26ed" && (
            <Button
              disableHover
              label="Utilizado"
              customClass="bg-careRedButton border-careRedButton w-full py-2 text-sm"
            />
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle-borderRight",
      sortable: false,
      minWidth: 95,
      flex: 1,

      renderCell: (params: any) => (
        <div className="w-full">
          <ButtonEditVoucher
            disabled
            voucher={params.row}
            disableHover
            label="Ver mais"
            customClass="bg-careDarkBlue border-careDarkBlue w-full py-2 text-sm"
          />
        </div>
      ),
    },
  ],

  rows: [
    {
      registerDate: "29/11/2021",
      idCampaign: "#0001",
      service: "VOUCHER PRIMEIRO CADASTRO",
      time: "30 dias",
      status: "Válido",
      actions: "Editar",
    },
  ],
};
