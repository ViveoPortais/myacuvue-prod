import React, { useCallback, useEffect } from "react";
import Input from "@/components/input/Input";
import { BsSearch } from "react-icons/bs";
import { getListRescueVoucherPatients } from "@/services/voucher";
import { useState } from "react";
import InputMask from "react-input-mask";
import SearchModalEcp from "../modals/SearchModalEcp";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Button from "../button/Button";
import { toast } from "react-toastify";
import CustomTable from "../table/CustomTable";
import NewSelected from "../select/NewSelected";
import { IoArrowForwardOutline } from "react-icons/io5";
import { TableMockupValidateVoucher } from "@/helpers/TableMockupValidateVoucher";
import { CiSearch } from "react-icons/ci";
import InputVoucher from "../input/InputVoucher";
import useValidateEcpVoucher from "@/hooks/useValidateEcpVoucher";
import AccordionUsage from "../accordion/Accordion";
import useDataStorage from "@/hooks/useDataStorage";
import dayjs from "dayjs";
import CustomTableOld from "../table/CustomTableOld";
import { Router } from "next/router";

const VoucherPartinerEcp = () => {
  const useValideEcp = useValidateEcpVoucher();
  const [searchCpf, setSearchCpf] = useState("");
  const [shwowDetails, setShowDetails] = useState(false);
  const [showTableVoucherPatient, setShowTableVoucherPatient] = useState(false);
  const [namePatient, setNamePatient] = useState("");
  const [cpfPatient, setCpfPatient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVoucherPatient, setShowVoucherPatient] = useState<any[]>([]);
  const dataStorage = useDataStorage();
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [sortOption, setSortOption] = useState("Mais recente");

  const filteredVouchers =
    filterStatus === "Todos"
      ? showVoucherPatient
      : showVoucherPatient.filter((v) => v.status === filterStatus);

  const filteredAndSortedVouchers = filteredVouchers.sort((a, b) => {
    switch (sortOption) {
      case "Mais recente":
        return dayjs(b.createdDate).diff(dayjs(a.createdDate));
      case "Mais antigo":
        return dayjs(a.createdDate).diff(dayjs(b.createdDate));
      default:
        return 0;
    }
  });

  const handleSearchClient = async () => {
    try {
      if (searchCpf.trim() === "" || searchCpf.length < 11) {
        toast.error("Digite um CPF válido");
        return;
      }
      const clientData = await getListRescueVoucherPatients({ cpf: searchCpf });

      if (!clientData || !clientData.cpf) {
        toast.error("CPF não encontrado");
        return;
      }

      setShowDetails(true);
      setShowTableVoucherPatient(true);
      setSearchCpf(clientData.cpf);
      setNamePatient(clientData.name);
      setCpfPatient(clientData.cpf);
      setShowVoucherPatient(clientData.vouchers);
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Erro ao buscar cliente");
    }
  };

  const handleCpfChange = (e: any) => {
    setSearchCpf(e.target.value);
  };

  const maskedCpf = () => {
    return (
      <InputMask
        id="input-resgatar-voucher-por-cpf-partiner-ecp"
        mask="999.999.999-99"
        value={searchCpf}
        onChange={handleCpfChange}
      >
        {(inputProps: any) => (
          <InputVoucher
            {...inputProps}
            placeholder="Digite o CPF do cliente"
            startIcon
            iconClass="text-careLightBlue"
            iconStart={CiSearch}
          />
        )}
      </InputMask>
    );
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      useValideEcp.onClose();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        useValideEcp.onClose();
      }
    };

    const handleRouteChange = () => {
      useValideEcp.onClose();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    Router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      Router.events.off("routeChangeStart", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useValideEcp, Router.events]);

  return (
    <>
      {useValideEcp.isOpen ? (
        <>
          <AccordionUsage />
        </>
      ) : (
        <>
          <div className="text-careBlue">
            Para validar o voucher, digite o CPF do paciente. É necessário que
            seu paciente ative o vucher para ficar visível aqui.
          </div>
          <div className="border border-careLightBlue rounded-lg p-5 md:grid md:grid-cols-1 gap-8 my-2 fill-careDarkBlue fade-in">
            <div>
              <div className=" mb-8 md:mb-0 grid-cols-1 md:grid md:grid-cols-4 items-center gap-5 px-5 md:px-0">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-careBlue">Digite o CPF:</span>
                    <div>{maskedCpf()}</div>
                  </div>
                  <div
                    onClick={handleSearchClient}
                    id="search-client"
                    className="w-24 md:w-14 p-4 rounded-lg md:rounded-full bg-careLightBlue flex justify-center items-center cursor-pointer hover:opacity-70 mt-8"
                  >
                    <IoArrowForwardOutline className="text-white" size={25} />
                  </div>
                </div>
                {shwowDetails && (
                  <div className="bg-[#F5FAFE] border border-careLightBlue rounded-lg w-full h-14 flex items-center gap-5 px-5 py-10 mt-5 md:mt-0">
                    <div className="flex flex-col ">
                      <span className="text-careBlue">CPF</span>
                      <span className="text-careLightBlue">{cpfPatient}</span>
                    </div>
                    <div className="flex flex-col ">
                      <span className="text-careBlue">Nome</span>
                      <span className="text-careLightBlue">{namePatient}</span>
                    </div>
                  </div>
                )}
              </div>
              {shwowDetails && (
                <>
                  <div className="flex flex-col mt-5 md:flex md:flex-row md:items-center gap-2">
                    <div className="flex flex-col md:flex md:flex-row md:items-center gap-2">
                      <span className="text-sm text-careBlue mt-1">
                        Ordernar por:
                      </span>
                      <NewSelected
                        options={[
                          { value: "Mais recente", id: "Mais recente" },
                          { value: "Mais antigo", id: "Mais antigo" },
                        ]}
                        placeholder="Próximo de expirar"
                        customClass="rounded-full w-full md:w-38 h-14 bg-blue-200 text-careLightBlue text-sm"
                        onChange={(event: any, _child: React.ReactNode) => {
                          setSortOption(event.target.value);
                        }}
                        value={sortOption}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            {showTableVoucherPatient && (
              <div className="w-[22rem] md:w-full">
                <CustomTableOld
                  isLoading={isLoading}
                  rowId="id"
                  rows={filteredAndSortedVouchers}
                  columns={TableMockupValidateVoucher.columns}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default VoucherPartinerEcp;
