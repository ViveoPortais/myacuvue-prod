import React, { useEffect, useState, useCallback, useRef } from "react";
import Input from "../input/Input";
import CustomTable from "../table/CustomTable";
import { BsSearch } from "react-icons/bs";
import { TableMockupPartiner } from "@/helpers/TableMockupPartiner";
import Button from "../button/Button";
import CreatePartiner from "./CreatePartiner";
import useRegisterPartiner from "@/hooks/useRegisterPartiner";
import { listPartiner } from "@/services/partiner";
import useEditPartiner from "@/hooks/useEditPartiner";
import EditPartiner from "./EditPartiner";
import useDataStorage from "@/hooks/useDataStorage";
import { BsPlusLg } from "react-icons/bs";
import EditPartinerModal from "../modals/EditPartinerModal";
import useOpenModalCancel from "@/hooks/useOpenModalCancel";
import NewModal from "../modals/NewModal";
import { deletePartiner, updatePartiner } from "@/services/partiner";
import useDataStoragePartiner from "@/hooks/useDataStoragePartiner";
import { ToastContainer, toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";

const RegisterPartiner = ({ refreshTable }: { refreshTable?: () => void }) => {
  const editPartiner = useEditPartiner();
  const partiner = useRegisterPartiner();
  const dataScheduling = useDataStorage();
  const [partinerList, setPartinerList] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefreshTable, setShouldRefreshTable] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  const dataStoragePartiner = useDataStoragePartiner();

  const openModalCancel = useOpenModalCancel();

  const filterValueRef = useRef<string>(filterValue);
  filterValueRef.current = filterValue;

  const getPartinerData = useCallback(() => {
    setIsLoading(true);
    const filters = {
      friendlyCode: filterValueRef.current,
      mainContact: filterValueRef.current,
    };

    listPartiner(filters)
      .then((partiners) => {
        partiners.sort((a: any, b: any) => {
          const dateA = new Date(a.createdOn);
          const dateB = new Date(b.createdOn);
          return dateB.getTime() - dateA.getTime();
        });
        setPartinerList(partiners);
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de parceiros:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataScheduling.refresh]);

  useEffect(() => {
    getPartinerData();
  }, [getPartinerData]);

  const filterPartiners = useCallback(
    (partinerList: any[], filterValue: string) => {
      if (!filterValue) {
        return partinerList;
      }
      const filterValueLowerCase = filterValue.toLowerCase();
      return partinerList.filter((partiner) => {
        const friendlyCodeMatch =
          partiner.friendlyCode?.toLowerCase().includes(filterValueLowerCase) ||
          false;
        const mainContactMatch =
          partiner.mainContact?.toLowerCase().includes(filterValueLowerCase) ||
          false;
        return friendlyCodeMatch || mainContactMatch;
      });
    },
    []
  );

  const filteredPartinerList = filterPartiners(partinerList, filterValue);

  const refreshTableData = () => {
    setShouldRefreshTable(true);
  };

  const handleDeletePartiner = () => {
    const friendlyCode = dataStoragePartiner.partnerData.friendlyCode;
    const programCodeToDelete = "073";

    deletePartiner(friendlyCode, programCodeToDelete)
      .then((res) => {
        toast.success("Parceiro deletado com sucesso!");
        dataScheduling.setRefresh(!dataScheduling.refresh);
        editPartiner.onClose();
        openModalCancel.onClose();
        refreshTableData();
      })
      .catch((err) => {
        toast.error("Erro ao deletar parceiro!");
      });
  };

  return (
    <>
      {editPartiner.isOpen && (
        <EditPartinerModal refreshTable={refreshTableData} />
      )}
      {partiner.isOpen && <CreatePartiner refreshTable={refreshTableData} />}
      {!partiner.isOpen && !editPartiner.isOpen && (
        <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 fade-in">
          <span className="mb-2">
            Aqui você pode gerenciar os cadastros de todos os parceiros.
          </span>
          <div className={`bg-white rounded-lg p-6 mb-6 mt-4 w-full box-border ${isMobile ? "border-0" : "border border-careCyan"}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div className="w-full md:max-w-[600px]">
                <Input
                  id="input-buscar-parceiro"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Buscar parceiro pelo Nome / ID"
                  imageSrc="/search-icon.png"
                  startIcon
                />
              </div>
              <div>
                <Button
                  id="btn-cadastrar-parceiro"
                  onClick={partiner.onOpen}
                  label="Cadastrar Parceiro"
                  leftIcon={BsPlusLg}
                  customClass="w-full md:w-auto bg-[#0A7CC1] text-white h-14 md:h-12 rounded-xl text-sm px-6 border-none"
                  customColor="text-white"
                />
              </div>
            </div>
            <div className="mb-8 md:mb-0 h-auto overflow-visible">
              <div className="h-auto overflow-visible">
                <CustomTable
                  isLoading={isLoading}
                  rowId="friendlyCode"
                  rows={filteredPartinerList}
                  columns={TableMockupPartiner.columns}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {openModalCancel.isOpen && (
        <NewModal
          isOpen={true}
          title="Excluir parceiro"
          isCloseIconVisible={true}
          onClose={openModalCancel.onClose}
          buttonText="Sim, excluir"
          buttonTextTwo="Voltar"
          customClass={`row-buttons ${isMobile ? "modal-mobile" : ""}`}
          onClickConfirm={handleDeletePartiner}
          onClickCancel={() => {
            openModalCancel.onClose();
          }}
        >
          <div className="flex flex-col items-center my-8">
            <span className="text-careDarkBlue font-bold mt-5">
              Deseja realmente excluir o cadastro desse parceiro?
            </span>
          </div>
        </NewModal>
      )}
    </>
  );
};

export default RegisterPartiner;
