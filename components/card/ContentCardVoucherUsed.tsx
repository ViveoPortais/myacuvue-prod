import Image from "next/image";
import React from "react";

interface ContentCardVoucherUsedProps {
  count: number;
}

const ContentCardVoucherUsed = ({ count }: ContentCardVoucherUsedProps) => {
  return (
    <div className="flex items-center bg-[#E6F4EB] border border-[#2E8B57] px-6 py-4 rounded-xl">
      <Image
        width={10}
        height={10}  
        src="/vouchercard.png"
        className="w-10 h-10 mr-4"
        alt="voucher icon"
      />
      <div className="text-[#127C70]">
        <p className="text-careBlue font-medium">Utilizados</p>
        <p className="text-2xl font-bold">{count} vouchers</p>
      </div>
    </div>
  );
};

export default ContentCardVoucherUsed;
