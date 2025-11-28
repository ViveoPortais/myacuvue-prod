import React, { useEffect, useState } from "react";
import CustomTable from "../table/CustomTable";
import { getListVoucherPatients } from "@/services/voucher";
import { TableUserPacient } from "@/helpers/TableUserPacient";
import useDataStorage from "@/hooks/useDataStorage";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import ContentCardNew from "../card/ContentCardNew";
import ContentCard from "../card/ContentCard";
import ContentCardVoucher from "../card/ContentCardVoucher";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
import ButtonRescueVoucher from "../button/ButtonRescueVoucher";
import { IoCheckmarkCircle } from "react-icons/io5";
import NewSelected from "../select/NewSelected";



const VoucherPatient: React.FC = () => {

  const useData = useDataStorage();
  const [sortOption, setSortOption] = useState("Próximo de expirar");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isLoading, setIsLoading] = useState(false);
  const [clientVouchers, setClientVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const filteredAndSortedVouchers = clientVouchers
    // filtro por status
    .filter((voucher: any) => {
      if (statusFilter === "Todos") return true;
      return voucher.status === statusFilter;
    })
    // ordena de acordo com a opção selecionada
    .sort((a: any, b: any) => {
      if (sortOption === "Próximo de expirar") {
        const aDiff = dayjs(a.dueDate).diff(dayjs(), "day");
        const bDiff = dayjs(b.dueDate).diff(dayjs(), "day");
        return aDiff - bDiff;
      }
      if (sortOption === "Mais recente") {
        return dayjs(b.createdAt).diff(dayjs(a.createdAt));
      }
      if (sortOption === "Maior desconto") {
        return b.discountValue - a.discountValue;
      }
      return 0;
    });

  // paginando com base no array filtrado e ordenado
  const paginatedVouchers = filteredAndSortedVouchers.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  

  useEffect(() => {
    setIsLoading(true);
   
      getListVoucherPatients(useData.cpf )
        .then((data) => {
          setClientVouchers(data.vouchers)
        })
        .catch((error) => {
          error;
        })
        .finally(() => {
          setIsLoading(false);
        });
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ useData.refresh, useData.cpf]);




  return (
    <>
     
       <ContentCard
            id="click_inicio_resgatar"          
            svgIcon="/svg/v-card.svg"
            title="Meus Vouchers"
            subtitle="Aqui você pode visualizar todos os vouchers atribuídos ao seu CPF. Fique por dentro das campanhas em andamento, acompanhe os vouchers que estão próximos a expirar e veja também quais cupons já foram utilizados. Tudo isso em um só lugar!"
            buttonText="Resgatar"
            hideButton
            margemTop
            widthFull
            height
            textColor="text-white"
            bgColor="bg-[url('/svg/bannerdestaque2.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
            buttonColor="bg-careLightBlue"
            buttonBorderColor="border-careLightBlue"
          />
         
      <div className="flex flex-col md:flex md:flex-row w-full mt-5 gap-5">
        <div className="flex flex-col md:flex md:flex-row md:items-center gap-2">
              <span className="text-sm text-careBlue mt-1">Ordenar por:</span>
              <NewSelected
                options={[
                  { value: "Próximo de expirar", id: "Próximo de expirar" },
                  { value: "Mais recente", id: "Mais recente" },
                  { value: "Maior desconto", id: "Maior desconto" },
                ]}
                placeholder="Próximo de expirar"
                customClass="rounded-full w-full md:w-38 h-14 bg-blue-200 text-careLightBlue text-sm"
                 onChange={(
                  event: any /* or: SelectChangeEvent<string> */,
                  _child: React.ReactNode
                 ) => {
                    setSortOption(event.target.value);
                    setCurrentPage(1); // Resetar para a primeira página ao mudar a ordenação
                 }}
                value={sortOption}
              />
        </div>
        <div className="flex flex-col md:flex md:flex-row md:items-center gap-2">
              <span className="text-sm text-careBlue mt-1">Exibir status:</span>
              <NewSelected
                options={[
                  { value: "Todos", id: "Todos" },
                  { value: "Disponíveis", id: "9e8a5574-498a-4909-8444-4e95be06a82b" },
                  { value: "Resgatados", id: "9f98e94f-499b-4dcb-ac3c-383179dbc3e2" },
                  { value: "Utilizados", id: "815f3563-d634-4be8-a8f9-c5f112bc26ed" },
                  { value: "Expirados", id: "c281779c-3dd9-4720-b80a-70275a8403a6" },
                ]}
                placeholder="Todos"
                customClass="rounded-full w-full md:w-38 h-14 bg-blue-200 text-careLightBlue text-sm"
                onChange={
                  (event: any /* or: SelectChangeEvent<string> */, _child: React.ReactNode) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1); // Resetar para a primeira página ao mudar o filtro
                } }
                value={statusFilter}            
              />
        </div>
      </div>
      

      <div className="flex flex-col md:flex-row gap-10 mt-10 justify-between">

        {paginatedVouchers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {paginatedVouchers.map((voucher: any) => {
              const diasRestantes = dayjs(voucher.dueDate).isValid()
                ? Math.max(dayjs(voucher.dueDate).diff(dayjs(), "day"), 0)
                : 0;

              return (
                <div key={voucher.id} className="w-[400px] relative">
                  {voucher.status === "9f98e94f-499b-4dcb-ac3c-383179dbc3e2" ? (
                    <>
                      <Image
                        src="/svg/voucher-patient-fundo-azul.svg"
                        alt="Voucher"
                        width={400}
                        height={400}
                        className="rounded-lg"
                      />
                      <div className="absolute top-5 left-[4.3rem] text-green-500">
                        <IoCheckmarkCircle size={33} />
                      </div>
                      <div className="absolute top-14 left-14 text-careLightBlue text-base">
                        Voucher
                      </div>
                      <div className="absolute top-[4.7rem] left-[2.8rem] text-careLightBlue text-xs">
                        resgatado com
                      </div>
                      <div className="absolute top-[5.4rem] left-[4rem] text-careLightBlue text-xs">
                        sucesso
                      </div>
                      <div className="absolute top-[6.8rem] left-[3.7rem] text-careLightBlue text-3xl">
                        {Math.round(voucher.discountValue)}%
                      </div>
                      <div className="absolute top-[9.6rem] left-[1.3rem] text-careLightBlue text-xs">
                        Aproveite seu desconto!
                      </div>
                      <div className="flex flex-col absolute top-8 left-52">
                          <div className=" text-careLightBlue text-xl font-bold">
                            {voucher.discountType}
                          </div>
                          <div className=" text-careBlue text-base">
                            ID: {voucher.number}
                          </div>
                      </div>
                     
                    </>
                  ) : (
                    <>
                      <Image
                        src="/svg/voucher-patient.svg"
                        alt="Voucher"
                        width={400}
                        height={400}
                        className="rounded-lg"
                      />
                      <div className="absolute top-20 left-10 text-careLightBlue text-5xl">
                        {Math.round(voucher.discountValue)}%
                      </div>
                        {voucher.dueDate && dayjs(voucher.dueDate).isValid() && (
                          <>
                            <div className="absolute top-32 left-14 text-careBlue text-base">
                              Prazo de
                            </div>
                            <div
                              className={`absolute top-36 left-16 font-bold text-base ${
                                diasRestantes <= 5
                                  ? "text-red-500"
                                  : diasRestantes <= 15
                                  ? "text-yellow-500"
                                  : "text-careBlue"
                              }`}
                            >
                              {diasRestantes} dias
                            </div>
                            <div className="absolute top-40 left-14 text-careBlue text-base">
                              restantes
                            </div>
                          </>
                        )}
                      <div className="absolute top-14 left-52 text-careLightBlue text-xl font-bold w-80">
                        {voucher.discountType}
                      </div>
                      <div className="absolute top-[85px] left-52 text-careBlue text-base">
                        ID: {voucher.number}
                      </div>
                    </>
                  )}

                <div className="absolute top-28 left-52 text-careBlue text-based w-40">
                  <ButtonRescueVoucher
                    id={`btn-voucher-patient-resgatar-${voucher.id}`}
                    label={
                      voucher.status === "9f98e94f-499b-4dcb-ac3c-383179dbc3e2"
                        ? "Resgatado"
                        : voucher.status === "c281779c-3dd9-4720-b80a-70275a8403a6"
                        ? "Expirado"
                        : voucher.status === "815f3563-d634-4be8-a8f9-c5f112bc26ed"
                        ? "Utilizado"
                        : "Resgatar"
                    }
                    params={voucher.id}
                    disabled={
                      voucher.status === "9f98e94f-499b-4dcb-ac3c-383179dbc3e2" ||
                      voucher.status === "c281779c-3dd9-4720-b80a-70275a8403a6" ||
                      voucher.status === "815f3563-d634-4be8-a8f9-c5f112bc26ed"
                    }
                    customClass={`w-full py-3 ${
                      voucher.status === "9f98e94f-499b-4dcb-ac3c-383179dbc3e2"
                        ? "bg-carePurple border-carePurple cursor-not-allowed"
                        : voucher.status === "c281779c-3dd9-4720-b80a-70275a8403a6"
                        ? "bg-careRedButton border-careRedButton cursor-not-allowed"
                        : voucher.status === "815f3563-d634-4be8-a8f9-c5f112bc26ed"
                        ? "bg-careGreen border-careGreen cursor-not-allowed"
                              : "bg-careBlue border-careBlue"
                          } text-white rounded-full`}
                        />
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-[400px]" />
              )}

              <div className="mt-5 md:mt-0 hidden md:block relative w-[450px] h-[200px] flex-shrink-0">
                <Image
                  src="/svg/card-promo.svg"
                  alt="Voucher"
                  width={400}
                  height={200}
                  className="object-contain rounded-lg"
                />
                <div className="absolute top-96 left-[45%] transform -translate-x-1/2 -translate-y-1/2 w-40">
                  <ButtonRescueVoucher
                    id="btn-voucher-patient-resgatar"
                    label="Ver Mais"
                    customClass="w-full py-3 bg-careBlue text-white rounded-full"
                  />
                </div>
              </div>
      </div>

     {filteredAndSortedVouchers.length > 0 && (
        <div className="flex justify-center md:mr-[25rem] mt-5 mb-5">
          <Pagination
            count={Math.ceil(filteredAndSortedVouchers.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            size="large"
          />
        </div>
      )}

      <div className="block md:hidden relative w-[400px] mb-5">
        <Image
          src="/svg/card-promo.svg"
          alt="Voucher"
          width={400}
          height={200}
          className="object-contain rounded-lg"
        />
        <div className="absolute top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40">
          <ButtonRescueVoucher
            id="btn-voucher-patient-resgatar-mobile"
            label="Resgatar"
            customClass="w-full py-3 bg-careBlue text-white rounded-full"
          />
        </div>
      </div>
    </>
  );
};

export default VoucherPatient;
