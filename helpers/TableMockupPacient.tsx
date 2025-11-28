import Button from "@/components/button/Button";
import dayjs from "dayjs";

export interface Rows {
  discountType: string;
  deadlineInDays: number;
  discountValue: number;
  status: string;
  createdDate: string;
  
}

export const TableMockupPacient: TableData = {
  columns: [
    {
      field: "createdDate",
      headerName: "Data de Criação",
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params: { value: any }) =>
        dayjs(params.value).format("DD/MM/YYYY"),
    },
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
      renderCell: (params: { value: any }) => (
        <div className="bg-[#EAF6FD] border border-[#EAF6FD] rounded-full w-20 py-2 text-center text-careLightBlue font-bold text-base">
          {params.value}%
        </div>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params: any) => (
        <div className={`w-full`}>
          {params.value === "9e8a5574-498a-4909-8444-4e95be06a82b" && (
              <div className="bg-careDarkPurple border border-careDarkPurple rounded-full w-full md:w-36 py-2 text-center text-white ">
              <span>A resgatar</span>
            </div>
          )}
          {params.value === "c281779c-3dd9-4720-b80a-70275a8403a6" && (
              <div className="bg-careOrange border border-careOrange rounded-full w-full md:w-36 py-2 text-center text-white ">
              <span>Expirado</span>
            </div>
          )}
          {params.value === "9f98e94f-499b-4dcb-ac3c-383179dbc3e2" && (
             <div className="bg-carePurple border border-carePurple rounded-full w-full md:w-36 py-2 text-center text-white ">
              <span>Resgatado</span>
            </div>
          )}
          {params.value === "815f3563-d634-4be8-a8f9-c5f112bc26ed" && (
            <div className="bg-careGreen border border-careGreen rounded-full w-full md:w-36 py-2 text-center text-white ">
              <span>Utilizado</span>
            </div>
          )}
        </div>
      ),
    },
   {
  field: "dueDate",
  headerName: "Data de resgate",
  minWidth: 150,
  sortable: false,
  flex: 1,
  renderCell: (params: { value: any }) =>
    params.value ? dayjs(params.value).format("DD/MM/YYYY") : "-",
},
],

  rows: [
    {
      status: "20f3c61b-128c-4f11-9e5b-0fc47677f489",
      deadlineInDays: "30 dias",
      discountValue: "R$ 100,00",
      discountType: "COMBO LEVE 4 PAGUE 3",
    },
  ],
};
