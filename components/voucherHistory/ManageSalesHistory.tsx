import React, { useState, useEffect, useCallback } from "react";
import { BsSearch } from "react-icons/bs";
import Input from "@/components/input/Input";
import CustomTable from "@/components/table/CustomTable";
import { SalesListTable } from "@/helpers/SaleslistTable";
import ContentCardVoucherUsed from "@/components/card/ContentCardVoucherUsed";
import NewSelected from "@/components/select/NewSelected";
import CardSalesMobile from "@/components/card/CardSalesMobile";
import { listSalesByUser } from "@/services/voucher";

interface SalesRow {
  id: string;
  date: string;
  promotion: string;
  promoColor: string;
  client: string;
  cpf: string;
}

const ManageSalesHistory = () => {
  const [salesRows, setSalesRows] = useState<SalesRow[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState("7dias");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
  };

  const getSalesData = useCallback(() => {
    setIsLoading(true);
    listSalesByUser("073")
      .then((data:any) => {
        const mapped = data.map((item: any) => ({
          id: item.number,
          date: new Date(item.createdDate).toLocaleDateString("pt-BR"),
          promotion: item.name,
          promoColor: item.name.includes("LEVE 4") ? "bg-[#EEDAF5] text-[#7A3D8A]" : "bg-[#E2F6F1] text-[#127C70]",
          client: item.userName,
          cpf: item.cpf,
        }));
        setSalesRows(mapped);
      })
      .catch((err:any) => {
        console.error("Erro ao buscar histórico de vendas:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    getSalesData();
  }, [getSalesData]);

  const now = new Date();
  let daysAgo = 7;
  if (selectedRange === "30dias") daysAgo = 30;
  if (selectedRange === "60dias") daysAgo = 60;

  const filteredRows = salesRows
    .filter((row) => {
      const [day, month, year] = row.date.split("/").map(Number);
      const rowDate = new Date(`${year}-${month}-${day}`);
      const diffInDays = (now.getTime() - rowDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays > daysAgo) return false;

      const rowString = Object.values(row).join(" ").toLowerCase();
      return rowString.includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formattedRows = filteredRows.map((row) => ({
    ...row,
    createdOn: row.date,
  }));

  return (
    <div className="w-full fade-in mb-5">
      <span className="text-careBlue">
        Acompanhe aqui o histórico de vendas e de resgates de vouchers.
      </span>

      <div className="w-full border-0 md:border md:border-[#A5D3EC] rounded-xl mt-6 p-6 bg-white">
        <div className="flex flex-wrap md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <ContentCardVoucherUsed count={salesRows.length} />

          <div className="flex flex-wrap md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-careBlue mt-1">Ordenar por:</span>
              <NewSelected
                options={[
                  { value: "Últimos 7 dias", id: "7dias" },
                  { value: "Últimos 30 dias", id: "30dias" },
                  { value: "Últimos 60 dias", id: "60dias" },
                ]}
                customClass="rounded-full w-44 h-8 bg-blue-200 text-careLightBlue text-sm"
                onChange={(e: any) => setSelectedRange(e.target.value)}
                value={selectedRange}
              />
            </div>
            <div className="w-full md:w-[260px] ml-4">
              <Input
                id="search-voucher"
                value={search}
                onChange={handleSearchChange}
                placeholder="Pesquisar"
                startIcon
                iconStart={BsSearch}
                iconColor="#0071C5"
                variantStyle="searchRounded"
              />
            </div>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <CustomTable
            rowId="id"
            columns={SalesListTable.columns}
            rows={formattedRows}
            isLoading={isLoading}
            renderMobileCard={(row: any) => <CardSalesMobile row={row} />}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageSalesHistory;
