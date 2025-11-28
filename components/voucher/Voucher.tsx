import React, { useCallback } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import CustomSelect from "../select/Select";
import CustomTable from "../table/CustomTable";

import SearchModal from "../modals/SearchModal";
import RegisterVoucher from "./RegisterVoucher";
import EditVoucher from "./EditVoucher";
import useRegisterVoucher from "@/hooks/useRegisterVoucher";
import useEditVoucher from "@/hooks/useEditVoucher";
import {
  getListVoucher,
  getListVoucherPatients,
  getVoucherTypes,
} from "@/services/voucher";
import { useEffect, useState } from "react";
import {
  VoucherFiltersPeriod,
  VoucherFiltersStatus,
} from "@/helpers/FiltersData";
import { VoucherFiltersStatusPacient } from "@/helpers/FiltersDataPacient";
import useDataStorage from "@/hooks/useDataStorage";
import InputMask from "react-input-mask";
import { VoucherListTable } from "@/helpers/VoucherListTable";
import { GoPlus } from "react-icons/go";
import ButtonAttendanceConfirmation from "../button/ButtonAttendanceConfirmation";
import NewSelected from "../select/NewSelected";
import InputVoucher from "../input/InputVoucher";
import { set } from "date-fns";
import { IoArrowForwardOutline } from "react-icons/io5";
import { TableMockupPacient } from "@/helpers/TableMockupPacient";
import ModalShedulingCancel from "../modals/ModalShedulingCancel";
import { toast } from "react-toastify";
import CustomTableOld from "../table/CustomTableOld";

const Voucher = () => {
  const registerVoucher = useRegisterVoucher();
  const editVoucher = useEditVoucher();
  const [cpfError, setCpfError] = useState("");
  const [listVoucher, setListVoucher] = useState<any[]>([]);
  const [searchCpf, setSearchCpf] = useState("");
  const [showCustomTable, setShowCustomTable] = useState(true);
  const [namePatient, setNamePatient] = useState("");
  const [cpfPatient, setCpfPatient] = useState("");
  const [shwowDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [searchTermClient, setSearchTermClient] = useState("");
  const [statusFilterClient, setStatusFilterClient] = useState("Todos");
  const [vouchersClient, setVouchersClient] = useState("");
  const [voucherRegistered, setVoucherRegistered] = useState(
    "Vouchers cadastrados"
  );
  const [showVoucherPatient, setShowVoucherPatient] = useState<any[]>([]);
  const [showTableVoucherPatient, setShowTableVoucherPatient] = useState(false);
  const useData = useDataStorage();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<{
    voucherTypes: string;
    status: string;
    deadlineInDays: string;
  }>({
    voucherTypes: "",
    status: "",
    deadlineInDays: "",
  });

  const handleSearchClient = async () => {
    const onlyNumbers = searchCpf.replace(/[^\d]+/g, "");

    if (!onlyNumbers || !isValidCPF(searchCpf)) {
      setNamePatient("");
      setCpfPatient("");
      setShowDetails(false);
      setShowVoucherPatient([]);
      setShowTableVoucherPatient(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getListVoucherPatients(searchCpf);
      setNamePatient(response.name);
      setCpfPatient(response.cpf);
      setShowDetails(true);
      setShowVoucherPatient(response.vouchers);
      setShowTableVoucherPatient(true);
    } catch (error) {
      setNamePatient("");
      setCpfPatient("");
      setShowDetails(false);
      setShowVoucherPatient([]);
      setShowTableVoucherPatient(false);
      toast.error("Paciente não encontrado");
    } finally {
      setIsLoading(false);
    }
  };

  const getVoucherData = useCallback(() => {
    const voucherTypeFilter =
      filters.voucherTypes === "All" ? "" : filters.voucherTypes;

    getListVoucher({ ...filters, voucherTypes: voucherTypeFilter }).then(
      (response) => {
        response.sort((a: any, b: any) => {
          const dateA = new Date(a.createdDate);
          const dateB = new Date(b.createdDate);
          return dateB.getTime() - dateA.getTime();
        });
        setListVoucher(response);
      }
    );
  }, [filters]);

  useEffect(() => {
    getVoucherData();
  }, [getVoucherData, useData.refresh, filters]);

  const parseDate = (str: string) => {
    const [day, month, year] = str.split("/");
    return new Date(`${year}-${month}-${day}`);
  };
  const lowerSearch = searchText.toLowerCase();
  const filteredVouchers = listVoucher.filter((voucher) => {
    const voucherDate = new Date(voucher.createdDate);
    const isAfterStart = startDate ? voucherDate >= parseDate(startDate) : true;
    const isBeforeEnd = endDate ? voucherDate <= parseDate(endDate) : true;
    const matchesSearch =
      voucher.number?.toLowerCase().includes(lowerSearch) ||
      voucher.id?.toLowerCase().includes(lowerSearch) ||
      voucher.name?.toLowerCase().includes(lowerSearch) ||
      voucher.note?.toLowerCase().includes(lowerSearch) ||
      voucher.discountType?.toLowerCase().includes(lowerSearch) ||
      String(voucher.discountValue)?.toLowerCase().includes(lowerSearch) ||
      String(voucher.deadlineInDays)?.toLowerCase().includes(lowerSearch) ||
      voucher.statusName?.toLowerCase().includes(lowerSearch) ||
      voucher.userName?.toLowerCase().includes(lowerSearch) ||
      voucher.cpf?.toLowerCase().includes(lowerSearch);

    return isAfterStart && isBeforeEnd && matchesSearch;
  });

  const handleChangeCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchCpf(value);
  };

  const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, "");

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
  };

  const maskedCpf = () => {
    const handleBlurCpf = () => {
      const onlyNumbers = searchCpf.replace(/[^\d]+/g, "");

      if (!onlyNumbers) {
        setCpfError("");
      } else if (!isValidCPF(searchCpf)) {
        setCpfError("Informe um CPF válido.");
      } else {
        setCpfError("");
      }
    };

    return (
      <>
        <InputMask
          id="filtro-cpf-voucher"
          name="cpf"
          mask="999.999.999-99"
          maskPlaceholder={null}
          value={searchCpf}
          onChange={handleChangeCpf}
          onBlur={handleBlurCpf}
        >
          {(inputProps: any) => (
            <Input
              {...inputProps}
              placeholder=""
              startIcon
              imageSrc="/search-icon.png"
              className={cpfError ? "border-red-500" : ""}
            />
          )}
        </InputMask>
        {cpfError && <p className="text-red-500 text-[12px]">{cpfError}</p>}
      </>
    );
  };

  const refreshTableData = () => {
    setRefreshTable(true);
  };

  const handleVoucherRegistered = () => {
    setVoucherRegistered("Vouchers cadastrados");
    setVouchersClient("");
  };

  const handleVouchersClient = () => {
    setVouchersClient("Cliente");
    setVoucherRegistered("");
  };

  const isStartDateValid = (date: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(date);
  };

  const filteredClientVouchers = showVoucherPatient.filter((voucher: any) => {
    const term = searchTermClient.toLowerCase();
    const voucherDate = new Date(voucher.createdDate);

    const isAfterStart = startDate ? voucherDate >= parseDate(startDate) : true;
    const isBeforeEnd = endDate ? voucherDate <= parseDate(endDate) : true;

    const matchesSearch =
      voucher.number?.toLowerCase().includes(term) ||
      voucher.id?.toLowerCase().includes(term) ||
      voucher.name?.toLowerCase().includes(term) ||
      voucher.note?.toLowerCase().includes(term) ||
      voucher.discountType?.toLowerCase().includes(term) ||
      String(voucher.discountValue)?.toLowerCase().includes(term) ||
      String(voucher.deadlineInDays)?.toLowerCase().includes(term) ||
      voucher.statusName?.toLowerCase().includes(term) ||
      voucher.userName?.toLowerCase().includes(term) ||
      voucher.cpf?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilterClient === "Todos" || voucher.status === statusFilterClient;

    return isAfterStart && isBeforeEnd && matchesSearch && matchesStatus;
  });

  return (
    <>
      {registerVoucher.isOpen && (
        <RegisterVoucher refreshTable={refreshTableData} />
      )}

      {!registerVoucher.isOpen && (
        <>
          <span className=" text-careDarkBlue">
            Aqui você pode criar novas campanhas de vouchers e gerenciar
            campanhas existentes.
          </span>

          <div className="fade-in border border-careLightBlue rounded-lg py-5 md:p-5 mb-10">
            <div className="grid grid-cols-1 md:grid md:grid-cols-5 items-center gap-5 mb-10 md:px-0 px-5">
              <div className="flex flex-col md:flex md:flex-row md:items-center gap-5 md:col-span-4">
                <div
                  onClick={handleVoucherRegistered}
                  className={`w-full md:w-80 bg-careLightBlue border border-careLightBlue ${
                    voucherRegistered === "Vouchers cadastrados"
                      ? "bg-careLightBlue text-white"
                      : "bg-transparent border border-careLightBlue text-careLightBlue"
                  } rounded-full  py-3 text-center   text-base cursor-pointer`}
                >
                  <span>Vouchers cadastrados</span>
                </div>
                <div
                  onClick={handleVouchersClient}
                  className={`w-full md:w-80 bg-careLightBlue border border-careLightBlue ${
                    vouchersClient === "Cliente"
                      ? "bg-careLightBlue text-white"
                      : "bg-transparent border border-careLightBlue text-careLightBlue"
                  } rounded-full  py-3 text-center   text-base cursor-pointer`}
                >
                  <span>Vouchers por clientes</span>
                </div>
              </div>
              <Button
                leftIcon={GoPlus}
                id="register-voucher"
                onClick={registerVoucher.onOpen}
                customClass="w-full bg-careLightBlue border-careLightBlue py-2"
                label="Cadastrar voucher"
              />
            </div>

            {voucherRegistered === "Vouchers cadastrados" && (
              <>
                <div className="flex flex-col md:flex md:flex-row md:items-center gap-5 mb-10 px-5 md:px-0 fade-in">
                  <div className="flex flex-col md:flex md:flex-row md:items-center gap-2">
                    <span className="text-sm text-careBlue mt-1">Status:</span>
                    <NewSelected
                      options={[
                        { value: "Todos", id: "" },
                        {
                          value: "Válido",
                          id: "9e8a5574-498a-4909-8444-4e95be06a82b",
                        },
                        {
                          value: "Cancelado",
                          id: "44156585-ab3e-4b5a-ba24-3326e3e1caa6",
                        },
                        {
                          value: "Expirado",
                          id: "c281779c-3dd9-4720-b80a-70275a8403a6",
                        },
                      ]}
                      placeholder="Mais recentes"
                      customClass="rounded-lg w-full md:w-32 h-14 bg-blue-200 text-careLightBlue text-sm"
                      onChange={(event: any) => {
                        setFilters({
                          ...filters,
                          status: event.target.value,
                        });
                      }}
                      value={filters.status || ""}
                    />
                  </div>
                  <div className="flex flex-col md:flex md:flex-row md:items-center gap-2 w-full">
                    <div className="flex flex-col md:flex md:flex-row md:items-center gap-2 w-full">
                      <span className="text-sm text-careBlue mt-1 w-24">
                        Período de:
                      </span>
                      <InputMask
                        mask="99/99/9999"
                        maskPlaceholder=""
                        alwaysShowMask={false}
                        value={startDate}
                        onChange={(e: any) => setStartDate(e.target.value)}
                        max={10}
                      >
                        {(inputProps: any) => (
                          <InputVoucher
                            {...inputProps}
                            placeholder="00/00/0000"
                            startIcon
                            className="w-full h-14"
                          />
                        )}
                      </InputMask>
                    </div>
                    <div className="flex flex-col md:flex md:flex-row md:items-center gap-2 w-full">
                      <span className="text-sm text-careBlue mt-1">Até:</span>
                      <InputMask
                        id="fill_form_step3_nascimento"
                        name="birthdate"
                        mask="99/99/9999"
                        maskPlaceholder=""
                        alwaysShowMask={false}
                        value={endDate}
                        onChange={(e: any) => setEndDate(e.target.value)}
                        disabled={isStartDateValid(startDate) ? false : true}
                        max={10}
                      >
                        {(inputProps: any) => (
                          <InputVoucher
                            {...inputProps}
                            placeholder="00/00/0000"
                            startIcon
                            className="w-full  h-14 "
                          />
                        )}
                      </InputMask>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2 w-full">
                    <div className="w-full">
                      <Input
                        maxLength={20}
                        id="search"
                        name="search"
                        placeholder="Pesquisar"
                        startIcon
                        imageSrc="/search-icon.png"
                        customClass="w-full h-14"
                        value={searchText}
                        onChange={(e: any) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {showCustomTable && (
                  <div className="lg:w-full w-[25rem] px-2 md:px-0 fade-in">
                    <CustomTableOld
                      isLoading={isLoading}
                      rowId="number"
                      resetPageSignal={searchText}
                      rows={filteredVouchers}
                      columns={VoucherListTable.columns}
                    />
                  </div>
                )}
              </>
            )}

            {vouchersClient === "Cliente" && (
              <>
                <div className="md:grid md:grid-cols-1 gap-8 my-2 fill-careDarkBlue mt-10 fade-in">
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
                          <IoArrowForwardOutline
                            className="text-white"
                            size={25}
                          />
                        </div>
                      </div>
                      {shwowDetails && (
                        <div className="bg-[#F5FAFE] border border-careLightBlue rounded-lg w-full h-14 flex items-center gap-5 px-5 py-10 mt-5 md:mt-0">
                          <div className="flex flex-col ">
                            <span className="text-careBlue">CPF</span>
                            <span className="text-careLightBlue">
                              {cpfPatient}
                            </span>
                          </div>
                          <div className="flex flex-col ">
                            <span className="text-careBlue">Nome</span>
                            <span className="text-careLightBlue">
                              {namePatient}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col md:flex md:flex-row md:items-center mt-5 md:gap-2  w-full">
                        <span className="text-sm text-careBlue mt-1">
                          Exibir status:
                        </span>
                        <NewSelected
                          options={[
                            { value: "Todos", id: "Todos" },
                            {
                              value: "Utilizado",
                              id: "815f3563-d634-4be8-a8f9-c5f112bc26ed",
                            },
                            {
                              value: "Resgatado",
                              id: "9f98e94f-499b-4dcb-ac3c-383179dbc3e2",
                            },
                            {
                              value: "Expirado",
                              id: "c281779c-3dd9-4720-b80a-70275a8403a6",
                            },
                            {
                              value: "A resgatar",
                              id: "9e8a5574-498a-4909-8444-4e95be06a82b",
                            },
                          ]}
                          placeholder="Mais recentes"
                          customClass="rounded-lg w-full md:w-64 h-14 bg-blue-200 text-careLightBlue text-sm"
                          onChange={(event: any) => {
                            setStatusFilterClient(event.target.value);
                          }}
                          value={statusFilterClient || ""}
                        />
                      </div>
                      <div className="w-full mt-5">
                        <Input
                          maxLength={14}
                          id="search"
                          name="search"
                          placeholder="Pesquisar"
                          startIcon
                          imageSrc="/search-icon.png"
                          onChange={(e) => setSearchTermClient(e.target.value)}
                          customClass="w-full h-14"
                        />
                      </div>
                    </div>
                  </div>
                  {showTableVoucherPatient && (
                    <div className="lg:w-full w-[25rem] px-2 md:px-0">
                      <CustomTableOld
                        isLoading={isLoading}
                        rowId="id"
                        rows={filteredClientVouchers}
                        columns={TableMockupPacient.columns}
                        resetPageSignal={searchTermClient}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}

      <ModalShedulingCancel
        isOpen={editVoucher.isOpen}
        onClose={() => {
          editVoucher.onClose();
        }}
        customClass="w-full md:w-[70%] h-full md:h-auto"
      >
        <EditVoucher refreshTable={refreshTableData} />
      </ModalShedulingCancel>
    </>
  );
};

export default Voucher;
// function fetchVouchers(cleanedFilters: { deadlineInDays?: string | undefined; voucherTypes?: string | undefined; status?: string | undefined; }) {
//   throw new Error("Function not implemented.");
// }
