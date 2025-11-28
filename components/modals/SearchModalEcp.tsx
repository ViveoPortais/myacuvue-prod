/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import CustomTable from "../table/CustomTable";
import { getListRescueVoucherPatients } from "@/services/voucher";
import useTalkModal from "@/hooks/useTalkModal";
import { TableMockupValidateVoucher } from "@/helpers/TableMockupValidateVoucher";
import { AiOutlineInfoCircle, AiOutlinePlus } from "react-icons/ai";
import Switch from "@mui/material/Switch";
import { addPurchase } from "@/services/purchase";
import { toast } from "react-toastify";
import useDataStorage from "@/hooks/useDataStorage";
import useOpen from "@/hooks/useOpen";
import Selected from "../selectedProducted/Selected";
import Loading from "../loading/Loading";
import NewModal from "./NewModal";
import useOpenModalConfirm from "@/hooks/useOpenModalConfirm";
import useOpenModalCancel from "@/hooks/useOpenModalCancel";

interface ClientData {
  name: string;
  cpf: string;
  email: string;
  vouchers: Voucher[];
}

interface Voucher {
  discountType: string;
  deadlineInDays: number;
  discountValue: number;
  status: string;
}

interface SearchModalProps {
  clientData: ClientData | null;
  selectedStatus: string;
}

const SearchModalEcp = ({ clientData, selectedStatus }: SearchModalProps) => {
  const [clientVouchers, setClientVouchers] = useState<Voucher[]>([]);
  const [inputBlocks, setInputBlocks] = useState([1]);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const showHistoryPacient = useTalkModal();
  const useData = useDataStorage();
  const openProduct = useOpen();
  const openModalEdit = useOpenModalConfirm();
  const openModalCancel = useOpenModalCancel();

  useEffect(() => {
    setIsLoading(true);
    if (clientData && clientData.cpf) {
      getListRescueVoucherPatients({ cpf: clientData.cpf })
        .then((data) => {
          setClientVouchers(data.vouchers);
        })
        .catch((error) => {
          error;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [clientData, useData.refresh]);

  const handleSendProduct = () => {
    setIsLoading(true);

    const adddescountVoucher = {
      voucherId: useData.idVoucher,
      programCode: "073",
      items: useData.AxiesId,
      IsGeneratePurchase: isChecked,
    };

    addPurchase(adddescountVoucher as any)
      .then((response) => {
        if (response.isValidData) {
          toast.success("Voucher e Produto resgatado enviado com sucesso!");
          useData.setRefresh(!useData.refresh);
          openProduct.onClose();
          openModalEdit.onClose();
          useData.setAxiesId([]);
        } else {
          toast.error("Não foi possível enviar voucher e produto resgatado!");
        }
      })
      .catch((error) => {
        toast.error("Erro ao enviar voucher e produto resgatado!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClearButtonClick = () => {
    openProduct.onClose();
    openModalCancel.onClose();
    showHistoryPacient.onClose();
    inputBlocks.length > 1 && setInputBlocks([1]);
  };

  return (
    <div>
      {clientData ? (
        <div>
          <div className="flex flex-row md:flex md:flex-col fade-in">
            <div className="md:rounded-t-xl w-40 pl-5 grid grid-cols-1 md:w-full bg-careLightGreen md:flex md:justify-around items-center pt-4 pb-4 text-xl text-white  ">
              <span>Cliente</span>
              <span>CPF</span>
              <span className="mr-5">Ações</span>
            </div>
            <div className=" md:rounded-b-xl p-2 grid grid-cols-1 w-full bg-careOffWhite md:flex md:justify-around items-center pt-3 pb-3 text-md text-careDarkBlue ">
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <span className="border-b-2 pt-1 md:ml-5 pb-2 md:border-none">
                    {clientData.name}
                  </span>
                  <span className="border-b-2 pt-1 pb-2 md:border-none">
                    {clientData.cpf}
                  </span>
                  <div className="flex justify-end pt-2 md:pt-0 ">
                    <Button
                      id="button-resgatar-voucher-por-cpf-partiner-ecp"
                      onClick={showHistoryPacient.onOpen}
                      disableHover
                      label="Ver mais"
                      customClass="bg-careDarkBlue border-careDarkBlue p-9 py-1 mr-1"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {showHistoryPacient.isOpen ? (
            <div className="mt-7 md:flex md:flex-row gap-5 fade-in">
              <div className="md:w-full w-[22rem]">
                <CustomTable
                  isLoading={isLoading}
                  rowId="id"
                  rows={clientVouchers}
                  columns={TableMockupValidateVoucher.columns}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {openProduct.isOpen ? (
        <>
          {inputBlocks.map((item, index) => (
            <div key={index} className="md:flex md:flex-row flex flex-col">
              <Selected
                clientData={clientData}
                totalQuantity={inputBlocks.length}
              />
              {inputBlocks.length < 2 ? (
                <div className="bg-careMenuGrey rounded-full p-4 h-5 w-5 relative md:top-11 md:left-3 cursor-pointer mt-3 md:mt-20">
                  <span
                    onClick={() =>
                      setInputBlocks([...inputBlocks, inputBlocks.length + 1])
                    }
                    className="relative right-2 bottom-2"
                  >
                    <AiOutlinePlus className="text-white" />
                  </span>
                </div>
              ) : null}
            </div>
          ))}

          <div className="bg-careGrey col-span-3 rounded-md p-2 md:flex md:flex-row md:justify-between lg:flex lg:flex-row lg:justify-between flex flex-col mt-4">
            <div className="flex items-center">
              <div className="border-careDarkPurple border-r-[2px] text-careDarkPurple">
                <AiOutlineInfoCircle className="mr-3" size="2rem" />
              </div>
              <span className="pl-5 text-careDarkBlue">
                Caso necessário, você poderá gerar um pedido de compra.
              </span>
            </div>
            <div className="flex items-center lg:mt-0 md:mt-0 mt-2">
              <Switch
                id="checkbox-pedido-de-compra"
                {...label}
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <span className="text-careDarkBlue font-bold">
                Gerar pedido de compra
              </span>
            </div>
          </div>
          <div className="mt-5 md:flex md:flex-row flex flex-col items-center justify-end">
            <Button
              id="button-cancelar-pedido-de-compra"
              onClick={openModalCancel.onOpen}
              label="Cancelar"
              customClass="bg-careDarkBlue border-careDarkBlue h-12 md:w-40 w-full text-sm mr-2 mt-2"
            />
            <Button
              id="button-salvar-pedido-de-compra"
              onClick={openModalEdit.onOpen}
              label="Salvar"
              customClass="bg-careLightBlue border-careLightBlue h-12 md:w-40 w-full text-sm mr-2 mt-2"
              disabled={
                useData.AxiesId && useData.AxiesId.length > 0 ? false : true
              }
            />
          </div>
        </>
      ) : null}

      {openModalEdit.isOpen && (
        <NewModal
          id="modal-confirmar-pedido-de-compra"
          isOpen={true}
          title="Deseja CONFIRMAR o Pedido"
          subtitlle="de Compra"
          isCloseIconVisible={false}
          onClose={() => {}}
          buttonText="Confirmar"
          buttonTextTwo="Cancelar"
          onClickConfirm={handleSendProduct}
          onClickCancel={() => {
            openModalEdit.onClose();
          }}
        >
          <div className="flex flex-col items-center my-8">
            <span className="text-careDarkBlue">
              Atenção! Certifique de que a solicitação foi gerada no SAP
            </span>

            <span className="text-careDarkBlue font-bold mt-5">
              Deseja confirmar esta ação?
            </span>
          </div>
        </NewModal>
      )}
      {openModalCancel.isOpen && (
        <NewModal
          id="modal-cancelar-pedido-de-compra"
          isOpen={true}
          title="Deseja CANCELAR o Pedido"
          subtitlle="de Compra"
          isCloseIconVisible={false}
          onClose={() => {}}
          buttonText="Confirmar"
          buttonTextTwo="Cancelar"
          onClickConfirm={handleClearButtonClick}
          onClickCancel={() => {
            openModalCancel.onClose();
          }}
        >
          <div className="flex flex-col items-center my-8">
            <span className="text-careDarkBlue">
              Atenção! Após CANCELAMENTO do parceiro terá de abrir
            </span>
            <span className="text-careDarkBlue">uma nova solicitação</span>

            <span className="text-careDarkBlue font-bold mt-5">
              Deseja confirmar esta ação?
            </span>
          </div>
        </NewModal>
      )}
    </div>
  );
};

export default SearchModalEcp;
