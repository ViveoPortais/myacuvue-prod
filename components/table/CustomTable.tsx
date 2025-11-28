import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Rows } from "@/helpers/VoucherListTable";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { format } from "date-fns";
import useDataStoragePartiner from "@/hooks/useDataStoragePartiner";
import useEditPartiner from "@/hooks/useEditPartiner";
import useOpenModalCancel from "@/hooks/useOpenModalCancel";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface ICustomTableProps {
  rowId: string;
  columns: GridColDef[];
  rows: any[];
  handleEditVoucherRow?: (voucher: Rows) => void;
  isLoading?: boolean;
  renderMobileCard?: (row: any) => React.ReactNode;
}

const CustomTable = ({
  columns,
  rows,
  rowId,
  isLoading,
  handleEditVoucherRow,
  renderMobileCard,
}: ICustomTableProps) => {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const validatedRows = Array.isArray(rows) ? rows : [];
  const validatedCurrentPage = currentPage || 1;

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return validatedRows.slice(
      startIndex,
      Math.min(endIndex, validatedRows.length)
    );
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleRowClick = (params: any) => {
    const selectedRowData = params.row;
    setSelectedRow(selectedRowData);

    if (handleEditVoucherRow) {
      handleEditVoucherRow(selectedRowData);
    }
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4">
          {getCurrentPageData().map((row, index) =>
            renderMobileCard ? (
              <div key={row[rowId] || index}>{renderMobileCard(row)}</div>
            ) : (
              <div
                key={row[rowId] || index}
                className="bg-white border border-careCyan rounded-xl p-4 shadow-md text-sm w-full overflow-hidden"
              >
                <div className="flex justify-between">
                  <div className="w-1/2 pr-2">
                    <p className="text-[#051F4A] text-sm font-semibold">Data de cadastro</p>
                    <p className="text-sm mb-2">
                      {row.createdOn && !isNaN(new Date(row.createdOn).getTime())
                        ? format(new Date(row.createdOn), "dd/MM/yyyy")
                        : "--"}
                    </p>
                  </div>
                  <div className="w-1/2 pl-2">
                    <p className="text-[#051F4A] text-sm font-semibold">ID</p>
                    <p className="text-sm mb-2">{row.friendlyCode}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="w-1/2 pr-2">
                    <p className="text-[#051F4A] text-sm font-semibold">Nome do parceiro</p>
                    <p className="text-sm mb-2">{row.mainContact}</p>
                  </div>
                  <div className="w-1/2 pl-2">
                    <p className="text-[#051F4A] text-sm font-semibold">E-mail</p>
                    <p className="text-sm mb-2 truncate max-w-[140px]">{row.emailAddress}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="w-1/2 pr-2">
                    <p className="text-[#051F4A] text-sm font-semibold">CNPJ</p>
                    <p className="text-sm mb-2">{row.cnpj}</p>
                  </div>
                  <div className="w-1/2 pl-2">
                    <p className="text-[#051F4A] text-sm font-semibold">Ações</p>
                    <div className="flex gap-3 mt-1">
                      <button
                        onClick={() => {
                          useDataStoragePartiner.getState().setPartiner(row);
                          useEditPartiner.getState().onOpen();
                        }}
                        className="text-[#0A7CC1] font-semibold underline flex items-center gap-1"
                      >
                        <FiEdit2 size={18} color="rgb(132, 189, 223)" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          useDataStoragePartiner.getState().setPartiner(row);
                          useOpenModalCancel.getState().onOpen();
                        }}
                        className="text-red-600 font-semibold underline flex items-center gap-1"
                      >
                        <FiTrash2 size={18} color="rgb(132, 189, 223)" />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(validatedRows.length / pageSize)}
              page={currentPage}
              onChange={handlePageChange}
              size="small"
            />
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <DataGrid
            rows={rows ? getCurrentPageData() : []}
            columns={columns}
            getRowId={(row) => (rowId ? row[rowId] : row.id)}
            autoHeight
            disableColumnMenu
            disableRowSelectionOnClick
            rowHeight={70}
            disableColumnFilter
            onRowClick={handleRowClick}
            loading={isLoading}
            localeText={{
              noRowsLabel: "Não há dados para exibir",
            }}
             sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "100%",
          border: "none",
          "& .MuiDataGrid-root": {
            width: "100%",
            boxSizing: "border-box",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": {
            backgroundColor: "#ffffff",
            fontSize: "15px",
            color: "#051F4A",
            border: "2px solid rgb(132, 189, 223)",
            borderRadius: "12px",
            marginBottom: "12px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexWrap: "nowrap",
            width: "98%",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            outline: "none",
            border: "2px solid rgb(132, 189, 223)",
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            paddingRight: "0px",
            height: "450px",
          },
          "& .MuiDataGrid-main": {
            boxSizing: "border-box",
          },
          "& .MuiDataGrid-columnHeaders": {
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "none !important",
          },
          "& .MuiDataGrid-withBorderColor": {
            borderColor: "transparent !important",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#ffffff",
            color: "rgb(5, 31, 74)",
            fontWeight: "bold",
            fontSize: "16px",
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          },
          "& .MuiDataGrid-cell[style*='width: 0.'], & .MuiDataGrid-cell[style*='width: 1px']": {
            display: "none !important",
          },
          "& .MuiDataGrid-columnHeader[style*='width: 0.'], & .MuiDataGrid-columnHeader[style*='width: 1px']": {
            display: "none !important",
          },
          "& .MuiDataGrid-window": {
            marginRight: "-2px",
          },
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#3f51b5",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
            components={{
              Footer: () => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "1rem",
                    backgroundColor: "#ffffff",
                    marginTop: 14,
                  }}
                >
                  <Pagination
                    count={Math.ceil(validatedRows.length / pageSize)}
                    page={currentPage}
                    onChange={handlePageChange}
                    size="large"
                  />
                </div>
              ),
            }}
          />
        </div>

      )}
    </>
  );
};

export default CustomTable;
