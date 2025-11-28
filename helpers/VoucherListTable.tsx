import useDataStorage from "@/hooks/useDataStorage";
import useEditVoucher from "@/hooks/useEditVoucher";
import { format } from "date-fns";
import { PiPencilLineLight } from "react-icons/pi";

export interface Rows {
  registerDate: string;
  idCampaign: string;
  service: string;
  time: string;
  status: string;
  actions: string;
  createdDate: string;
  issuancedate: string;
}

export const VoucherListTable: TableData = {
  columns: [
    {
      field: "createdDate",
      headerName: "Data de criação",
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const formattedDate = format(new Date(params.value), "dd/MM/yyyy");
        return <div>{formattedDate}</div>;
      },
    },
    {
      field: "issuanceDate",
      headerName: "Início Vigência",
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const formattedDateTwo = format(new Date(params.value), "dd/MM/yyyy");
        return <div>{formattedDateTwo}</div>;
      },
    },
    {
      field: "number",
      headerName: "ID",
      sortable: false,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "name",
      headerName: "Promoção",
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const discountType = params.value;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const dataStorage = useDataStorage();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const editVoucher = useEditVoucher();

        const openModal = () => {
          editVoucher.onOpen();
          dataStorage.setIdEditVoucher(params.row.id);
          dataStorage.setDataCreatedVoucher(params.row.createdDate);
          dataStorage.setVoucherRenovavel(params.row.renewable);
        };

        return (
          <div className="flex items-center justify-between w-full gap-2">
            <div
              title={discountType}
              className="truncate max-w-[calc(100%-30px)]"
            >
              {discountType}
            </div>
            <span
              onClick={openModal}
              className="text-careLightBlue hover:opacity-50 cursor-pointer shrink-0"
            >
              <PiPencilLineLight size={20} />
            </span>
          </div>
        );
      },
    },
    {
      field: "renewable",
      headerName: "Renovável",
      minWidth: 150,
      headerAlign: "center",
      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center justify-center w-full">
            {params.value === true ? <div>Sim</div> : <div>Não</div>}
          </div>
        );
      },
    },
    {
      field: "discountValue",
      headerName: "Desconto",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle",
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
        <div className="w-full">
          {params.value === "9e8a5574-498a-4909-8444-4e95be06a82b" && (
            <div className="bg-careGreen border border-careGreen rounded-full w-full md:w-36  py-2 text-center text-white">
              <span>Válido</span>
            </div>
          )}
          {params.value === "c281779c-3dd9-4720-b80a-70275a8403a6" && (
            <div className="bg-careYellow border border-careYellow rounded-full w-full md:w-36  py-2 text-center text-white">
              <span>Expirado</span>
            </div>
          )}
          {params.value === "44156585-ab3e-4b5a-ba24-3326e3e1caa6" && (
            <div className="bg-careDarkPurple border border-careDarkPurple rounded-full w-full md:w-36  py-2 text-center text-white">
              <span>Cancelado</span>
            </div>
          )}
          {params.value === "815f3563-d634-4be8-a8f9-c5f112bc26ed" && (
            <div className="bg-careRedButton border border-careRedButton rounded-full w-full md:w-36  py-2 text-center text-white">
              <span>Utilizado</span>
            </div>
          )}
        </div>
      ),
    },

    {
      field: "daysUntilExpiration",
      headerName: "Prazo",
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params: { value: any }) => {
        const isAtrasado = Number(params.value) == 0;

        return (
          <div>
            <span
              className={`font-bold ${
                isAtrasado ? "text-red-500" : "text-black"
              }`}
            >
              {`${params.value} dias`}
            </span>{" "}
            <span className="font-normal">restantes</span>
          </div>
        );
      },
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
    {
      registerDate: "08/11/2021",
      idCampaign: "#0002",
      service: "COMBO LEVE 4 PAGUE 3",
      time: "30 dias",
      status: "Expirado",
      actions: "Editar",
    },
    {
      registerDate: "05/11/2021",
      idCampaign: "#0003",
      service: "COMBO LEVE 4 PAGUE 3",
      time: "60 dias",
      status: "Cancelado",
      actions: "Editar",
    },
    {
      registerDate: "02/11/2021",
      idCampaign: "#0004",
      service: "VOUCHER ESPECIAL",
      time: "30 dias",
      status: "Válido",
      actions: "Editar",
    },
    {
      registerDate: "02/11/2021",
      idCampaign: "#0005",
      service: "VOUCHER GOLD até 30% OFF",
      time: "60 dias",
      status: "Cancelado",
      actions: "Editar",
    },
    {
      registerDate: "20/07/2023",
      idCampaign: "#0006",
      service: "Exemplo Lorem Ipsum",
      time: "30 dias",
      status: "Expirado",
      actions: "Editar",
    },
    {
      registerDate: "20/07/2023",
      idCampaign: "#0007",
      service: "Exemplo Lorem Ipsum",
      time: "30 dias",
      status: "Expirado",
      actions: "Editar",
    },
    {
      registerDate: "20/07/2023",
      idCampaign: "#0008",
      service: "Exemplo Lorem Ipsum",
      time: "30 dias",
      status: "Cancelado",
      actions: "Editar",
    },
    {
      registerDate: "20/07/2023",
      idCampaign: "#0009",
      service: "Exemplo Lorem Ipsum",
      time: "30 dias",
      status: "Válido",
      actions: "Editar",
    },
    {
      registerDate: "20/07/2023",
      idCampaign: "#00010",
      service: "Exemplo Lorem Ipsum",
      time: "30 dias",
      status: "Válido",
      actions: "Editar",
    },
  ],
};
