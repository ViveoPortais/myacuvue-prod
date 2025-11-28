import React from "react";

interface SalesMobileCardProps {
  row: {
    id: string;
    date: string;
    promotion: string;
    promoColor: string;
    client: string;
    cpf: string;
  };
}

const SalesMobileCard = ({ row }: SalesMobileCardProps) => {
  return (
    <div className="bg-white border border-careCyan rounded-xl p-4 shadow-md text-sm w-full overflow-hidden">
      <div className="flex justify-between">
        <div className="w-1/2 pr-2">
          <p className="text-[#051F4A] text-sm font-semibold">Data</p>
          <p className="text-sm mb-2">{row.date}</p>
        </div>
        <div className="w-1/2 pl-2">
          <p className="text-[#051F4A] text-sm font-semibold">ID</p>
          <p className="text-sm mb-2">{row.id}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-1/2 pr-2">
          <p className="text-[#051F4A] text-sm font-semibold">Promoção</p>
          <span className={`px-2 py-1 rounded-full text-xs ${row.promoColor}`}>
            {row.promotion}
          </span>
        </div>
        <div className="w-1/2 pl-2">
          <p className="text-[#051F4A] text-sm font-semibold">Cliente</p>
          <p className="text-sm mb-2">{row.client}</p>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-[#051F4A] text-sm font-semibold">CPF</p>
        <p className="text-sm mb-2">{row.cpf}</p>
      </div>
    </div>
  );
};

export default SalesMobileCard;
