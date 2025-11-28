import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import CustomTable from "../table/CustomTable";
import { TableScheduleManagement } from "@/helpers/TableScheduleManagement";
import { TableAttendanceConfirmation } from "@/helpers/TableAttendanceConfirmation";
import {
  cancelVisitClinic,
  confirmVisitClinic,
  listConfirmedVisitiClinic,
  listVisitiClinic,
} from "@/services/diagnostic";
import useDataStorage from "@/hooks/useDataStorage";
import ModalSeeMoreRecipe from "../modals/ModalSeeMoreRecipe";
import useRegisterModal from "@/hooks/useRegisterModal";
import NewModal from "../modals/NewModal";
import useOpenModalConfirm from "@/hooks/useOpenModalConfirm";
import { toast } from "react-toastify";
import useOpenModalCancel from "@/hooks/useOpenModalCancel";

const SchedulingPartiner = () => {
  const dataScheduling = useDataStorage();
  const openModal = useOpenModalConfirm();
  const modalCancelation = useOpenModalCancel();
  const register = useRegisterModal();
  const [listClinic, setListVisitiClinic] = useState<any[]>([]);
  const [listConfirmed, setListConfirmed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickedConfirm = () => {
    const idVisitConfirm = {
      programCode: "073",
      visitid: dataScheduling.idConfirmation,
    };
    confirmVisitClinic(idVisitConfirm).then((response) => {
      openModal.onClose();
      dataScheduling.setRefresh(!dataScheduling.refresh);
      toast.success("Agendamento confirmado com sucesso!");
    });
  };

  const handleClickedCancel = () => {
    const idVisitCancel = {
      programCode: "073",
      visitid: dataScheduling.idConfirmation,
    };
    cancelVisitClinic(idVisitCancel).then((response) => {
      modalCancelation.onClose();
      dataScheduling.setRefresh(!dataScheduling.refresh);
      toast.success("Agendamento cancelado com sucesso!");
    });
  };

  const getVisitiData = useCallback(() => {
    setIsLoading(true);
    listVisitiClinic()
      .then((response) => {
        dataScheduling.setIdSchedule(response);
        setListVisitiClinic(response);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataScheduling.refresh]);

  useEffect(() => {
    getVisitiData();
  }, [getVisitiData]);

  const getConfirmedVisitiClinic = useCallback(() => {
    setIsLoading(true);
    listConfirmedVisitiClinic()
      .then((response) => {
        setListConfirmed(response);
      })
      .catch((error) => {})
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataScheduling.refresh]);

  useEffect(() => {
    getConfirmedVisitiClinic();
  }, [getConfirmedVisitiClinic]);

  return (
    <div>
      <div className="bg-careGrey col-span-3 rounded-md p-2 flex items-center">
        <div className="border-careLightBlue border-r-[2px] text-careDarkBlue">
          <AiOutlineInfoCircle className="mr-3" size="2rem" />
        </div>
        <span className="pl-5 text-careDarkBlue">
          Visualize aqui todos os agendamentos solicitados.​ Após a confirmação,
          você verá na aba “Confirmação de agendamentos”.
        </span>
      </div>
      <div className="mt-10">
        <span className="md:text-3xl text-2xl text-careLightBlue mb-10">
          Gestão de Agendamentos
        </span>
        <div className="md:w-full w-[21.5rem] mt-3">
          <CustomTable
            isLoading={isLoading}
            rowId="visitId"
            rows={listClinic}
            columns={TableScheduleManagement.columns}
          />
        </div>
      </div>
      <div className="mt-5">
        <span className="md:text-3xl text-[1.4rem] text-careLightBlue mb-10">
          Confirmação de Comparecimento
        </span>
        <div className="md:w-full w-[21.5rem] mt-3 mb-5">
          <CustomTable
            isLoading={isLoading}
            rowId="visitId"
            rows={listConfirmed}
            columns={TableAttendanceConfirmation.columns}
          />
        </div>
      </div>
      {register.isOpen && (
        <div>
          <ModalSeeMoreRecipe />
        </div>
      )}
      {openModal.isOpen && (
        <NewModal
          id="modal-confirm-visit"
          isOpen={true}
          title="Deseja CONFIRMAR o"
          subtitlle="agendamento?"
          isCloseIconVisible={false}
          onClose={() => {}}
          buttonText="Confirmar"
          buttonTextTwo="Cancelar"
          onClickConfirm={handleClickedConfirm}
          onClickCancel={() => {
            openModal.onClose();
          }}
        >
          <div className="flex flex-col items-center my-8">
            <span className="text-careDarkBlue">
              Atenção! Após a confirmação do agendamento, o paciente
            </span>
            <span className="text-careDarkBlue">
              será notificado por e-mail.
            </span>
            <span className="text-careDarkBlue font-bold mt-5">
              Deseja confirmar esta ação?
            </span>
          </div>
        </NewModal>
      )}
      {modalCancelation.isOpen && (
        <NewModal
          id="modal-cancel-visit"
          isOpen={true}
          title="Deseja CANCELAR"
          subtitlle="o agendamento?"
          isCloseIconVisible={false}
          onClose={() => {}}
          buttonText="Confirmar"
          buttonTextTwo="Cancelar"
          onClickConfirm={handleClickedCancel}
          onClickCancel={() => {
            modalCancelation.onClose();
          }}
        >
          <div className="flex flex-col items-center my-8">
            <span className="text-careDarkBlue">
              Atenção! Após confirmação, não será possível desfazer a ação
            </span>
            <span className="text-careDarkBlue">
              e o paciente será notificado por e-mail sobre o cancelamento.
            </span>
            <span className="text-careDarkBlue font-bold mt-5">
              Deseja confirmar esta ação?
            </span>
          </div>
        </NewModal>
      )}
    </div>
  );
};

export default SchedulingPartiner;
