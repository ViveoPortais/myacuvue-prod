export const SalesListTable = {
  columns: [
    {
      field: "date",
      headerName: "Data",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "promotion",
      headerName: "Promoção",
      flex: 1,
      minWidth: 200,
      renderCell: (params: any) => (
        <span
          className={`px-5 py-2 rounded-full text-sm ${
            params.row.promoColor || "bg-[#EEDAF5] text-[#7A3D8A]"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "client",
      headerName: "Cliente",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "cpf",
      headerName: "CPF",
      flex: 1,
      minWidth: 150,
    },
  ],
};
