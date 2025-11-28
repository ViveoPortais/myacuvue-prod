import React, { useEffect, useState } from "react";
import useLogin from "@/hooks/useLogin";
import Input from "@/components/input/Input";
import InputMask from "react-input-mask";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import Button from "@/components/button/Button";
import { toast } from "react-toastify";
import {
  listDatePartiner,
  listPartiner,
  updateDataPartiner,
} from "@/services/partiner";
import { strongPassword } from "@/services/login";
import ReCAPTCHA from "react-google-recaptcha";
import useDataStoragePartiner from "@/hooks/useDataStoragePartiner";
import CustomCheckbox from "../custom/customCheckbox";

const DataPartiner = () => {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyCaptcha, setVerifyCaptcha] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const auth = useLogin();

  const [userDataPartiner, setUserDataPartiner] = useState({
    mainContact: "",
    name: "",
    cnpj: "",
    mobilePhone: "",
    addressName: "",
    emailAddress: "",
    password: "",
    accountTypeStringMapFlag: "",
    ProgramCode: "073",
  });

  useEffect(() => {
    getPartinerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (value: any) => {
    setVerifyCaptcha(true);
  };

  const handleUpdatePartiner = () => {
    setIsLoading(true);
    updateDataPartiner(userDataPartiner)
      .then((res) => {
        getPartinerData();
        toast.success("Dados do Parceiro atualizado com sucesso!");
      })
      .catch((err) => {
        toast.error("Erro ao atualizar dados do parceiro!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getPartinerData = async () => {
    listDatePartiner(auth.id)
      .then((res) => {
        setUserDataPartiner(res);
      })
      .catch((err) => { });
  };

  const handleChangePartiner = (e: any) => {
    const { name, value } = e.target;
    setUserDataPartiner((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const passwordStrong = () => {
    strongPassword(userDataPartiner.password)
      .then((res) => {
        if (res.isValid === false) {
          res.policiesResult.forEach((policy: any) => {
            if (!policy.isValid) {
              toast.error(policy.message);
            }
          });
        } else {
          handleUpdatePartiner();
        }
      })
      .catch((err) => {
        toast.error("Erro ao verificar a senha");
      })
      .finally(() => { });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const maskedPhoneNumber = () => {
    return (
      <InputMask
        id="input-partiner-phone"
        name="mobilePhone"
        onChange={handleChangePartiner}
        value={userDataPartiner.mobilePhone}
        mask="(99) 99999-9999"
        alwaysShowMask={false}
        maskPlaceholder={null}
        disabled={!isEditing}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="Telefone"
            startIcon
            iconClass="scale-x-[-1]"
            imageSrc="/communication-call.png"
            variantStyle="grayBackground"
          />
        )}
      </InputMask>
    );
  };

  const maskedCpf = () => {
    return (
      <InputMask
        id="input-partiner-cnpj"
        name="cnpj"
        onChange={handleChangePartiner}
        value={userDataPartiner.cnpj}
        required
        disabled
        mask="99.999.999/9999-99"
        alwaysShowMask
        maskPlaceholder={null}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="CPF"
            startIcon
            imageSrc="/education-teacher.png"
            variantStyle="grayBackground"
          />
        )}
      </InputMask>
    );
  };

  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#FFF",
      "&:hover": {
        backgroundColor: alpha("#017749", theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#017749",
    },
  }));

  return (
    <div className="bg-white md:border md:border-careCyan rounded-lg p-8 fade-in px-48">
      {isLoading ? (
        <div className="spinner">
          <div className="dot1"></div>
          <div className="dot2"></div>
        </div>
      ) : (
        <>
          <div className="md:grid md:grid-cols-2 gap-8 md:my-5">
            <div>
              <span className="text-careBlue">Nome</span>
              <Input
                id="input-partiner-name"
                name="mainContact"
                onChange={handleChangePartiner}
                value={userDataPartiner.mainContact}
                fullWidth
                startIcon
                imageSrc="/user-user.png"
                variantStyle="grayBackground"
              />
            </div>
            <div>
              <span className="text-careBlue">Razão Social</span>
              <Input
                id="input-partiner-social-name"
                name="name"
                onChange={handleChangePartiner}
                value={userDataPartiner.name}
                fullWidth
                startIcon
                imageSrc="/health-hospital.png"
                disabled={!isEditing}
                variantStyle="grayBackground"
              />
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 gap-8 md:my-5">
            <div>
              <span className="text-careBlue">Meu CNPJ</span>
              {maskedCpf()}
            </div>
            <div>
              <span className="text-careBlue">Telefone</span>
              {maskedPhoneNumber()}
            </div>
          </div>
          <div className="md:grid md:grid-cols-1 gap-8 md:my-5">
            <div>
              <span className="text-careBlue">Endereço</span>
              <Input
                id="input-partiner-address"
                name="addressName"
                onChange={handleChangePartiner}
                value={userDataPartiner.addressName}
                fullWidth
                startIcon
                imageSrc="/navigation-maps.png"
                variantStyle="grayBackground"
              />
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 gap-8 md:my-5">
            <div>
              <span className="text-careBlue">Meu E-mail cadastrado</span>
              <Input
                id="input-partiner-email"
                name="emailAddress"
                onChange={handleChangePartiner}
                value={userDataPartiner.emailAddress}
                fullWidth
                startIcon
                imageSrc="/communication-mail.png"
                variantStyle="grayBackground"
              />
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 gap-8 my-5 fill-careBlue">
            <div>
              <span className="text-careBlue">Senha</span>
              <Input
                id="input-partiner-password"
                name="password"
                value={userDataPartiner.password}
                placeholder="Senha"
                startIcon
                imageSrc="/house-lock.png"
                endIcon
                type="password"
                onChange={handleChangePartiner}
                variantStyle="grayBackground"
              />
            </div>
            <div className="my-5 md:my-0">
              <span className="text-careBlue">Confirmar senha</span>
              <Input
                id="input-partiner-confirm-password"
                name="confirmedPassword"
                placeholder="Confirmar senha"
                startIcon
                imageSrc="/house-lock.png"
                endIcon
                type="password"
                variantStyle="grayBackground"
              />
            </div>
          </div>
          <div className="mt-3">
            <ReCAPTCHA
              id="input-partiner-captcha"
              sitekey="6LfYB54pAAAAANncwo4gIYJPaAT5zZczt2KbqHkn"
              onChange={onChange}
              theme="light"
              type="image"
            />
          </div>
          <CustomCheckbox
            label="Aceito receber comunicações e contatos nos canais informados acima."
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
          />
          <div className="flex justify-center mt-20">
            <Button
              customClass="bg-careDarkBlue border-careDarkBlue py-2 w-40"
              label="Cancelar"
              onClick={getPartinerData}
            />
            <Button
              customClass="bg-careLightBlue border-careLightBlue py-2 w-40 ml-2"
              label="Salvar"
              disabled={!isEditing || !verifyCaptcha}
              onClick={passwordStrong}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DataPartiner;
