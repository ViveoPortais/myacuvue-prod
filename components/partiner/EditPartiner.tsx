import React, { useState } from "react";
import Input from "../input/Input";
import CustomSelect from "../select/Select";
import Button from "../button/Button";
import { ToastContainer, toast } from "react-toastify";
import InputMask from "react-input-mask";
import { deletePartiner, updatePartiner } from "@/services/partiner";
import useEditPartiner from "@/hooks/useEditPartiner";
import useDataStoragePartiner from "@/hooks/useDataStoragePartiner";
import { getAddressByCep } from "@/services/cep";
import { useRouter } from "next/router";
import useDataStorage from "@/hooks/useDataStorage";
import InputLoading from "../loading/InputLoading";
import useOpenModalConfirm from "@/hooks/useOpenModalConfirm";
import NewModal from "../modals/NewModal";
import useOpenModalCancel from "@/hooks/useOpenModalCancel";

const EditPartiner = ({ refreshTable }: { refreshTable: () => void }) => {
  const dataStoragePartiner = useDataStoragePartiner();
  const dataScheduling = useDataStorage();
  const editPartiner = useEditPartiner();
  const openModalEdit = useOpenModalConfirm();
  const openModalCancel = useOpenModalCancel();
  const router = useRouter();
  const [editMode, setEditMode] = useState(true);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [updatedPartiner, setUpdatedPartiner] = useState({
    userId: dataStoragePartiner.partnerData.userId,
    name: dataStoragePartiner.partnerData.name,
    telephone1: dataStoragePartiner.partnerData.telephone,
    mobilePhone: dataStoragePartiner.partnerData.mobilePhone,
    emailAddress: dataStoragePartiner.partnerData.emailAddress,
    emailAddress2: dataStoragePartiner.partnerData.emailAddress2,
    addressPostalCode: dataStoragePartiner.partnerData.addressPostalCode,
    addressName: dataStoragePartiner.partnerData.addressName,
    addressNumber: dataStoragePartiner.partnerData.addressNumber,
    addressComplement: dataStoragePartiner.partnerData.addressComplement,
    addressDistrict: dataStoragePartiner.partnerData.addressDistrict,
    addressCity: dataStoragePartiner.partnerData.addressCity,
    addressState: dataStoragePartiner.partnerData.addressState,
    addressCountry: dataStoragePartiner.partnerData.addressCountry,
    cnpj: dataStoragePartiner.partnerData.cnpj,
    mainContact: dataStoragePartiner.partnerData.mainContact,
    password: dataStoragePartiner.partnerData.password,
    accountTypeStringMapFlag: dataStoragePartiner.partnerData.profileCode,
    codeSap: dataStoragePartiner.partnerData.codeSap,
    oldCodeSap: dataStoragePartiner.partnerData.oldCodeSap,
    ProgramCode: "073",
  });

  const handleDeletePartiner = () => {
    const friendlyCode = dataStoragePartiner.partnerData.friendlyCode;
    const programCodeToDelete = "073";

    deletePartiner(friendlyCode, programCodeToDelete)
      .then((res) => {
        toast.success("Parceiro deletado com sucesso!");
        dataScheduling.setRefresh(!dataScheduling.refresh);
        editPartiner.onClose();
        openModalCancel.onClose();
        refreshTable();
      })
      .catch((err) => {
        toast.error("Erro ao deletar parceiro!");
      });
  };

  const handleUpdatePartiner = () => {
    const originalData = {
      userId: dataStoragePartiner.partnerData.userId,
      name: dataStoragePartiner.partnerData.name,
      telephone1: dataStoragePartiner.partnerData.telephone,
      mobilePhone: dataStoragePartiner.partnerData.mobilePhone,
      emailAddress: dataStoragePartiner.partnerData.emailAddress,
      emailAddress2: dataStoragePartiner.partnerData.emailAddress2,
      addressPostalCode: dataStoragePartiner.partnerData.addressPostalCode,
      addressName: dataStoragePartiner.partnerData.addressName,
      addressNumber: dataStoragePartiner.partnerData.addressNumber,
      addressComplement: dataStoragePartiner.partnerData.addressComplement,
      addressDistrict: dataStoragePartiner.partnerData.addressDistrict,
      addressCity: dataStoragePartiner.partnerData.addressCity,
      addressState: dataStoragePartiner.partnerData.addressState,
      addressCountry: dataStoragePartiner.partnerData.addressCountry,
      cnpj: dataStoragePartiner.partnerData.cnpj,
      mainContact: dataStoragePartiner.partnerData.mainContact,
      password: dataStoragePartiner.partnerData.password,
      accountTypeStringMapFlag: dataStoragePartiner.partnerData.profileCode,
      codeSap: dataStoragePartiner.partnerData.codeSap,
      oldCodeSap: dataStoragePartiner.partnerData.oldCodeSap,
      ProgramCode: "073",
    };

    if (isEqual(updatedPartiner, originalData)) {
      toast.info("Não houve alterações!");
      openModalEdit.onClose();
      return;
    }

    updatePartiner(updatedPartiner)
      .then(() => {
        toast.success("Dados do Parceiro atualizado com sucesso!");
        dataScheduling.setRefresh(!dataScheduling.refresh);
        editPartiner.onClose();
        openModalEdit.onClose();
        refreshTable();
      })
      .catch(() => {
        toast.error("Erro ao atualizar dados do parceiro!");
      });
  };

  const handleAddress = () => {
    setIsLoadingAddress(true);
    getAddressByCep(updatedPartiner.addressPostalCode)
      .then((res) => {
        setUpdatedPartiner({
          ...updatedPartiner,
          addressName: res.logradouro,
          addressDistrict: res.bairro,
          addressCity: res.localidade,
          addressState: res.uf,
          addressCountry: "Brasil",
        });
        setIsLoadingAddress(false);
      })
      .catch((err) => {
        setIsLoadingAddress(false);
      });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUpdatedPartiner({ ...updatedPartiner, [name]: value });
  };

  const maskedCNPJ = () => {
    return (
      <InputMask
        id="input-editar-parceiro-cnpj"
        disabled
        value={updatedPartiner.cnpj}
        onChange={handleChange}
        mask="99.999.999/9999-99"
        maskChar={null}
      >
        {(inputProps: any) => (
          <Input
            disabled
            {...inputProps}
            startIcon
            imageSrc="/education-teacher.png"
          />
        )}
      </InputMask>
    );
  };

  const maskedPhone = () => {
    return (
      <InputMask
        id="input-editar-parceiro-telefone"
        disabled={!editMode}
        name="telephone1"
        value={updatedPartiner.telephone1}
        onChange={handleChange}
        mask="(99) 9999-9999"
        maskChar={null}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="(DDD) XXXX-XXXX"
            startIcon
            imageSrc="/communication-call.png"
          />
        )}
      </InputMask>
    );
  };

  const maskedMobilePhone = () => {
    return (
      <InputMask
        id="input-editar-parceiro-celular"
        disabled={!editMode}
        name="mobilePhone"
        value={updatedPartiner.mobilePhone}
        onChange={handleChange}
        mask="(99) 99999-9999"
        maskChar={null}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="(DDD) XXXX-XXXX"
            startIcon
            imageSrc="/communication-call.png"
          />
        )}
      </InputMask>
    );
  };

  const maskedCep = () => {
    return (
      <InputMask
        id="input-editar-parceiro-cep"
        disabled={!editMode}
        value={updatedPartiner.addressPostalCode}
        name="addressPostalCode"
        onChange={handleChange}
        mask="99999-999"
        maskChar={null}
        onBlur={handleAddress}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            maxLength={10}
            startIcon
            imageSrc="/navigation-maps.png"
          />
        )}
      </InputMask>
    );
  };

  const isEqual = (obj1: any, obj2: any) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  return (
    <>
      <div className="md:grid md:grid-cols-1">
        <div>
          <span className="text-2xl text-careLightBlue">Editar parceiro</span>
          <div className="sm:grid grid-cols-1 md:grid md:grid-cols-3 gap-6 mt-5">
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Nome:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">
                    O nome do responsável deve ser único
                  </span>
                </span>
              </div>
              <Input
                id=" input-editar-parceiro-nome"
                disabled={!editMode}
                maxLength={50}
                name="mainContact"
                value={updatedPartiner.mainContact}
                onChange={handleChange}
                startIcon
                imageSrc="/user-user.png"
              />
            </div>
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Razão Social:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">
                    O nome da empresa deve ser único
                  </span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-razao-social"
                name="name"
                value={updatedPartiner.name}
                disabled
                startIcon
                imageSrc="/health-hospital.png"
              />
            </div>
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">CNPJ:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">
                    O CNPJ deve ser único e válido
                  </span>
                </span>
              </div>
              {maskedCNPJ()}
            </div>
          </div>
        </div>
      </div>
      <div className="md:grid md:grid-cols-1 gap-8">
        <div className="mt-2">
          <div className="sm:grid grid-caols-1 mb-8 md:mb-0 md:grid grid-cols-3 gap-6">
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Código SAP Anterior:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">
                    O código SAP deve ser único
                  </span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-old-codigo-sap"
                disabled
                maxLength={20}
                name="oldCodeSap"
                value={updatedPartiner.oldCodeSap}
                onChange={handleChange}
                startIcon
                imageSrc="/icon-sap.png"
              />
            </div>
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Código SAP:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">
                    O código SAP deve ser único
                  </span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-codigo-sap"
                disabled={!editMode}
                maxLength={20}
                name="codeSap"
                value={updatedPartiner.codeSap}
                onChange={handleChange}
                startIcon
                imageSrc="/icon-sap.png"
              />
            </div>
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Tipo:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">
                    Selecione o tipo de parceiro
                  </span>
                </span>
              </div>
              <CustomSelect
                id="select-editar-parceiro-tipo"
                disabled={!editMode}
                name="accountTypeStringMapFlag"
                value={updatedPartiner.accountTypeStringMapFlag}
                onChange={handleChange}
                startIcon
                imageSrc="/eyes-icon.png"
                fullWidth
                placeholder="Especifique"
                options={[
                  {
                    id: "#Clinic",
                    value: "(ECP) Clínicas",
                  },
                  {
                    id: "#POS",
                    value: "PDV (Óticas)",
                  },
                ]}
              />
            </div>
          </div>
          <div
            className="col-span-3 w-full h-[1px] my-8 md:mt-6 mb-4"
            style={{ backgroundColor: "rgb(132, 189, 223)" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">CEP:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">Digite um CEP válido</span>
                </span>
              </div>
              {maskedCep()}
            </div>

            <div className="col-span-1">
              <div className="flex gap-2">
                <span className="text-careBlue">Endereço:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-endereco"
                disabled={!editMode}
                maxLength={160}
                name="addressName"
                value={updatedPartiner.addressName}
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
              />
            </div>

            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Número:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">Digite um número válido</span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-numero"
                disabled={!editMode}
                maxLength={160}
                name="addressNumber"
                value={updatedPartiner.addressNumber}
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
              />
            </div>

            <div>
              <span className="text-careBlue">Complemento:</span>
              <Input
                id="input-editar-parceiro-complemento"
                disabled={!editMode}
                maxLength={160}
                name="addressComplement"
                value={updatedPartiner.addressComplement}
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Bairro:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-bairro"
                disabled={!editMode}
                maxLength={160}
                name="addressDistrict"
                value={updatedPartiner.addressDistrict}
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
              />
            </div>

            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Cidade:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-cidade"
                disabled={!editMode}
                maxLength={160}
                name="addressCity"
                value={updatedPartiner.addressCity}
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
              />
            </div>

            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Estado:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-estado"
                disabled={!editMode}
                maxLength={160}
                name="addressState"
                value={updatedPartiner.addressState}
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="col-span-3 w-full h-[1px] my-8 md:mt-6 mb-4"
        style={{ backgroundColor: "rgb(132, 189, 223)" }}
      />
      <div className="md:grid md:grid-cols-1 gap-8 ">
        <div className="mt-2">
          <div className="sm:grid grid-cols-1 md:grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Telefone:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">Digite um telefone válido</span>
                </span>
              </div>
              {maskedPhone()}
            </div>
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Celular/Whatsapp:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">Digite um telefone válido</span>
                </span>
              </div>
              {maskedMobilePhone()}
            </div>
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">E-mail:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">Digite um e-mail válido</span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-email"
                name="emailAddress"
                value={updatedPartiner.emailAddress}
                onChange={handleChange}
                startIcon
                imageSrc="/communication-mail.png"
                placeholder="emailusuario@mail.com"
              />
            </div>
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue"> E-mail corporativo:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">
                    Digite um e-mail de parceiro válido
                  </span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-email-corporativo"
                name="emailAddress2"
                value={updatedPartiner.emailAddress2}
                onChange={handleChange}
                startIcon
                imageSrc="/communication-mail.png"
                placeholder="emailusuario@mail.com"
              />
            </div>
            <div className="text-careLightBlue">
              <div className="flex gap-2">
                <span className="text-careBlue">Senha:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                  <span className="tooltiptext">
                    Campo obrigatório, deve conter no mínimo 8 dígitos
                  </span>
                </span>
              </div>
              <Input
                id="input-editar-parceiro-senha"
                name="password"
                value={updatedPartiner.password}
                onChange={handleChange}
                startIcon
                imageSrc="/house-lock.png"
                placeholder="No minimo 8 dígitos"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
        <div className="flex flex-row gap-4">
          <Button
            id="btn-editar-parceiro-cancelar"
            onClick={openModalCancel.onOpen}
            label="Excluir parceiro"
            customClass="border-none bg-transparent mt-4 md:mt-0"
            customColor="text-red-600 font-bold underline uppercase"
          />
          <Button
            id="btn-editar-parceiro-cancelar-edicao"
            onClick={() => {
              setEditMode(false);
              editPartiner.onClose();
            }}
            customClass="bg-careBlue border-careBlue p-4 py-3 px-10 w-[180px] md:w-[200px]"
            label="Cancelar"
          />
          <Button
            id="btn-editar-parceiro-salvar"
            onClick={openModalEdit.onOpen}
            customClass="bg-careLightBlue border-careLightBlue p-4 py-3 px-10 w-[180px] md:w-[200px] whitespace-nowrap"
            label="Salvar edição"
          />
        </div>
      </div>
      {openModalEdit.isOpen && (
        <NewModal
          isOpen={true}
          title="Deseja confirmar a EDIÇÃO das"
          subtitlle="informações do parceiro?"
          isCloseIconVisible={false}
          onClose={() => {}}
          buttonText="Confirmar"
          buttonTextTwo="Cancelar"
          onClickConfirm={handleUpdatePartiner}
          onClickCancel={() => {
            openModalEdit.onClose();
          }}
        >
          <div className="flex flex-col items-center my-8">
            <span className="text-careDarkBlue">
              Atenção! Qualquer alteração nessas informações o parceiro
            </span>
            <span className="text-careDarkBlue">
              visualizará na Aba - Meus dados, como também
            </span>
            <span className="text-careDarkBlue">
              refletirá no acesso do parceiro.
            </span>
            <span className="text-careDarkBlue font-bold mt-5">
              Deseja confirmar esta ação?
            </span>
          </div>
        </NewModal>
      )}
    </>
  );
};

export default EditPartiner;
