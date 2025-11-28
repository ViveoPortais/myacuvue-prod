import ButtonEditPartiner from "@/components/button/ButtonEditPartiner";
import { format } from "date-fns";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import useDataStoragePartiner from "@/hooks/useDataStoragePartiner";
import useEditPartiner from "@/hooks/useEditPartiner";
import useOpenModalCancel from "@/hooks/useOpenModalCancel";

export interface Rows {
  createdOn: string;
  friendlyCode: string;
  mainContact: string;
  emailAddress: string;
  cnpj: string;
  actions: string;
}

export const TableMockupPartiner: TableData = {
  columns: [
    {
      field: "createdOn",
      headerName: "Data cadastro",
      minWidth: 95,
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle-borderLeft",
      sortable: false,
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
      field: "friendlyCode",
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
      minWidth: 95,
    },
    {
      field: "mainContact",
      headerName: "Nome do parceiro",
      minWidth: 95,
      headerAlign: "center",
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
    },
    {
      field: "emailAddress",
      headerName: "E-mail",
      headerAlign: "center",
      minWidth: 95,
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
    },
    {
      field: "cnpj",
      headerName: "CNPJ",
      headerAlign: "center",
      minWidth: 95,
      align: "center",
      headerClassName: "columnTitle",
      sortable: false,
      flex: 1,
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
        <div className="w-full flex justify-center gap-2 ml-2">
          <button
            onClick={() => {
              useDataStoragePartiner.getState().setPartiner(params.row);
              useEditPartiner.getState().onOpen();
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Editar"
          >
            <FiEdit2 size={18} className="text-gray-500" />
          </button>
          <button
            onClick={() => {
              useDataStoragePartiner.getState().setPartiner(params.row);
              useOpenModalCancel.getState().onOpen();
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Deletar"
          >
            <FiTrash2 size={18} className="text-gray-500" />
          </button>
        </div>
      ),
    },
  ],

  rows: [
    {
      createdOn: "29/11/2021",
      friendlyCode: "0001",
      mainContact: "João da Silva",
      emailAddress: "João da Silva",
      cnpj: "João da Silva",
      actions: "João da Silva",
    },
  ],
};
