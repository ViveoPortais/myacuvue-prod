import Button from "@/components/button/Button";
import ButtonEditVoucher from "@/components/button/ButtonEditVoucher";
import { format } from "date-fns";

export const SeeMoreVoucherTable: TableData = {
  columns: [
    {
      field: "number",
      headerName: "ID",
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
          {params.value === "9f98e94f-499b-4dcb-ac3c-383179dbc3e2" && (
            <Button
              disableHover
              label="Resgatado"
              customClass="bg-careGreen border-careGreen w-full py-2 text-sm"
            />
          )}
        </div>
      ),
    },
  ],

  rows: [
    {
      id: "1",
      createdDate: "2021-09-01T00:00:00",
      number: "1",
      discountType: "Corte de Cabelo",
      deadlineInDays: "30",
      status: "20f3c61b-128c-4f11-9e5b-0fc47677f489",
    },
  ],
};
