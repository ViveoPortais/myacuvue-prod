import React, { useEffect, useState } from "react";
import useLogin from "@/hooks/useLogin";
import Input from "@/components/input/Input";
import InputMask from "react-input-mask";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import Button from "@/components/button/Button";
import {
  editClientData,
  getClientData,
  strongPassword,
} from "@/services/login";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useDataStorage from "@/hooks/useDataStorage";
import ReCAPTCHA from "react-google-recaptcha";
import CustomCheckbox from "../custom/customCheckbox";


const DataPatient = () => {
  const auth = useLogin();
  const router = useRouter();
  const dataStorage = useDataStorage();

  const [focus, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyCaptcha, setVerifyCaptcha] = useState(false);

  const [editData, setEditData] = useState({
    User: {
      Email: "",
      Password: "",
    },
    name: "",
    confirmedPassword: "",
    birthdate: "",
    mobilephone: "",
    cpf: "",
    programCode: "073",
  });

  useEffect(() => {
    handleGetUserData();
  }, [auth]);

  const onChange = (value: any) => {
    setVerifyCaptcha(true);
  };

  const editDataPatient = () => {
    setIsLoading(true);
    editClientData(editData)
      .then(() => {
        toast.success("Dados alterados com sucesso");
      })
      .catch(() => {
        toast.error("Erro ao alterar dados");
      })
      .finally(() => {
        setIsEditing(false);
        setIsLoading(false);
      });
  };

  const handleGetUserData = () => {
    setIsLoading(true);
    getClientData()
      .then((res) => {
        setIsLoading(false);
        res.data.map((data: any) => {
          setEditData((prevData) => ({
            ...prevData,
            User: {
              Email: data.patientEmail,
              Password: data.patientUserPassword,
            },
            name: data.namePatient,
            confirmedPassword: data.patientUserPassword,
            birthdate: dayjs(data.patientBirthDate).format("YYYY-MM-DD"),
            mobilephone: data.patientMobilephone,
            cpf: data.cpf,
            programCode: "073",
          }));
        });
      })
      .catch((err) => { })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "Email") {
      setEditData((prevData) => ({
        ...prevData,
        User: {
          ...prevData.User,
          Email: value,
        },
      }));
      return;
    }
    if (name === "Password") {
      setEditData((prevData) => ({
        ...prevData,
        User: {
          ...prevData.User,
          Password: value,
        },
      }));
      return;
    }
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!validateEmail(editData.User.Email)) return;
    if (!validatePassword()) return;
    if (editData.User.Password !== editData.confirmedPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    strongPassword(editData.User.Password)
      .then((res) => {
        if (res.isValid === false) {
          res.policiesResult.forEach((policy: any) => {
            if (!policy.isValid) {
              toast.error(policy.message);
            }
          });
          return;
        }

        editDataPatient();
      })
      .catch(() => {
        toast.error("Erro ao verificar a senha");
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const maskedPhoneNumber = () => {
    return (
      <InputMask
        id="mobilephone-data-patient"
        onChange={handleChange}
        name="mobilephone"
        value={editData.mobilephone}
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
        id="cpf-data-patient"
        onChange={handleChange}
        name="cpf"
        value={editData.cpf}
        disabled
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

  const [consentGiven, setConsentGiven] = useState(false);

  const validateEmail = (email: string) => {
    if (email === "") {
      toast.error("Preencha com um e-mail válido!");
      return false;
    }
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      toast.error("E-mail inválido!");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const password = editData.User.Password;

    if (password.length < 8) {
      toast.error("A senha deve conter no mínimo 8 dígitos!");
      return false;
    }
    if (password.length > 20) {
      toast.error("A senha deve conter no máximo 20 dígitos!");
      return false;
    }
    if (password === "") {
      toast.error("Preencha com uma senha válida!");
      return false;
    }
    if (password.indexOf(" ") !== -1) {
      toast.error("A senha não pode conter espaços!");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("A senha deve conter pelo menos uma letra maiúscula!");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("A senha deve conter pelo menos uma letra minúscula!");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("A senha deve conter pelo menos um número!");
      return false;
    }
    if (!/[\W_]/.test(password)) {
      toast.error("A senha deve conter pelo menos um caractere especial!");
      return false;
    }
    return true;
  };

  return (
    <div className="bg-white md:border md:border-careCyan rounded-lg p-8 fade-in px-48">
      {isLoading ? (
        <div className="spinner">
          <div className="dot1"></div>
          <div className="dot2"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <span className="text-careBlue">Nome</span>
            <Input
              id="name-data-patient"
              onChange={handleChange}
              name="name"
              value={editData.name}
              placeholder="Seu nome"
              fullWidth
              startIcon
              imageSrc="/user-user.png"
              disabled={!isEditing}
              variantStyle="grayBackground"
            />
          </div>
          <div className="my-5 md:grid md:grid-cols-2 gap-8 md:my-5">
            <div className="flex flex-col">
              <span className="text-careBlue">E-mail</span>
              <Input
                id="email-data-patient"
                onChange={handleChange}
                onBlur={() => validateEmail(editData.User.Email)}
                name="Email"
                value={editData.User.Email}
                placeholder="E-mail"
                required
                startIcon
                imageSrc="/communication-mail.png"
                disabled={!isEditing}
                maxLength={255}
                variantStyle="grayBackground"
              />
            </div>
            <div className="my-5 md:my-0">
              <span className="text-careBlue">Data de nascimento</span>
              <Input
                id="birthdate-data-patient"
                name="birthdate"
                value={dayjs(editData.birthdate).format("DD/MM/YYYY")}
                disabled
                placeholder="Data de nascimento"
                startIcon
                imageSrc="/calendar-data.png"
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
                id="password-data-patient"
                name="Password"
                value={editData.User.Password}
                disabled={!isEditing}
                placeholder="Senha"
                startIcon
                className=""
                imageSrc="/house-lock.png"
                endIcon
                type="password"
                onChange={handleChange}
                onBlur={() => validatePassword()}
                maxLength={255}
                variantStyle="grayBackground"
              />
            </div>
            <div className="my-5 md:my-0">
              <span className="text-careBlue">Confirmar senha</span>
              <Input
                id="confirmedPassword-data-patient"
                name="confirmedPassword"
                disabled={!isEditing}
                placeholder="Confirmar senha"
                startIcon
                imageSrc="/house-lock.png"
                endIcon
                type="password"
                onChange={handleChange}
                onBlur={() => {
                  if (editData.User.Password !== editData.confirmedPassword) {
                    toast.error("As senhas não coincidem!");
                  }
                }}
                maxLength={255}
                variantStyle="grayBackground"
              />
            </div>
          </div>
          <div className="mt-3">
            <ReCAPTCHA
              id="recaptcha-data-patient"
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
              id="cancel-data-patient"
              customClass="bg-careDarkBlue border-careDarkBlue py-2 w-40"
              label="Cancelar"
              onClick={handleGetUserData}
            />
            <Button
              id="save-data-patient"
              customClass="bg-careLightBlue border-careLightBlue py-2 w-40 ml-2"
              label="Salvar"
              disabled={!isEditing || !verifyCaptcha}
              onClick={handleSave}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DataPatient;
