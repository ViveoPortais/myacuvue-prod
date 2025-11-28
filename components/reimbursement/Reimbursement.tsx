import React from "react";
import CustomTable from "../table/CustomTable";
import { TableProductreimbursement } from "@/helpers/TableProductreimbursement";
import { TableDataProduct } from "@/helpers/TableDataProduct";
import { AiOutlineInfoCircle, AiOutlinePlus } from "react-icons/ai";
import Button from "../button/Button";
import { useEffect, useState, useCallback } from "react";
import {
  addRepayment,
  listPurchase,
  listReimbursementData,
} from "@/services/purchase";
import { toast } from "react-toastify";
import useDataStorage from "@/hooks/useDataStorage";
import "animate.css";
import { useRouter } from "next/router";
import Selected from "../selectedProducted/Selected";
import SelectedReimbursement from "../selectedProducted/SelectedReimbursement";
import NewModal from "../modals/NewModal";
import useOpenModalConfirm from "@/hooks/useOpenModalConfirm";

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

const Reimbursement = ({ clientData, selectedStatus }: SearchModalProps) => {
  const [inputBlocks, setInputBlocks] = useState([1]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [reimbursementList, setReimbursementList] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const useData = useDataStorage();
  const router = useRouter();
  const openModalReimbursement = useOpenModalConfirm();
  const [isLoading, setIsLoading] = useState(false);
  const [hideTable, setHideTable] = useState(false);

  const handleClickReimbursement = () => {
    setHideTable(true);
  };

  const getVisitiData = useCallback(() => {
    setIsLoading(true);
    listPurchase()
      .then((response) => {
        setPurchaseList(response.value);
      })
      .catch((error) => {})
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTable, useData.refresh]);

  const getReimbursementData = useCallback(() => {
    setIsLoading(true);
    listReimbursementData()
      .then((response) => {
        setReimbursementList(response.value);
      })
      .catch((error) => {})
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTable, useData.refresh]);

  useEffect(() => {
    getVisitiData();
    getReimbursementData();
  }, [getVisitiData, getReimbursementData, refreshTable, useData.refresh]);

  const handleClick = () => {
    setIsLoading(true);
    const dataSelected = {
      programCode: "073",
      items: useData.AxiesId,
    };
    setRefreshTable(false);
    addRepayment(dataSelected as any)
      .then((response) => {
        router.push("/dashboard/home");
        toast.success("Reembolso realizado com sucesso");
        setRefreshTable(true);
        useData.setAxiesId([]);
      })
      .catch((error) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClearFields = () => {
    useData.setAxiesId([]);
  };

  const quantityOptions = Array.from({ length: 30 }, (_, i) => ({
    value: (i + 1).toString(),
    id: (i + 1).toString(),
  }));

  return (
    <div>
      <div className=" md:grid md:grid-cols-4 rounded-lg">
        <div className="bg-careGrey col-span-3 rounded-md p-2 flex items-center">
          <div className="border-careLightBlue border-r-[2px] text-careDarkBlue">
            <AiOutlineInfoCircle className="mr-3" size="2rem" />
          </div>
          <span className="pl-5 text-careDarkBlue">
            Aqui você pode realizar o processo de reembolso para os clientes,
            quando solicitado.
          </span>
        </div>
        <div className="mt-2 md:ml-10 mb-2 ">
          <Button
            id="btn-reembolsar"
            onClick={handleClickReimbursement}
            customClass="md:w-60 bg-careBlue border-careBlue p-4 py-2"
            label="SOLICITAR REEMBOLSO"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex md:flex-row gap-2 mt-10 mb-5 fade-in">
        <div className="md:w-96 w-[21.5rem]">
          <span className="text-3xl text-careLightBlue">Extrato total:</span>
          <div className="mt-3">
            <CustomTable
              isLoading={isLoading}
              rowId="productName"
              rows={purchaseList}
              columns={TableProductreimbursement.columns}
            />
          </div>
        </div>
        <div className="md:w-[63.55%] w-[21.5rem]">
          <span className="text-3xl text-careLightBlue">
            Confirmação de Reembolso
          </span>
          <div className="mt-3">
            <CustomTable
              isLoading={isLoading}
              rowId="voucher"
              rows={reimbursementList}
              columns={TableDataProduct.columns}
            />
          </div>
        </div>
      </div>
      {hideTable ? (
        <>
          <div>
            {inputBlocks.map((item, index) => (
              <div key={index} className="md:flex md:flex-row flex flex-col">
                <SelectedReimbursement clientData={clientData} />
                {inputBlocks.length < 4 ? (
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
          </div>
          <div className="mt-5 md:flex md:flex-row mb-5 flex flex-col items-center justify-end">
            <Button
              id="btn-limpar"
              onClick={handleClearFields}
              label="Limpar"
              customClass="bg-white border-careDarkBlue text-careDarkBlue h-12 md:w-40 w-full text-sm mr-2 mt-2"
            />
            <Button
              id="btn-enviar"
              onClick={openModalReimbursement.onOpen}
              label="Enviar"
              customClass="bg-careGreen border-careGreen h-12 md:w-40 w-full text-sm mr-2 mt-2"
            />
          </div>
          {openModalReimbursement.isOpen && (
            <NewModal
              id="enviar-reembolso"
              isOpen={true}
              title="Deseja ENVIAR a solicitação"
              subtitlle="de Reembolso?"
              isCloseIconVisible={false}
              onClose={() => {}}
              buttonText="Confirmar"
              buttonTextTwo="Cancelar"
              onClickConfirm={handleClick}
              onClickCancel={() => {
                openModalReimbursement.onClose();
              }}
            >
              <div className="flex flex-col items-center my-8">
                <span className="text-careDarkBlue">
                  Atenção! Você poderá Validar Vouchers e, ao clicar em Gerar
                </span>
                <span className="text-careDarkBlue">
                  Pedido de Compra, o Saldo de Bonificação no extrato será
                </span>
                <span className="text-careDarkBlue">
                  utilizado no abatimento das caixas faturadas
                </span>
                <span className="text-careDarkBlue font-bold mt-5">
                  Deseja confirmar esta ação?
                </span>
              </div>
            </NewModal>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Reimbursement;
