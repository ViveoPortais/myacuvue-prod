import React, { useEffect, useState } from "react";
import Input from "@/components/input/Input";
import InputMask from "react-input-mask";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import Button from "@/components/button/Button";
import useLogin from "@/hooks/useLogin";
import { editAdminData, getAdmData, strongPassword } from "@/services/login";
import { toast } from "react-toastify";
const label = { inputProps: { "aria-label": "Switch demo" } };
import dayjs from "dayjs";
import ReCAPTCHA from "react-google-recaptcha";
import CustomCheckbox from "../custom/customCheckbox";

const DataAdmin = () => {
  const auth = useLogin();
  const [focus, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const [userDataAdm, setUserDataAdm] = useState({
    userName: "",
    userEmail: "",
    userBirthdate: "",
    userCPF: "",
    userMobilephone: "",
    userPassword: "",
    programCode: "073",
  });
  const [verifyCaptcha, setVerifyCaptcha] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    handleGetAdmData();
  }, [auth]);

  const onChange = (value: any) => {
    setVerifyCaptcha(true);
  };

  const editDataAdmin = () => {
    setIsLoading(true);
    editAdminData(userDataAdm)
      .then(() => {
        toast.success("Dados alterados com sucesso");
      })
      .catch(() => {
        toast.error("Erro ao alterar dados");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGetAdmData = async () => {
    setIsLoading(true);
    getAdmData()
      .then((res) => {
        setIsLoading(false);
        setUserDataAdm((prevData) => ({
          ...prevData,
          userName: res.userName,
          userEmail: res.userEmail,
          userBirthdate: dayjs(res.userBirthdate).format("YYYY-MM-DD"),
          userCPF: res.userCPF,
          userMobilephone: res.userMobilephone,
          userPassword: res.userPassword,
        }));
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserDataAdm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const passwordStrong = () => {
    strongPassword(userDataAdm.userPassword)
      .then((res) => {
        if (res.isValid === false) {
          res.policiesResult.forEach((policy: any) => {
            if (!policy.isValid) {
              toast.error(policy.message);
            }
          });
        } else {
          editDataAdmin();
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
        id="input-edit-admin-phone"
        onChange={handleChange}
        name="userMobilephone"
        value={userDataAdm.userMobilephone}
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
        id="input-edit-admin-cpf"
        onChange={handleChange}
        name="userCPF"
        value={userDataAdm.userCPF}
        disabled={!isEditing}
        mask="999.999.999-99"
        alwaysShowMask
        maskPlaceholder={null}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="CPF"
            startIcon
            disabled
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
    <div className="bg-careGrey rounded-2xl p-8 fill-careBlue fade-in">
      {isLoading ? (
        <div className="spinner">
          <div className="dot1"></div>
          <div className="dot2"></div>
        </div>
      ) : (
        <>
          <div>
            <span className="text-careBlue">Nome</span>
            <Input
              id="input-edit-admin-name"
              onChange={handleChange}
              name="userName"
              value={userDataAdm.userName}
              placeholder="Seu nome"
              fullWidth
              startIcon
              imageSrc="/user-user.png"
              disabled={!isEditing}
              variantStyle="grayBackground"
            />
          </div>
          <div className="my-5 md:grid md:grid-cols-2 gap-8 md:my-5">
            <div>
              <span className="text-careBlue">E-mail</span>
              <Input
                id="input-edit-admin-email"
                onChange={handleChange}
                name="userEmail"
                value={userDataAdm.userEmail}
                placeholder="E-mail"
                required
                startIcon
                imageSrc="/communication-mail.png"
                disabled={!isEditing}
                variantStyle="grayBackground"
              />
            </div>
            <div className="my-5 md:my-0">
              <span className="text-careBlue">Data de nascimento</span>
              <Input
                id="input-edit-admin-birthdate"
                name="userBirthdate"
                value={userDataAdm.userBirthdate}
                disabled={!isEditing}
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder="Data de nascimento"
                startIcon
                imageSrc="/calendar-data.png"
                onChange={handleChange}
                type={hasValue || focus ? "date" : "text"}
                variantStyle="grayBackground"
              />
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 gap-8 md:my-5">
            <div>
              <span className="text-careBlue">Telefone</span>
              {maskedPhoneNumber()}
            </div>
            <div className="my-5 md:my-0">
              <span className="text-careBlue">CPF</span>
              {maskedCpf()}
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 gap-8 my-5 fill-careBlue">
            <div>
              <span className="text-careBlue">Senha</span>
              <Input
                id="input-edit-admin-password"
                name="userPassword"
                value={userDataAdm.userPassword}
                disabled={!isEditing}
                placeholder="Senha"
                startIcon
                className=""
                imageSrc="/house-lock.png"
                endIcon
                type="password"
                onChange={handleChange}
                variantStyle="grayBackground"
              />
            </div>
            <div className="my-5 md:my-0">
              <span className="text-careBlue">Confirmar senha</span>
              <Input
                id="input-edit-admin-confirm-password"
                name="confirmedPassword"
                disabled={!isEditing}
                placeholder="Confirmar senha"
                startIcon
                imageSrc="/house-lock.png"
                endIcon
                type="password"
                onChange={handleChange}
                variantStyle="grayBackground"
              />
            </div>
          </div>
          <div className="mt-3">
            <ReCAPTCHA
              id="input-edit-admin-captcha"
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
              id="button-edit-admin-cancel"
              customClass="bg-careDarkBlue border-careDarkBlue py-2 w-40"
              label="Cancelar"
              onClick={handleGetAdmData}
            />
            <Button
              id="button-edit-admin-save"
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

export default DataAdmin;
